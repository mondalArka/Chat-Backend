import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User.entity";
import { Media } from "./Media.entity";
import { Chat } from "./Chat.entity";
import { MessageType, type MessageTypes } from "../interfaces.enums/database.enums";

@Index("FK_user_messages", ["senderId"])
@Index("FK_chat_messages_createdAt", ["chatId", "createdAt"])
@Entity("messages")
export class Message extends BaseEntity {
    @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
    id: string;

    @Column({ type: "bigint", unsigned: true })
    senderId: string;

    @Column({ type: "bigint", unsigned: true })
    chatId: string;

    @Column({ type: "text", nullable: true })
    message: string;

    @Column({
        type: "enum",
        enum: [MessageType.TEXT, MessageType.MEDIA, MessageType.MIXED],
        default: MessageType.TEXT
    })
    type: MessageTypes;

    @ManyToOne(() => Chat, chat => chat.messages, { nullable: false, onDelete: "CASCADE" })
    @JoinColumn({ name: "chatId", foreignKeyConstraintName: "FK_chat_messages" })
    chat: Chat;

    @OneToMany(() => Media, media => media.message)
    medias: Media[];

    @ManyToOne(() => User, user => user.messages, { nullable: false, onDelete: "CASCADE" })
    @JoinColumn({ name: "senderId", foreignKeyConstraintName: "FK_user_messages" })
    sender: User;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @DeleteDateColumn({ type: "timestamp", nullable: true })
    deletedAt: Date;
}