import { UserNotification } from "src/entities/Notification.entity";
import { NotificationCreate } from "src/interfaces.enums/database.enums";
import { InsertResult, Repository } from "typeorm";

export class NotificationRepository extends Repository<UserNotification> {

    async createNotification(body: NotificationCreate): Promise<UserNotification> {
        const obj = this.create(body);
        return await this.save(obj);
    }

    async insertNotification(body: NotificationCreate[]): Promise<InsertResult> {
        return await this.insert(body);
    }

    async getPaginatedNotification(userId: string, limit: number, page: number): Promise<{ list: UserNotification[], count: number, page: number, limit: number }> {
        const query = this.createQueryBuilder('notification')
            .leftJoinAndSelect('notification.chat', "chat")
            .leftJoinAndSelect("chat.participants", "participants", "participants.userId != :userId", { userId })
            .leftJoinAndSelect("participants.user", "user")
            .leftJoinAndSelect('notification.message', "message")
            .select([
                'notification.id',
                'notification.name',
                'notification.userId',
                'notification.createdAt',
                'notification.isRead',
                'chat.id',
                'chat.chatName',
                'chat.type',
                'participants.chatId',
                'user.name',
            ])
            .where("notification.userId = :userId AND notification.isRead = false", { userId });

        const list = await query
            .take(limit)
            .skip((page - 1) * limit)
            .orderBy("notification.createdAt", "DESC")
            .getMany();

        const total = await query.getCount();
        return {
            page,
            limit,
            list,
            count: total
        };
    }

    async readNotification(id: string) {
        return await this.update(id, { isRead: true });
    }
}