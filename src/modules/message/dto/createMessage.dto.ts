import { IsNotEmpty, IsString } from "class-validator";
import { type MessageTypes } from "src/interfaces.enums/database.enums";

export class CreateMessageDto {

    @IsNotEmpty({ message: "Message is required" })
    @IsString({ message: "Message must not be empty" })
    message: string;

    @IsNotEmpty({ message: "ChatId is required" })
    @IsString({ message: "ChatId must not be empty" })
    chatId: string;

    @IsNotEmpty({ message: "Message type is required" })
    @IsString({ message: "Message type must not be empty" })
    type: MessageTypes;

}