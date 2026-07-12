import { Module } from "@nestjs/common";
import { MessageController } from "./message.controller";
import { MessageService } from "./message.service";
import { RepositoryModule } from "src/repositories/repository.module";
import { SocketModule } from "../websocket/socket.module";
import { RedisModule } from "../redis/redis.module";
import { ChatRepo, MediaRepo, MessageRepo, NotificationRepo, ParticipantRepo } from "src/repositories/index.repositories";

@Module({
    imports: [
        RepositoryModule.forFeature([
            MessageRepo,
            ParticipantRepo,
            MediaRepo,
            ChatRepo,
            NotificationRepo
        ]),
        RedisModule,
        SocketModule
    ],
    controllers: [MessageController],
    providers: [MessageService],
})
export class MessageModule { }