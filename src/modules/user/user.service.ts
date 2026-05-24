import { Inject, Injectable } from "@nestjs/common";
import { User } from "src/entities/User.entity";
import { ApiResponse } from "src/interfaces.enums/response.types";
import { UserType } from "src/interfaces.enums/user.types";
import { UserRepository } from "src/repositories/user.repository";
import { Not } from "typeorm";

@Injectable()
export class UserService {
    constructor(
        @Inject("USER_REPOSITORY")
        private readonly userRepo: UserRepository
    ) { }

    async getAllUser(user: UserType): Promise<ApiResponse<User[]>> {
        const data = await this.userRepo.find({ where: { id: Not(user.id) }, select: ["id", "name", "email"] });
        return {
            statusCode: 200,
            success: true,
            message: "Users fetched successfully",
            data
        };
    }
}