import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/createChat.dto';
import { CurrentUser } from 'src/decorators/user.decorator';
import type { UserType } from 'src/interfaces.enums/user.types';

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
}