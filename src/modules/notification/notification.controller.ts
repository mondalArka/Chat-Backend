import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CurrentUser } from 'src/decorators/user.decorator';
import { type UserType } from 'src/interfaces.enums/user.types';
import { ReadNotificationDto } from './dto/notification.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('/')
  async getPaginagtedNotifications(
    @CurrentUser() user: UserType,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.notificationService.getPaginatedNotification(
      user,
      Number(limit),
      Number(page),
    );
  }

  @Patch('/')
  async markAllRead(@CurrentUser() user: UserType) {
    return this.notificationService.markAllRead(user);
  }

  @Patch('/chat')
  async readByChatId(
    @Body() body: ReadNotificationDto,
    @CurrentUser() user: UserType,
  ) {
    return this.notificationService.readByChatId(user, body?.chatId);
  }

  @Patch('/:id')
  async readNotification(
    @CurrentUser() user: UserType,
    @Param('id') id: string,
  ) {
    return this.notificationService.readNotification(id);
  }
}
