import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisProvider implements OnModuleDestroy {
  private readonly redisClient: Redis;
  constructor(configService: ConfigService) {
    const hasRedisUrl = configService.get('REDIS_URL');
    this.redisClient = hasRedisUrl
      ? new Redis(configService.getOrThrow<string>('REDIS_URL'))
      : new Redis({
          host: configService.getOrThrow<string>('REDIS_HOST'),
          port: Number(configService.getOrThrow<string>('REDIS_PORT')),
        });

    this.redisClient.on('error', (error) => {
      console.error('Error connecting to Redis', error);
    });

    this.redisClient.on('connect', () => {
      console.log('Connected to Redis');
    });
  }

  getRedisClient() {
    return this.redisClient;
  }

  async onModuleDestroy() {
    console.log('Closing redis');
    await this.redisClient.quit();
  }
}
