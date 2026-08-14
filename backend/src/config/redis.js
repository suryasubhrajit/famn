import Redis from 'ioredis';

let redisClient = null;

export const initRedis = async () => {
  const rawUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

  try {
    // Upstash requires TLS (rediss://) even if the user accidentally stored redis://
    // Force rediss:// for any Upstash-hosted URL
    const isUpstash = rawUrl.includes('upstash.io');
    const url = isUpstash ? rawUrl.replace(/^redis:\/\//, 'rediss://') : rawUrl;
    const isTls = url.startsWith('rediss://') || isUpstash;

    const client = new Redis(url, {
      lazyConnect: true,
      maxRetriesPerRequest: 3,
      enableOfflineQueue: false,
      connectTimeout: 8000,
      tls: isTls ? { rejectUnauthorized: false } : undefined,
    });

    client.on('error', (err) => {
      // Suppress repeat connection noise but still log first occurrence
      console.warn('[Redis Warning]', err.message);
    });

    await client.connect();
    redisClient = client;
    console.log('✅ Connected to Upstash Redis Ephemeral Cache');
  } catch (err) {
    redisClient = null;
    console.log('ℹ️ Running in Ephemeral In-Memory Store Mode (Upstash Redis offline or connecting)');
  }
};

export const getRedisClient = () => redisClient;
