import { BaseEntity, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User.entity";
import { Chat } from "./Chat.entity";

@Index("idx_participant_userId", ["userId"])
@Entity("participants")
export class Participant extends BaseEntity {

    @PrimaryColumn({ type: "bigint", unsigned: true })
    chatId: string;

    @PrimaryColumn({ type: "bigint", unsigned: true })
    userId: string;

    @ManyToOne(() => User, user => user.participants, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId", foreignKeyConstraintName: "FK_user_participants" })
    user: User;

    @ManyToOne(() => Chat, chat => chat.participants, { onDelete: "CASCADE" })
    @JoinColumn({ name: "chatId", foreignKeyConstraintName: "FK_chat_participants" })
    chat: Chat;

    @CreateDateColumn({ type: "timestamp" })
    joinedAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @DeleteDateColumn({ type: "timestamp", nullable: true })
    deletedAt: Date | null;

}