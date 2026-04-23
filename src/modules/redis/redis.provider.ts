import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

@Injectable()
export class RedisProvider implements OnModuleDestroy {
    private readonly redisClient: Redis;
    constructor(configService: ConfigService) {
        this.redisClient = new Redis({
            host: String(configService.get("REDIS_HOST")),
            port: Number(configService.get("REDIS_PORT")),
        });

        this.redisClient.on("error", (error) => {
            console.error("Error connecting to Redis", error);
        });

        this.redisClient.on("connect", () => {
            console.log("Connected to Redis");
        });
    }

    getRedisClient() {
        return this.redisClient;
    }

    async onModuleDestroy() {
        console.log("Closing redis");
        await this.redisClient.quit();
    }
}