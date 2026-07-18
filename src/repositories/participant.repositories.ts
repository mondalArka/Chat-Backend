import { Participant } from 'src/entities/Participant.entity';
import { InsertResult, Repository } from 'typeorm';

export class ParticipantRepository extends Repository<Participant> {
  async saveParticipants(body: Partial<Participant>): Promise<Participant> {
    const obj = this.create(body);
    return await this.save(obj);
  }

  async insertParticipant(
    body: Array<Partial<Participant>>,
  ): Promise<InsertResult> {
    return this.insert(body);
  }

  async getChatByUser(userId: string): Promise<any[]> {
    const query = await this.createQueryBuilder('participants')
      .select('chat.id', 'chatId')
      .addSelect('chat.chatName', 'chatName')
      .addSelect('chat.type', 'chatType')
      .addSelect('chat.createdAt', 'createdAt')
      .addSelect('chat.updatedAt', 'updatedAt')
      .addSelect('chat.chatName', 'chatName')
      .addSelect('lastMessage.message', 'lastMessageContent')
      .addSelect('lastMessage.createdAt', 'lastMessageTime')
      .addSelect(
        `JSON_ARRAYAGG(
            JSON_OBJECT(
                'userId', allParticipants.userId,
                'name', allUser.name,
                'email', allUser.email,
                'unreadCount', allParticipants.unreadCount
            )
        )`,
        'participants',
      )
      .where('participants.userId = :userId', { userId })
      .andWhere('participants.deletedAt IS NULL')
      .leftJoin('participants.chat', 'chat')
      .leftJoin('chat.lastMessage', 'lastMessage')
      .leftJoin(
        // ← removed the userId filter
        'chat.participants',
        'allParticipants',
        'allParticipants.deletedAt IS NULL', // ← all participants including self
      )
      .leftJoin('allParticipants.user', 'allUser')
      .groupBy('chat.id')
      .addGroupBy('lastMessage.id')
      .orderBy('lastMessage.createdAt', 'DESC')
      .getRawMany();

    return query;
  }
}
