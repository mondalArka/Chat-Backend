import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { RepositoryModule } from "src/repositories/repository.module";
import { RedisModule } from "../redis/redis.module";

@Module({
    imports: [
        RepositoryModule.forFeature([
            "USER_REPOSITORY"
        ]),
        RedisModule
    ],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule { }