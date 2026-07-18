import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { Chats, type ChatTypes } from 'src/interfaces.enums/database.enums';

export class CreateChatDto {
  @IsNotEmpty({ message: 'Chat name is required' })
  @IsString({ message: 'Chat name must not be empty' })
  chatName: string;

  @IsEnum([Chats.GROUP, Chats.ONE, Chats.ME], { message: 'Invalid chat type' })
  type: ChatTypes;

  @ArrayNotEmpty({ message: 'Please provide at least one participant' })
  @IsArray({ message: 'Participants must be an array' })
  participants: string[];
}
