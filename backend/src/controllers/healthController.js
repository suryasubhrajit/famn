import path from 'path';
import { getRedisClient } from '../config/redis.js';
import { mongoPoolManager } from '../config/mongoMultiDb.js';

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

export const getHealthStatus = (req, res) => {
  const redis = getRedisClient();
  const mongoHealthyCount = mongoPoolManager.getHealthyConnections().length;
  const mongoTotalPools = mongoPoolManager.connections.length;

  res.json({
    status: 'ok',
    service: 'FAMN Ephemeral Chat Backend',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    services: {
      redis: {
        status: redis && redis.status === 'ready' ? 'HEALTHY' : 'DEGRADED_OR_OFFLINE',
        mode: redis ? 'Cloud Redis' : 'In-Memory Ephemeral Fallback',
      },
      mongodbMultiCluster: {
        status: mongoHealthyCount > 0 ? 'HEALTHY' : mongoTotalPools > 0 ? 'FAILOVER_ACTIVE' : 'NOT_CONFIGURED',
        healthyPools: mongoHealthyCount,
        totalPools: mongoTotalPools,
        pools: mongoPoolManager.connections.map((p) => ({
          id: p.id,
          status: p.isHealthy() ? 'CONNECTED' : 'DISCONNECTED',
        })),
      },
    },
    system: {
      nodeVersion: process.version,
      memoryUsageMB: Math.round(process.memoryUsage().rss / (1024 * 1024)),
    },
  });
};
