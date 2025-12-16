import { RedisClient } from "./../../config/redis";

export abstract class BaseCacheService {
  protected redisClient: RedisClient;

  constructor(client: RedisClient) {
    this.redisClient = client;
  }

  async setKey(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redisClient.set(key, value, { EX: ttl });
    } else {
      await this.redisClient.set(key, value);
    }
  }

  async getKey(key: string): Promise<string | null> {
    const data = await this.redisClient.get(key);
    if (Buffer.isBuffer(data)) return data.toString();
    return data;
  }

  async deleteKey(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}
