import { Inject, Injectable } from '@nestjs/common';
import { NotificationRepository } from 'src/repositories/notification.repositories';
import { NotificationDto } from './dto/notification.dto';
import { NotificationCreate } from 'src/interfaces.enums/database.enums';
import { ApiResponse } from 'src/interfaces.enums/response.types';
import { UserType } from 'src/interfaces.enums/user.types';
import { UserNotification } from 'src/entities/Notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('NOTIFICATION_REPOSITORY')
    private readonly notificationRepo: NotificationRepository,
  ) {}

  async createNotification(body: NotificationDto) {
    return this.notificationRepo.createNotification(
      body as unknown as NotificationCreate,
    );
  }

  async insertNotification(body: NotificationDto[]) {
    return this.notificationRepo.insertNotification(
      body as unknown as NotificationCreate[],
    );
  }

  async getPaginatedNotification(
    user: UserType,
    limit = 10,
    page = 1,
  ): Promise<ApiResponse<UserNotification[]>> {
    const {
      list = [],
      count = 0,
      page: listPage = 1,
      limit: listLimit = 10,
    } = await this.notificationRepo.getPaginatedNotification(
      user?.id,
      limit,
      page,
    );
    return {
      success: true,
      statusCode: 200,
      message: 'Notification fetched successfully',
      data: list,
      hasNext: listPage * listLimit < count,
      count,
    };
  }

  async readNotification(id: string): Promise<ApiResponse<{}>> {
    await this.notificationRepo.readNotification(id);
    return {
      success: true,
      statusCode: 200,
      message: 'Notification read successfully',
    };
  }

  async markAllRead(user: UserType): Promise<ApiResponse<{}>> {
    await this.notificationRepo.update(
      { user: { id: user?.id } },
      { isRead: true },
    );
    return {
      success: true,
      statusCode: 200,
      message: 'Notifications read successfully',
    };
  }

  async readByChatId(user: UserType, chatId: string): Promise<ApiResponse<{}>> {
    await this.notificationRepo.update(
      { user: { id: user?.id }, chat: { id: chatId } },
      { isRead: true },
    );
    return {
      success: true,
      statusCode: 200,
      message: 'Notifications read successfully',
    };
  }
}
