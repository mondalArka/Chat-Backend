import { MigrationInterface, QueryRunner } from "typeorm";

export class IntialMigration1776758894186 implements MigrationInterface {
    name = 'IntialMigration1776758894186'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, UNIQUE INDEX \`email_idx\` (\`email\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`sessions\` (\`sessionId\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`otp\` varchar(6) NULL, \`expiresAt\` timestamp NOT NULL, \`userData\` json NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`value_idx\` (\`sessionId\`), UNIQUE INDEX \`email_idx\` (\`email\`), UNIQUE INDEX \`IDX_716dd94e29fe065f4a9654d1a3\` (\`email\`), PRIMARY KEY (\`sessionId\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_716dd94e29fe065f4a9654d1a3\` ON \`sessions\``);
        await queryRunner.query(`DROP INDEX \`email_idx\` ON \`sessions\``);
        await queryRunner.query(`DROP INDEX \`value_idx\` ON \`sessions\``);
        await queryRunner.query(`DROP TABLE \`sessions\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`email_idx\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
