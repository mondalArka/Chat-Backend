import {
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  Index,
  ManyToOne,
  OneToMany,
  BaseEntity,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Chats, type ChatTypes } from '../interfaces.enums/database.enums';
import { Participant } from './Participant.entity';
import { Message } from './Message.entity';
import { UserNotification } from './Notification.entity';
import { User } from './User.entity';

@Index('idx_chatName', ['chatName'])
@Index('idx_updatedAt', ['updatedAt'])
@Index('idx_createdBy', ['createdById'])
@Entity('chats')
export class Chat extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: string;

  @Column({
    type: 'enum',
    enum: [Chats.GROUP, Chats.ONE, Chats.ME],
    default: Chats.ONE,
  })
  type: ChatTypes;

  @Column({ type: 'varchar', length: 255, nullable: false })
  chatName: string;

  @OneToOne(() => Message, { nullable: true })
  @JoinColumn({
    name: 'lastMessageId',
    foreignKeyConstraintName: 'FK_message_chats',
  })
  lastMessage: Message;

  @OneToMany(() => Participant, (participant) => participant.chat)
  participants: Participant[];

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  createdById: string;

  @OneToMany(() => Message, (message) => message.chat, { nullable: true })
  messages: Message[];

  @OneToMany(() => UserNotification, (notifications) => notifications.chat, {
    nullable: true,
  })
  notifications: UserNotification[];

  @ManyToOne(() => User, (user) => user.createdBy, { nullable: false })
  @JoinColumn({
    name: 'createdById',
    foreignKeyConstraintName: 'FK_user_chats_createdBy',
  })
  createdBy: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;
}
