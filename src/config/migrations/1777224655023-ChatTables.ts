import { MigrationInterface, QueryRunner } from "typeorm";

export class ChatTables1777224655023 implements MigrationInterface {
    name = 'ChatTables1777224655023'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`medias\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`messageId\` bigint UNSIGNED NOT NULL, \`filename\` varchar(255) NOT NULL, \`order\` int NOT NULL, \`size\` int NOT NULL, \`type\` enum ('image', 'video', 'audio', 'document') NOT NULL DEFAULT 'image', INDEX \`idx_messageId\` (\`messageId\`), INDEX \`idx_fileType\` (\`type\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`messages\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`senderId\` bigint UNSIGNED NOT NULL, \`chatId\` bigint UNSIGNED NOT NULL, \`message\` text NULL, \`type\` enum ('text', 'media', 'mixed') NOT NULL DEFAULT 'text', \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, INDEX \`FK_chat_messages_createdAt\` (\`chatId\`, \`createdAt\`), INDEX \`FK_user_messages\` (\`senderId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`chats\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`type\` enum ('group', 'one', 'me') NOT NULL DEFAULT 'one', \`chatName\` varchar(255) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`lastMessageId\` bigint UNSIGNED NULL, INDEX \`idx_updatedAt\` (\`updatedAt\`), INDEX \`idx_chatName\` (\`chatName\`), UNIQUE INDEX \`REL_5768a56bdd855c5b78ce66c9a3\` (\`lastMessageId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`participants\` (\`chatId\` bigint UNSIGNED NOT NULL, \`userId\` bigint UNSIGNED NOT NULL, \`joinedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, INDEX \`idx_participant_userId\` (\`userId\`), PRIMARY KEY (\`chatId\`, \`userId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`medias\` ADD CONSTRAINT \`FK_message_media\` FOREIGN KEY (\`messageId\`) REFERENCES \`messages\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_chat_messages\` FOREIGN KEY (\`chatId\`) REFERENCES \`chats\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_user_messages\` FOREIGN KEY (\`senderId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`chats\` ADD CONSTRAINT \`FK_message_chats\` FOREIGN KEY (\`lastMessageId\`) REFERENCES \`messages\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`participants\` ADD CONSTRAINT \`FK_user_participants\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`participants\` ADD CONSTRAINT \`FK_chat_participants\` FOREIGN KEY (\`chatId\`) REFERENCES \`chats\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`participants\` DROP FOREIGN KEY \`FK_chat_participants\``);
        await queryRunner.query(`ALTER TABLE \`participants\` DROP FOREIGN KEY \`FK_user_participants\``);
        await queryRunner.query(`ALTER TABLE \`chats\` DROP FOREIGN KEY \`FK_message_chats\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_user_messages\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_chat_messages\``);
        await queryRunner.query(`ALTER TABLE \`medias\` DROP FOREIGN KEY \`FK_message_media\``);
        await queryRunner.query(`DROP INDEX \`idx_participant_userId\` ON \`participants\``);
        await queryRunner.query(`DROP TABLE \`participants\``);
        await queryRunner.query(`DROP INDEX \`REL_5768a56bdd855c5b78ce66c9a3\` ON \`chats\``);
        await queryRunner.query(`DROP INDEX \`idx_chatName\` ON \`chats\``);
        await queryRunner.query(`DROP INDEX \`idx_updatedAt\` ON \`chats\``);
        await queryRunner.query(`DROP TABLE \`chats\``);
        await queryRunner.query(`DROP INDEX \`FK_user_messages\` ON \`messages\``);
        await queryRunner.query(`DROP INDEX \`FK_chat_messages_createdAt\` ON \`messages\``);
        await queryRunner.query(`DROP TABLE \`messages\``);
        await queryRunner.query(`DROP INDEX \`idx_fileType\` ON \`medias\``);
        await queryRunner.query(`DROP INDEX \`idx_messageId\` ON \`medias\``);
        await queryRunner.query(`DROP TABLE \`medias\``);
    }

}
