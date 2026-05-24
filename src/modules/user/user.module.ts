import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { RepositoryModule } from "src/repositories/repository.module";

@Module({
    imports: [
        RepositoryModule.forFeature([
            "USER_REPOSITORY"
        ])
    ],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule { }