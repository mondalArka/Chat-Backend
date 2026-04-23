import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SingnInDto {

    @IsNotEmpty()
    @IsEmail()
    email: string;
}