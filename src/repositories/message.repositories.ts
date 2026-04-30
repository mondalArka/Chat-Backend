import { Message } from "src/entities/Message.entity";
import { Repository } from "typeorm";

export class MessageRepository extends Repository<Message> {

    async saveMessage(body: Partial<Message>): Promise<Message> {
        const obj = this.create(body);
        return await this.save(obj);
    }
}