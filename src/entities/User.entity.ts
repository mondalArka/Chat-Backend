import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
@Entity("users")
@Index("email_idx", ["email"], { unique: true })
export class User extends BaseEntity {

    @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
    id: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    name: string;

    @Column({ type: "varchar", length: 255, nullable: false, unique: true })
    email: string;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @DeleteDateColumn({ type: "timestamp", nullable: true })
    deletedAt: Date | null;

}
