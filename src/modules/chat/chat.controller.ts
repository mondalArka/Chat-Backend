import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/createChat.dto';

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
}