import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Chat } from './Chat.entity';
import { Message } from './Message.entity';
import { User } from './User.entity';

@Index('chat_user_notifications_idx', ['userId', 'chatId'])
@Index('status_idx', ['isRead'])
@Entity('notifications')
export class UserNotification extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true, nullable: false })
  userId: string;

  @ManyToOne(() => User, (user) => user.notifications, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'userId',
    foreignKeyConstraintName: 'FK_user_notifications',
  })
  user: User;

  @Column({ type: 'text', nullable: false })
  name: string;

  @OneToOne(() => Message, (message) => message.notification, {
    nullable: true,
  })
  @JoinColumn({
    name: 'messageId',
    foreignKeyConstraintName: 'FK_message_and_notifications',
  })
  message: Message;

  @Column({ type: 'bigint', unsigned: true, nullable: false })
  chatId: string;

  @ManyToOne(() => Chat, (chat) => chat.notifications, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'chatId',
    foreignKeyConstraintName: 'FK_chat_notifications',
  })
  chat: Chat;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;
}
