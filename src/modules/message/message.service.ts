import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/createMessage.dto';
import { MessageRepository } from 'src/repositories/message.repositories';
import { MediaRepository } from 'src/repositories/media.repositories';
import { getFileType } from 'src/helpers/mime-finder';
import { Media } from 'src/entities/Media.entity';
import {
  ApiResponse,
  NotificationParticipant,
} from 'src/interfaces.enums/response.types';
import { UserType } from 'src/interfaces.enums/user.types';
import { ParticipantRepository } from 'src/repositories/participant.repositories';
import { Not, Raw } from 'typeorm';
import { ChatRepository } from 'src/repositories/chat.reposiotries';
import { SocketGateway } from '../websocket/socket.service';
import { Message } from 'src/entities/Message.entity';
import { RedisProvider } from '../redis/redis.provider';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { NotificationRepository } from 'src/repositories/notification.repositories';
import { randomUUID } from 'crypto';
import { NotificationCreate } from 'src/interfaces.enums/database.enums';

@Injectable()
export class MessageService {
  private redis: Redis;
  private redisExpire: number;
  constructor(
    @Inject('MESSAGE_REPOSITORY')
    private readonly messageRepository: MessageRepository,
    @Inject('MEDIA_REPOSITORY')
    private readonly mediaRepo: MediaRepository,
    @Inject('PARTICIPANT_REPOSITORY')
    private readonly participantRepo: ParticipantRepository,
    @Inject('CHAT_REPOSITORY')
    private readonly chatRepo: ChatRepository,
    private readonly socketGateway: SocketGateway,
    private readonly redisService: RedisProvider,
    private readonly configService: ConfigService,

    @Inject('NOTIFICATION_REPOSITORY')
    private readonly notificationRepo: NotificationRepository,
  ) {
    this.redis = this.redisService.getRedisClient();
    this.redisExpire = Number(this.configService.get('REDIS_EXPIRE'));
  }

