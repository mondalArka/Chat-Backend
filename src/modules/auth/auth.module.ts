import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { RepositoryModule } from "src/repositories/repository.module";
import { BullModule } from "@nestjs/bullmq";
import { RedisModule } from "../redis/redis.module";
import { SessionRepo, UserRepo } from "src/repositories/index.repositories";

@Module({
    imports: [
        RepositoryModule.forFeature([UserRepo, SessionRepo]),
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