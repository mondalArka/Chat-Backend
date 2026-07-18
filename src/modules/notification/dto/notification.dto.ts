import { IsNotEmpty, IsString } from 'class-validator';

export class NotificationDto {
  @IsNotEmpty({ message: 'Notification name is required' })
  @IsString({ message: 'Notification name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'Chat ID is required' })
  @IsString({ message: 'Chat ID must be a string' })
  chatId: string;

  @IsNotEmpty({ message: 'Message ID is required' })
  @IsString({ message: 'Message ID must be a string' })
  messageId: string;

  @IsNotEmpty({ message: 'User ID is required' })
  @IsString({ message: 'User ID must be a string' })
  userId: string;
}

export class ReadNotificationDto {
  @IsNotEmpty({ message: 'Chat ID is required' })
  @IsString({ message: 'Chat ID must be a string' })
  chatId: string;
}
