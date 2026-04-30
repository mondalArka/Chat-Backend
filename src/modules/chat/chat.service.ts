import { Inject, Injectable } from "@nestjs/common";
import { Chat } from "src/entities/Chat.entity";
import { ApiResponse } from "src/interfaces.enums/response.types";
import { ChatRepository } from "src/repositories/chat.reposiotries";
import { CreateChatDto } from "./dto/createChat.dto";
import { ParticipantRepository } from "src/repositories/participant.repositories";
import { Participant } from "src/entities/Participant.entity";

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

    async getUserChats(userId: string): Promise<ApiResponse<Array<Partial<Participant>>>> {
        const chats = await this.participantRepo.find({
            where: {
                userId
            },
            relations: ["chat","chat.lastMessage"]
        });

        return {
            statusCode: 200,
            success: true,
            message: "Chats fetched successfully",
            data: chats
        }
    }
}