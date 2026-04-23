import { BaseEntity, BeforeInsert, Column, CreateDateColumn, DeleteDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from "typeorm";
@Entity("sessions")
@Index("email_idx", ["email"], { unique: true })
@Index("value_idx", ["sessionId"], { unique: true })
export class Sessions extends BaseEntity {

    @PrimaryColumn({ type: "varchar", length: 255, nullable: false })
    sessionId: string;

    @Column({ type: "varchar", length: 255, nullable: false, unique: true })
    email: string;

    @Column({ type: "varchar", length: 6, nullable: true })
    otp: string;

    @Column({ type: "timestamp", nullable: false })
    expiresAt: Date;

    @Column({ type: "json", nullable: true })
    userData?: object;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

}
