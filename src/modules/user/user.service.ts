import { Inject, Injectable } from "@nestjs/common";
import Redis from "ioredis";
import { User } from "src/entities/User.entity";
import { ApiResponse } from "src/interfaces.enums/response.types";
import { UserType } from "src/interfaces.enums/user.types";
import { UserRepository } from "src/repositories/user.repository";
import { Not } from "typeorm";
import { RedisProvider } from "../redis/redis.provider";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UserService {
    private readonly redis: Redis;
    private readonly redisExpire: number;
    constructor(
        @Inject("USER_REPOSITORY")
        private readonly userRepo: UserRepository,
        private readonly redisService: RedisProvider,
        private readonly configService: ConfigService
    ) {
        this.redis = this.redisService.getRedisClient();
        this.redisExpire = Number(this.configService.get("REDIS_EXPIRE")) + 2700; // 1hr
    }

    async getAllUser(user: UserType, refresh: boolean = false): Promise<ApiResponse<User[]>> {
        const cache = await this.redis.get(`${user.id}:getAllUsers`);
        if (cache && !refresh)
            return {
                statusCode: 200,
                success: true,
                message: "Users fetched successfully",
                data: JSON.parse(cache)
            };

        const data = await this.userRepo.find({ where: { id: Not(user.id) }, select: ["id", "name", "email"] });
        await this.redis.set(
            `${user.id}:getAllUsers`,
            JSON.stringify(data),
            "EX", this.redisExpire
        );
        return {
            statusCode: 200,
            success: true,
            message: "Users fetched successfully",
            data
        };
    }
}