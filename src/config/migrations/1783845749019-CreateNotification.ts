import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNotification1783845749019 implements MigrationInterface {
    name = 'CreateNotification1783845749019'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`notifications\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`name\` text NOT NULL, \`chatId\` bigint UNSIGNED NOT NULL, \`isRead\` tinyint NOT NULL DEFAULT 0, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`messageId\` bigint UNSIGNED NULL, INDEX \`status_idx\` (\`isRead\`), INDEX \`chat_notifications_idx\` (\`chatId\`), UNIQUE INDEX \`REL_0bba33986bae5af0e04aaf5217\` (\`messageId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        // await queryRunner.query(`CREATE INDEX \`FK_user_messages\` ON \`messages\` (\`senderId\`)`);
        await queryRunner.query(`ALTER TABLE \`notifications\` ADD CONSTRAINT \`FK_message_and_notifications\` FOREIGN KEY (\`messageId\`) REFERENCES \`messages\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`notifications\` ADD CONSTRAINT \`FK_chat_notifications\` FOREIGN KEY (\`chatId\`) REFERENCES \`chats\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`notifications\` DROP FOREIGN KEY \`FK_chat_notifications\``);
        await queryRunner.query(`ALTER TABLE \`notifications\` DROP FOREIGN KEY \`FK_message_and_notifications\``);
        // await queryRunner.query(`DROP INDEX \`FK_user_messages\` ON \`messages\``);
        await queryRunner.query(`DROP INDEX \`REL_0bba33986bae5af0e04aaf5217\` ON \`notifications\``);
        await queryRunner.query(`DROP INDEX \`chat_notifications_idx\` ON \`notifications\``);
        await queryRunner.query(`DROP INDEX \`status_idx\` ON \`notifications\``);
        await queryRunner.query(`DROP TABLE \`notifications\``);
    }

}
