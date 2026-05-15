import { ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { Chat } from "src/entities/Chat.entity";
import { ApiResponse } from "src/interfaces.enums/response.types";
import { ChatRepository } from "src/repositories/chat.reposiotries";
import { CreateChatDto } from "./dto/createChat.dto";
import { ParticipantRepository } from "src/repositories/participant.repositories";
import { Participant } from "src/entities/Participant.entity";
import { UserType } from "src/interfaces.enums/user.types";
import { In } from "typeorm";
import { HTTPException } from "src/filter/exception.filter";

@Injectable()
export class ChatService {
    constructor(
        @Inject("CHAT_REPOSITORY")
        private readonly chatRepo: ChatRepository,
        @Inject("PARTICIPANT_REPOSITORY")
        private readonly participantRepo: ParticipantRepository
    ) { }

    async newChat(body: CreateChatDto): Promise<ApiResponse<Partial<Chat>>> {
        const save = await this.chatRepo.createChat({
            chatName: body.chatName,
            type: body.type,
        });
        const participants = body.participants.map((participant) => {
            return {
                userId: participant,
                chatId: save.id
            }
        });
        await this.participantRepo.insertParticipant(participants);
        return {
            statusCode: 201,
            success: true,
            message: "Chat created successfully",
            data: save
        }
    }

    async getChat(user: UserType): Promise<ApiResponse<Partial<Participant[]>>> {
        const chats = await this.participantRepo.getChatByUser(user.id);
        return {
            statusCode: 200,
            success: true,
            message: "Chats fetched",
            data: chats
        }
    }

    async readChat(chatId: string, userId: string): Promise<ApiResponse<object>> {
        const participant = await this.participantRepo.findOne({
            where: {
                chatId: chatId,
                userId: userId
            },
        });

        if (!participant)
            throw new ForbiddenException("You are not a participant of this chat");

        await this.participantRepo.update(
            {
                chatId: chatId,
                userId: userId
            },
            {
                unreadCount: 0
            }
        );

        return {
            statusCode: 200,
            success: true,
            message: "Messages read"
        }
    }
}