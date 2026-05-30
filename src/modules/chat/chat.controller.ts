import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/createChat.dto';
import { CurrentUser } from 'src/decorators/user.decorator';
import type { UserType } from 'src/interfaces.enums/user.types';
import { ReadChatDto } from './dto/readChat.dto';

@Controller('chat')
export class ChatController {
    constructor(
        private readonly chatService: ChatService
    ) { }

    @Post("/")
    async createChat(
        @Body() chatDto: CreateChatDto
    ) {
        return this.chatService.newChat(chatDto);
    }

    @Get("/")
    async getChats(
        @CurrentUser() user: UserType
    ) {
        return this.chatService.getChat(
            user
        );
    }

    @Patch("/read")
    async readChatById(
        @CurrentUser() user: UserType,
        @Body() body: ReadChatDto
    ) {
        return this.chatService.readChat(
            body.chatId,
            user.id
        );
    }

    @Get("/:chatId")
    async getParticipantsByChat(
        @CurrentUser() user: UserType,
        @Param("chatId") chatId: string
    ) {
        return this.chatService.getParticipantsByChat(user, chatId);
    }
}