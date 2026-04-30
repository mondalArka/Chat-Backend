import { Module } from "@nestjs/common";
import { MessageController } from "./message.controller";
import { MessageService } from "./message.service";
import { RepositoryModule } from "src/repositories/repository.module";

@Module({
    imports: [
        RepositoryModule.forFeature([
            "MESSAGE_REPOSITORY",
            "PARTICIPANT_REPOSITORY",
            "MEDIA_REPOSITORY"
        ])
    ],
    controllers: [MessageController],
    providers: [MessageService],
})
export class MessageModule { }