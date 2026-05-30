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
import { Message } from "src/entities/Message.entity";

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
    ): Promise<ApiResponse<any>> {
        let getReplyMessage: Message | null = null;

        if (body.replyToMessageId) {
            getReplyMessage = await this.messageRepository.findOne({
                where: {
                    id: body.replyToMessageId
                },
                relations: ["medias"]
            });
        }
        const save = await this.messageRepository.saveMessage(
            {
                ...body,
                senderId: user?.id,
                ...(body.replyToMessageId && { replyToMessage: { id: body.replyToMessageId } }) as Partial<Message>
            });

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

        const [updation, finUnread] = await Promise.all([
            this.chatRepo.update(
                body.chatId,
                { lastMessage: { id: save.id } }
            ),
            this.participantRepo.findOne({
                where: {
                    chatId: body.chatId,
                    userId: Not(user!.id as string),
                },
            })
        ]);

        await this.participantRepo.update({
            chatId: body.chatId,
            userId: Not(user!.id as string),
        },
            { unreadCount: (finUnread!.unreadCount + 1) || 1 });

        this.socketGateway.sendMessage({
            id: save.id,
            message: save.message,
            chatId: body.chatId,
            type: save.type,
            sender: {
                id: user?.id as string,
                email: user?.email as string,
                name: user?.name as string
            },
            ...(body.replyToMessageId && { replyToMessage: getReplyMessage }),
            isRead: false,
            unreadCount: (finUnread!.unreadCount + 1) || 1,
            medias: docData,
            createdAt: save.createdAt,
            updatedAt: save.updatedAt,
            deletedAt: save.deletedAt
        });

        return {
            statusCode: 200,
            success: true,
            message: "Message sent successfully",
            data: {
                id: save.id,
                message: save.message,
                chatId: body.chatId,
                type: save.type,
                sender: {
                    id: user?.id as string,
                    email: user?.email as string,
                    name: user?.name as string
                },
                ...(body.replyToMessageId && { replyTo: getReplyMessage }),
                ...(docData.length > 0 && { medias: docData }),
                createdAt: save.createdAt,
                updatedAt: save.updatedAt,
                deletedAt: save.deletedAt
            }
        }
    }

    async getMessage(chatId: string): Promise<ApiResponse<Partial<Message[]>>> {
        const message = await this.messageRepository.find({
            where: { chatId },
            relations: ["sender", "medias", "replyToMessage", "replyToMessage.medias"]
        });
        return {
            statusCode: 200,
            success: true,
            message: "Messages fetched successfully",
            data: message
        }
    }
}