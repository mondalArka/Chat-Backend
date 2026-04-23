import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SessionDto {

    @IsNotEmpty()
    @IsString()
    sessionId: string;

    @IsString()
    @IsNotEmpty()
    otp: string;
}