  async createNewMessage(
    body: CreateMessageDto,
    files: { docs?: Express.Multer.File[] },
    user: UserType | null,
  ): Promise<ApiResponse<any>> {
    let getReplyMessage: Message | null = null;

    const findChat = await this.chatRepo.findOne({
      where: { id: body.chatId },
    });
    if (!findChat) throw new NotFoundException('Chat not found');

    if (body.replyToMessageId) {
      getReplyMessage = await this.messageRepository.findOne({
        where: { id: body.replyToMessageId },
        relations: ['medias'],
      });
    }

    const getParticipants = await this.participantRepo.find({
      where: { chatId: body.chatId },
      relations: ['user'],
    });

    const save = await this.messageRepository.saveMessage({
      ...body,
      senderId: user?.id,
      ...((body.replyToMessageId && {
        replyToMessage: { id: body.replyToMessageId },
      }) as Partial<Message>),
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
          messageId: save.id,
        };
      }) as Partial<Media>[];
      await this.mediaRepo.insertMedia(docData);
    }

    const newMessage = {
      id: save.id,
      message: save.message,
      chatId: body.chatId,
      type: save.type,
      sender: {
        id: user?.id as string,
        email: user?.email as string,
        name: user?.name as string,
      },
      ...(body.replyToMessageId && { replyToMessage: getReplyMessage }),
      isRead: false,
      medias: docData,
      createdAt: save.createdAt,
      updatedAt: save.updatedAt,
      deletedAt: save.deletedAt,
    };

    await Promise.all(
      getParticipants.map(async (p) => {
        const pCursor = await this.redis.get(
          `cursor:${p.userId}:${body.chatId}`,
        );
        if (!pCursor) return null;
        const pData = await this.redis.get(
          `data:${p.userId}:${body.chatId}:${pCursor}`,
        );
        if (!pData) return null;
        const pJson = JSON.parse(pData);
        await this.redis.del(`data:${p.userId}:${body.chatId}:${pCursor}`);
        return this.redis.set(
          `data:${p.userId}:${body.chatId}:${pCursor}`,
          JSON.stringify({
            message: [newMessage, ...pJson.message],
            nextCursor: pJson.nextCursor,
          }),
          'EX',
          this.redisExpire + 900,
        );
      }),
    );

    await Promise.all([
      this.chatRepo.update(body.chatId, { lastMessage: { id: save.id } }),
      this.participantRepo.increment(
        { chatId: body.chatId, userId: Not(user!.id) },
        'unreadCount',
        1,
      ),
    ]);

    this.socketGateway.sendMessage(newMessage);
    // those who are online
    this.socketGateway
      .getUsersNonViewingChat(user?.id as unknown as string, body.chatId)
      .then((viewingUsersInChat) => {
        const notificationMap = new Map<string, boolean>(); // <userId, and who are currently online>
        const notifications: NotificationCreate[] = [];

        // includes online users who are not in chat
        for (const notif of viewingUsersInChat) {
          notificationMap.set(notif.userId, notif.isViewing);
          if (!notif.isViewing)
            notifications.push({
              userId: notif.userId,
              chatId: body.chatId,
              messageId: save.id,
              name: `${user?.name} sent a new message`,
            });
        }
        for (let i = 0; i < getParticipants.length; i++) {
          if (getParticipants[i].userId === user?.id) {
            // getParticipants.splice(i, 1);
            continue;
          }
          // includes offline users also, only allow once per userId
          if (
            !notificationMap.has(getParticipants[i]?.userId) &&
            notificationMap.get(getParticipants[i]?.userId) !== true
          )
            notifications.push({
              userId: getParticipants[i].userId,
              chatId: body.chatId,
              messageId: save.id,
              name: `${user?.name} sent a new message`,
            });
        }

        // insert in DB
        this.notificationRepo
          .insertNotification(notifications)
          .then((res) => {
            notifications.forEach((notification, index) => {
              this.socketGateway.sendNotification({
                id: res?.identifiers[index]?.id,
                userId: notification.userId,
                name: notification.name,
                chat: {
                  id: findChat?.id,
                  chatName: findChat?.chatName,
                  type: findChat?.type as unknown as 'one' | 'group',
                  participants: getParticipants.map((p) => ({
                    chatId: p.chatId,
                    user: {
                      name: p.user.name,
                    },
                  })) as unknown as NotificationParticipant[],
                },
                isRead: false,
                createdAt: new Date().toISOString(),
              });
            });
          })
          .catch((err) => {
            console.error('Error inserting notifications:', err);
          });
      })
      .catch((err) => {
        console.error('Error getting users viewing chat:', err);
      });

    // this.socketGateway.checkOnWhichChatIsUser();

    return {
      statusCode: 200,
      success: true,
      message: 'Message sent successfully',
      data: newMessage,
    };
  }

  async getMessage(
    user: UserType,
    chatId: string,
    cursor?: string,
  ): Promise<ApiResponse<Partial<Message[]>>> {
    const cursorKey = `cursor:${user.id}:${chatId}`;
    let prevCache: string | null = null;
    const getCursor = await this.redis.get(cursorKey);
    // console.log(getCursor, "getcursor")
    // checking if cursorkey is present and is less than = cursor
    if (
      getCursor &&
      (cursor === 'initial' || Number(getCursor) <= Number(cursor))
    ) {
      // console.log("from redis", getCursor)
      // console.log(`data:${user.id}:${chatId}:${getCursor}`)
      const cache = await this.redis.get(
        `data:${user.id}:${chatId}:${getCursor}`,
      );
      if (cache) {
        console.log('from caching');
        const val = JSON.parse(cache);
        if (val.message?.length > 0)
          return {
            statusCode: 200,
            success: true,
            message: 'Messages fetched successfully',
            data: val?.message,
            nextCursor: val?.nextCursor,
          };
      }
    } else
      prevCache = (await this.redis.get(
        `data:${user.id}:${chatId}:${getCursor}`,
      )) as string;

    console.log('not caching');
    let newMessage: Message[] = [];
    let message = await this.messageRepository.find({
      where: {
        chatId,
        ...(cursor !== 'initial' && {
          id: Raw((alias) => `${alias}<${cursor}`),
        }),
      },
      order: { createdAt: 'DESC' },
      take: 50,
      relations: [
        'sender',
        'medias',
        'replyToMessage',
        'replyToMessage.medias',
      ],
    });
    newMessage = message;
    message = [
      ...(JSON.parse((prevCache as string) ?? null)?.message ?? []),
      ...message,
    ];
    // console.log(message, 'message');
    const nextCursor =
      message.length > 0 ? message[message.length - 1].id : 'initial';

    // delete prev actual datas
    const oldKeys = await this.redis.keys(`data:${user.id}:${chatId}:*`);
    if (oldKeys.length > 0) {
      await this.redis.del(...oldKeys);
    }
    await Promise.all([
      this.redis.set(
        cursorKey,
        cursor ?? 'initial',
        'EX',
        this.redisExpire + 900,
      ),
      this.redis.set(
        `data:${user.id}:${chatId}:${cursor ?? 'initial'}`,
        JSON.stringify({
          message,
          nextCursor,
        }),
        'EX',
        this.redisExpire + 900,
      ), // 30mins
    ]);

    return {
      statusCode: 200,
      success: true,
      message: 'Messages fetched successfully',
      data: newMessage,
      nextCursor,
    };
  }
}
