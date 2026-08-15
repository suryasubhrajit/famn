import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { authenticator } = require('otplib');
import { getRedisClient } from '../config/redis.js';
import { mongoPoolManager } from '../config/mongoMultiDb.js';
import { getTelemetryKpis } from '../services/roomService.js';

export const renderHealthDashboard = (req, res) => {
  const dashboardPath = path.join(process.cwd(), 'public', 'health.html');
  res.sendFile(dashboardPath);
};

export const verifyHealthPassword = (req, res) => {
  const { password } = req.body || {};
  const expectedPass = process.env.HEALTH_DASHBOARD_PASSWORD || 'famn_admin_2026';

  if (!password || password !== expectedPass) {
    return res.status(401).json({ success: false, error: 'Invalid security password' });
  }

  return res.json({
    success: true,
    message: 'Authenticated successfully',
    authToken: 'famn_health_authenticated_session',
  });
};

export const verifyHealthTotp = (req, res) => {
  const { code } = req.body || {};
  const secret = process.env.TOTP_SECRET || 'JBSWY3DPEHPK3PXP';

  if (!code) {
    return res.status(400).json({ success: false, error: 'Please enter a 6-digit TOTP code' });
  }

  try {
    const isValid = authenticator.check(String(code).trim(), secret);
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Invalid 6-digit Google Authenticator code' });
    }

    return res.json({
      success: true,
      message: 'TOTP 2FA verified successfully',
      authToken: 'famn_health_authenticated_session',
    });
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Failed to verify TOTP code: ' + err.message });
  }
};

export const getTotpSetupInfo = (req, res) => {
  const secret = process.env.TOTP_SECRET || 'JBSWY3DPEHPK3PXP';
  const otpauth = authenticator.keyuri('admin@famn', 'FAMN Health Telemetry', secret);
  return res.json({
    secret,
    otpauth,
  });
};

export const getHealthStatus = async (req, res) => {
  const redis = getRedisClient();
  const mongoHealthyCount = mongoPoolManager.getHealthyConnections().length;
  const mongoTotalPools = mongoPoolManager.connections.length;

  let redisPingMs = -1;
  if (redis && redis.status === 'ready') {
    const rStart = Date.now();
    try {
      await redis.ping();
      redisPingMs = Date.now() - rStart;
    } catch (e) {}
  }

  const poolMetrics = await mongoPoolManager.getPoolMetrics();
  const kpis = await getTelemetryKpis();

  // Average DB latency
  const healthyPings = poolMetrics.filter((p) => p.latencyMs > 0).map((p) => p.latencyMs);
  if (redisPingMs > 0) healthyPings.push(redisPingMs);
  const avgDbLatencyMs = healthyPings.length > 0 
    ? Math.round(healthyPings.reduce((a, b) => a + b, 0) / healthyPings.length) 
    : 12;

  res.json({
    status: 'ok',
    service: 'FAMN Ephemeral Chat Backend',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    kpis: {
      activeRooms: kpis.activeRooms,
      totalMessages: kpis.totalMessages,
      avgDbLatencyMs,
    },
    services: {
      redis: {
        status: redis && redis.status === 'ready' ? 'HEALTHY' : 'DEGRADED_OR_OFFLINE',
        mode: redis ? 'Cloud Redis' : 'In-Memory Ephemeral Fallback',
        latencyMs: redisPingMs,
      },
      mongodbMultiCluster: {
        status: mongoHealthyCount > 0 ? 'HEALTHY' : mongoTotalPools > 0 ? 'FAILOVER_ACTIVE' : 'NOT_CONFIGURED',
        healthyPools: mongoHealthyCount,
        totalPools: mongoTotalPools,
        pools: poolMetrics,
      },
    },
    system: {
      nodeVersion: process.version,
      memoryUsageMB: Math.round(process.memoryUsage().rss / (1024 * 1024)),
    },
  });
};
