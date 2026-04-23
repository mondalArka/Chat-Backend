import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { RepositoryModule } from "src/repositories/repository.module";
import { BullModule } from "@nestjs/bullmq";
import { RedisModule } from "../redis/redis.module";

@Module({
    imports: [
        RepositoryModule.forFeature(["USER_REPOSITORY", "SESSION_REPOSITORY"]),
        BullModule.registerQueue({
            name: "email-queue"
        }),
        RedisModule
    ],
    controllers: [
        AuthController
    ],
    providers: [
        AuthService,
    ],
})

export class AuthModule { }