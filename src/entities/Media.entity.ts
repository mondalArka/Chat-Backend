import { FileType, type FileTypes } from "../interfaces.enums/database.enums";
import { BaseEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "./Message.entity";

@Index("idx_fileType", ["type"])
@Index("idx_messageId", ["messageId"])
@Entity("medias")
export class Media extends BaseEntity {

    @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
    id: string;

    @Column({ type: "bigint", unsigned: true })
    messageId: string

    @ManyToOne(() => Message, message => message.medias, { nullable: false, onDelete: "CASCADE" })
    @JoinColumn({ name: "messageId", foreignKeyConstraintName: "FK_message_media" })
    message: Message;

    @Column({ type: "varchar", length: 255, nullable: false })
    filename: string;

    @Column({ type: "int", nullable: false })
    order: number

    @Column({ type: "int", nullable: false })
    size: number;

    @Column({
        type: "enum",
        enum: [FileType.IMAGE, FileType.VIDEO, FileType.AUDIO, FileType.DOCUMENT],
        default: FileType.IMAGE
    })
    type: FileTypes;
}