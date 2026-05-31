import { Module } from "@nestjs/common";
import { MessageController } from "./message.controller";
import { MessageService } from "./message.service";
import { RepositoryModule } from "src/repositories/repository.module";
import { SocketModule } from "../websocket/socket.module";
import { RedisModule } from "../redis/redis.module";

@Module({
    imports: [
        RepositoryModule.forFeature([
            "MESSAGE_REPOSITORY",
            "PARTICIPANT_REPOSITORY",
            "MEDIA_REPOSITORY",
            "CHAT_REPOSITORY"
        ]),
        RedisModule,
        SocketModule
    ],
    controllers: [MessageController],
    providers: [MessageService],
})
export class MessageModule { }