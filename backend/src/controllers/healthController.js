import { getRedisClient } from '../config/redis.js';

export const getHealthStatus = (req, res) => {
  const redis = getRedisClient();

  res.json({
    status: 'ok',
    uptime: process.uptime(),
    redisConnected: Boolean(redis && redis.status === 'ready'),
    timestamp: new Date().toISOString(),
  });
};
