import { IsNotEmpty, IsString } from 'class-validator';

export class ReadChatDto {
  @IsNotEmpty({ message: 'Chat id is required' })
  @IsString({ message: 'Chat id must not be empty' })
  chatId: string;
}
