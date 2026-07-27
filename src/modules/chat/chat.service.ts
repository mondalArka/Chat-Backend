import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { Chat } from 'src/entities/Chat.entity';
import {
  ApiResponse,
  ChatParticipant,
} from 'src/interfaces.enums/response.types';
import { ChatRepository } from 'src/repositories/chat.reposiotries';
import { CreateChatDto } from './dto/createChat.dto';
import { ParticipantRepository } from 'src/repositories/participant.repositories';
import { Participant } from 'src/entities/Participant.entity';
import { UserType } from 'src/interfaces.enums/user.types';
import { User } from 'src/entities/User.entity';
import { SocketGateway } from '../websocket/socket.service';

@Injectable()
export class ChatService {
  constructor(
    @Inject('CHAT_REPOSITORY')
    private readonly chatRepo: ChatRepository,
    @Inject('PARTICIPANT_REPOSITORY')
    private readonly participantRepo: ParticipantRepository,
    private readonly socketGateway: SocketGateway,
  ) {}

  async newChat(
    user: UserType,
    body: CreateChatDto,
  ): Promise<ApiResponse<Partial<Chat>>> {
    const checkChatExists = await this.participantRepo.checkChatExists(
      body.participants,
    );
    console.log(checkChatExists, 'checkChatExists', Number(user.id));
    // for (let check of checkChatExists) {
    if (body.type === 'one' && checkChatExists.length > 0) {
      const bodyParticipantNumbers = body.participants.map(Number);

      const exists = checkChatExists.some((check) => {
        if (check.chatType !== 'one') return false;

        const checkParticipants = check.participants.map(Number);

        // Must have same number of participants
        if (checkParticipants.length !== bodyParticipantNumbers.length)
          return false;

        // Every participant in body must exist in this chat
        const allMatch = bodyParticipantNumbers.every((p) =>
          checkParticipants.includes(p),
        );

        console.log({
          chatId: check.chatId,
          checkParticipants,
          bodyParticipantNumbers,
          allMatch,
        });

        return allMatch;
      });

      console.log(exists, 'isExists');
      if (exists) throw new ForbiddenException('Chat already exists');
    }
    // }

    const userIds: string[] = [];
    const participantList: ChatParticipant[] = [];

    const save = await this.chatRepo.createChat({
      chatName: body.chatName,
      type: body.type,
      createdBy: { id: user.id },
    });
    const insertParticipants = body.participants.map((participant) => {
      return {
        userId: participant,
        chatId: save.id,
      };
    });

    await this.participantRepo.insertParticipant(insertParticipants);

    const participants = await this.participantRepo.find({
      where: {
        chat: { id: save.id },
      },
      relations: ['user'],
    });

    for (let i = 0; i < participants.length; i++) {
      userIds.push(participants[i].userId);
      participantList.push({
        userId: participants[i].userId as unknown as number,
        name: participants[i]?.user?.name || 'Unknown',
        email: participants[i]?.user?.email || 'N/A',
        unreadCount: 0,
      });
    }
    this.socketGateway.joinParticipantsToChat(userIds, save.id);
    this.socketGateway.newChatSocket({
      chatId: save.id,
      chatName: save.chatName,
      lastMessageContent: null,
      lastMessageTime: null,
      createdAt: save.createdAt,
      updatedAt: save.updatedAt,
      chatType: save.type,
      participants: participantList,
    });
    return {
      statusCode: 201,
      success: true,
      message: 'Chat created successfully',
      data: save,
    };
  }

  async getChat(user: UserType): Promise<ApiResponse<Partial<Participant[]>>> {
    const chats = await this.participantRepo.getChatByUser(user.id);
    return {
      statusCode: 200,
      success: true,
      message: 'Chats fetched',
      data: chats,
    };
  }

  async readChat(chatId: string, userId: string): Promise<ApiResponse<object>> {
    const participant = await this.participantRepo.findOne({
      where: {
        chatId: chatId,
        userId: userId,
      },
    });

    if (!participant)
      throw new ForbiddenException('You are not a participant of this chat');

    await this.participantRepo.update(
      {
        chatId: chatId,
        userId: userId,
      },
      {
        unreadCount: 0,
      },
    );

    return {
      statusCode: 200,
      success: true,
      message: 'Messages read',
    };
  }

  async getParticipantsByChat(
    user: UserType,
    chatId: string,
  ): Promise<ApiResponse<Partial<User[]>>> {
    const participants = await this.participantRepo.find({
      where: { chatId },
      relations: ['user'],
    });

    const users = participants
      .filter((p) => p.user.id !== user.id)
      .map((p) => p.user);

    return {
      statusCode: 200,
      success: true,
      message: 'Participants fetched',
      data: users,
    };
  }
}
