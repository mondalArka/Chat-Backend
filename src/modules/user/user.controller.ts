import { Controller, Get } from "@nestjs/common";
import { UserService } from "./user.service";
import { CurrentUser } from "src/decorators/user.decorator";
import { type UserType } from "src/interfaces.enums/user.types";

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @Get("/")
    async getUser(
        @CurrentUser() user: UserType
    ) {
        return this.userService.getAllUser(user);
    }
}