import { Chat } from "src/entities/Chat.entity";
import { Repository } from "typeorm";

export class ChatRepository extends Repository<Chat> {

    async createChat(body: object): Promise<Chat> {
        const obj = this.create(body);
        return await this.save(obj);
    }
}