import mongoose from 'mongoose';

class MongoMultiDbPool {
  constructor() {
    this.connections = [];
    this.currentIndex = 0;
    this.isInitialized = false;
  }

  /**
   * Parse environment variables for MongoDB URIs.
   * Accepts:
   * 1. MONGODB_URIS=uri1,uri2,uri3 (comma-separated)
   * 2. MONGODB_URI_1, MONGODB_URI_2, MONGODB_URI_3...
   * 3. MONGODB_URI / MONGO_URI
   */
  getUrisFromEnv() {
    const uris = [];

    if (process.env.MONGODB_URIS) {
      const splitUris = process.env.MONGODB_URIS.split(',').map((u) => u.trim()).filter(Boolean);
      uris.push(...splitUris);
    }

    let i = 1;
    while (process.env[`MONGODB_URI_${i}`]) {
      const uri = process.env[`MONGODB_URI_${i}`].trim();
      if (uri && !uris.includes(uri)) {
        uris.push(uri);
      }
      i++;
    }

    if (uris.length === 0) {
      const single = process.env.MONGODB_URI || process.env.MONGO_URI;
      if (single && single.trim()) {
        uris.push(single.trim());
      }
    }

    return uris;
  }

  /**
   * Initialize all MongoDB Atlas connection pools
   */
  async init() {
    const uris = this.getUrisFromEnv();

    if (uris.length === 0) {
      console.log('ℹ️ No MONGODB_URIS configured. Running in Redis / In-Memory ephemeral mode.');
      return;
    }

    console.log(`🔌 Initializing ${uris.length} MongoDB Atlas connection pools for failover & load balancing...`);

    const connectionPromises = uris.map(async (uri, index) => {
      try {
        // Redact credentials for safe logging
        const sanitizedUri = uri.replace(/\/\/(.*):(.*)@/, '//***:***@');
        console.log(`⏳ Connecting to MongoDB Pool #${index + 1}: ${sanitizedUri}`);

        const conn = mongoose.createConnection(uri, {
          maxPoolSize: 10,
          minPoolSize: 2,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
        });

        conn.on('connected', () => {
          console.log(`✅ MongoDB Pool #${index + 1} connected successfully`);
        });

        conn.on('error', (err) => {
          console.warn(`⚠️ MongoDB Pool #${index + 1} Error:`, err.message);
        });

        conn.on('disconnected', () => {
          console.warn(`🚨 MongoDB Pool #${index + 1} disconnected`);
        });

        // Wait for connection readyState (1 = connected)
        await new Promise((resolve) => {
          if (conn.readyState === 1) return resolve(true);
          conn.once('connected', () => resolve(true));
          conn.once('error', () => resolve(false));
          setTimeout(() => resolve(false), 5000);
        });

        return {
          id: index + 1,
          uri,
          conn,
          isHealthy: () => conn.readyState === 1,
        };
      } catch (error) {
        console.error(`❌ Failed to create MongoDB Pool #${index + 1}:`, error.message);
        return null;
      }
    });

    const results = await Promise.all(connectionPromises);
    this.connections = results.filter(Boolean);
    this.isInitialized = this.connections.length > 0;

    const healthyCount = this.getHealthyConnections().length;
    if (healthyCount > 0) {
      console.log(`🚀 Multi-MongoDB Cluster Active: ${healthyCount}/${this.connections.length} pools healthy & ready`);
    } else {
      console.warn('⚠️ No healthy MongoDB connection pools established. System will use ephemeral store mode.');
    }
  }

  /**
   * Returns all currently healthy connection pools
   */
  getHealthyConnections() {
    return this.connections.filter((item) => item.isHealthy());
  }

  /**
   * Returns next healthy connection using round-robin distribution
   */
  getRoundRobinConnection() {
    const healthy = this.getHealthyConnections();
    if (healthy.length === 0) return null;

    const selected = healthy[this.currentIndex % healthy.length];
    this.currentIndex++;
    return selected.conn;
  }

  /**
   * Execute an operation with automatic multi-DB failover
   */
  async executeWithFailover(operation) {
    const healthyPools = this.getHealthyConnections();

    if (healthyPools.length === 0) {
      throw new Error('No healthy MongoDB connection pools available');
    }

    // Start with next round-robin pool, then try others if it fails
    const startIndex = this.currentIndex % healthyPools.length;
    this.currentIndex++;

    let lastError = null;
    for (let i = 0; i < healthyPools.length; i++) {
      const poolIndex = (startIndex + i) % healthyPools.length;
      const targetPool = healthyPools[poolIndex];

      try {
        return await operation(targetPool.conn);
      } catch (err) {
        console.warn(`⚠️ Operation failed on MongoDB Pool #${targetPool.id}. Attempting failover to next pool...`, err.message);
        lastError = err;
      }
    }

    throw new Error(`All MongoDB connection pools failed execution. Last error: ${lastError?.message}`);
  }
}

export const mongoPoolManager = new MongoMultiDbPool();

export const initMongoPool = async () => {
  await mongoPoolManager.init();
};
