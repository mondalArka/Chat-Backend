import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateMessageDto } from "./dto/createMessage.dto";
import { MessageRepository } from "src/repositories/message.repositories";
import { MediaRepository } from "src/repositories/media.repositories";
import { getFileType } from "src/helpers/mime-finder";
import { Media } from "src/entities/Media.entity";
import { ApiResponse } from "src/interfaces.enums/response.types";
import { UserType } from "src/interfaces.enums/user.types";
import { ParticipantRepository } from "src/repositories/participant.repositories";
import { Not } from "typeorm";
import { ChatRepository } from "src/repositories/chat.reposiotries";
import { SocketGateway } from "../websocket/socket.service";

@Injectable()
export class MessageService {
    constructor(
        @Inject("MESSAGE_REPOSITORY")
        private readonly messageRepository: MessageRepository,
        @Inject("MEDIA_REPOSITORY")
        private readonly mediaRepo: MediaRepository,
        @Inject("PARTICIPANT_REPOSITORY")
        private readonly participantRepo: ParticipantRepository,
        @Inject("CHAT_REPOSITORY")
        private readonly chatRepo: ChatRepository,
        private readonly socketGateway: SocketGateway
    ) { }

    async createNewMessage(
        body: CreateMessageDto,
        files: { docs?: Express.Multer.File[] },
        user: UserType | null
    ): Promise<ApiResponse<{}>> {
        const save = await this.messageRepository.saveMessage({ ...body, senderId: user?.id });
        let docData: Partial<Media>[] = [];
        if (files && files.docs && files.docs.length > 0) {
            docData = files.docs.map((file, index) => {
                const type = getFileType(file.mimetype);
                return {
                    fileName: file.filename,
                    originalName: file.originalname,
                    type,
                    size: file.size,
                    order: index + 1,
                    messageId: save.id
                };
            }) as Partial<Media>[];
            await this.mediaRepo.insertMedia(docData);
        }

        await this.chatRepo.update(
            body.chatId,
            { lastMessage: { id: save.id } }
        );
        await this.participantRepo.increment({
            chatId: body.chatId,
            userId: Not(user!.id as string),
        },
            "unreadCount", 1);

        this.socketGateway.sendMessage({
            message: save.message,
            chatId: body.chatId
        });
        return {
            statusCode: 200,
            success: true,
            message: "Message sent successfully",
            data: {}
        }
    }
}