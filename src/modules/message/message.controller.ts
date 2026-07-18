import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/helpers/multer.config';
import { CreateMessageDto } from './dto/createMessage.dto';
import { CurrentUser } from 'src/decorators/user.decorator';
import { type UserType } from 'src/interfaces.enums/user.types';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('/')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'docs', maxCount: 5 }], multerConfig()),
  )
  async sendMessage(
    @UploadedFiles()
    files: { docs?: Express.Multer.File[] },
    @Body() body: CreateMessageDto,
    @CurrentUser() user: UserType | null,
  ) {
    return this.messageService.createNewMessage(body, files, user);
  }

  @Get('/:chatId')
  async getMessage(
    @CurrentUser() user: UserType,
    @Param('chatId') chatId: string,
    @Query('cursor') cursor?: string,
  ) {
    return this.messageService.getMessage(user, chatId, cursor);
  }
}
