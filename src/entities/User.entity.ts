import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Participant } from "./Participant.entity";
import { Message } from "./Message.entity";
@Entity("users")
@Index("email_idx", ["email"], { unique: true })
export class User extends BaseEntity {

    @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
    id: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    name: string;

    @Column({ type: "varchar", length: 255, nullable: false, unique: true })
    email: string;

    @OneToMany(() => Participant, participant => participant.user)
    participants: Participant[];

    @OneToMany(() => Message, message => message.sender)
    messages: Message[];

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @DeleteDateColumn({ type: "timestamp", nullable: true })
    deletedAt: Date | null;

}
