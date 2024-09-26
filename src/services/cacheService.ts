import { createClient, RedisClientType } from 'redis';
import { URL_EXPIRATION_DAYS } from '../config/constants';

class CacheService {
  private client: RedisClientType;
  private isConnected: boolean = false;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    this.client.on('error', (err) => console.error('Redis Client Error', err));
    this.client.on('connect', () => {
      console.log('Connected to Redis');
      this.isConnected = true;
    });
    this.client.on('end', () => {
      console.log('Disconnected from Redis');
      this.isConnected = false;
    });
  }

  async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.client.connect();
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.quit();
    }
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async set(key: string, value: string, expirationDays: number = URL_EXPIRATION_DAYS): Promise<void> {
    await this.client.set(key, value, {
      EX: expirationDays * 24 * 60 * 60, // Convert days to seconds
    });
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  async flush(): Promise<void> {
    await this.client.flushAll();
  }

  // Helper method to create a cache key for a short code
  static createShortCodeKey(shortCode: string): string {
    return `shortcode:${shortCode}`;
  }
}

// Create and export a singleton instance
export { CacheService };
export const cacheService = new CacheService();