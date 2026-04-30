import { Module } from "@nestjs/common";
import { SocketGateway } from "./socket.service";
import { RedisModule } from "../redis/redis.module";
import { RepositoryModule } from "src/repositories/repository.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        RedisModule,
        RepositoryModule.forFeature(["USER_REPOSITORY", "PARTICIPANT_REPOSITORY"]),
        JwtModule
    ],
    controllers: [],
    providers: [
        SocketGateway
    ],
    exports: [SocketGateway]
})
export class SocketModule { }