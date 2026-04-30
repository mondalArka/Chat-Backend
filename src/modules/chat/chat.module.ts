import { Module } from "@nestjs/common";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { RepositoryModule } from "src/repositories/repository.module";

@Module({
    imports: [
        RepositoryModule.forFeature(["CHAT_REPOSITORY", "PARTICIPANT_REPOSITORY"])
    ],
    providers: [ChatService],
    controllers: [ChatController]
})
export class ChatModule { }