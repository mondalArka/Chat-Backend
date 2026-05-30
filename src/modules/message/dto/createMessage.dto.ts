import { IsNotEmpty, IsOptional, IsString, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { MessageType, type MessageTypes } from "src/interfaces.enums/database.enums";


@ValidatorConstraint({ name: "isMessageOrMedia", async: false })
export class IsMessageOrMedia implements ValidatorConstraintInterface {
    validate(value: any, args?: ValidationArguments): boolean {

        if (!args?.object["message"] && args?.object["type"] === MessageType.TEXT)
            return false;

        return true;
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return "Cannot send Empty message";
    }
}

export class CreateMessageDto {

    @IsOptional()
    @IsString({ message: "Message must not be empty" })
    message: string;

    @IsNotEmpty({ message: "ChatId is required" })
    @IsString({ message: "ChatId must not be empty" })
    chatId: string;

    @IsNotEmpty({ message: "Message type is required" })
    @IsString({ message: "Message type must not be empty" })
    type: MessageTypes;

    @IsOptional()
    @IsString({ message: "Reply to message id must not be empty" })
    replyToMessageId?: string;

    @Validate(IsMessageOrMedia)
    allow?: boolean;

}
