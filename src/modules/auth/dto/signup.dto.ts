import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignupDto {

    @IsNotEmpty({ message: "Name is required" })
    @IsString({ message: "Name must be a string" })
    name: string;

    @IsNotEmpty({ message: "Email is required" })
    @IsEmail({}, { message: "Email must be a valid email address" })
    email: string;
}