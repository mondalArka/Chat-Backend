import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyNotification1783853426808 implements MigrationInterface {
    name = 'ModifyNotification1783853426808'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("SET FOREIGN_KEY_CHECKS = 0");

        // 1. Drop the FK first — it depends on chat_notifications_idx
        await queryRunner.query(`ALTER TABLE \`notifications\` DROP FOREIGN KEY \`FK_chat_notifications\``);

        // 2. Now safe to drop the old single-column index
        await queryRunner.query(`DROP INDEX \`chat_notifications_idx\` ON \`notifications\``);

        // 3. Add the new userId column
        await queryRunner.query(`ALTER TABLE \`notifications\` ADD \`userId\` bigint UNSIGNED NOT NULL`);

        // 4. Composite index — userId first, as requested
        await queryRunner.query(`CREATE INDEX \`chat_user_notifications_idx\` ON \`notifications\` (\`userId\`, \`chatId\`)`);

        // 5. Dedicated index on chatId alone — required so chatId's FK has a leftmost-column index to satisfy
        await queryRunner.query(`CREATE INDEX \`chatId_idx\` ON \`notifications\` (\`chatId\`)`);

        // 6. Re-add FK for chatId (was dropped in step 1)
        await queryRunner.query(`
            ALTER TABLE \`notifications\`
            ADD CONSTRAINT \`FK_chat_notifications\`
            FOREIGN KEY (\`chatId\`) REFERENCES \`chats\`(\`id\`)
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        // 7. Add FK for the new userId column
        await queryRunner.query(`
            ALTER TABLE \`notifications\`
            ADD CONSTRAINT \`FK_user_notifications\`
            FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`)
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        await queryRunner.query("SET FOREIGN_KEY_CHECKS = 1");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("SET FOREIGN_KEY_CHECKS = 0");

        await queryRunner.query(`ALTER TABLE \`notifications\` DROP FOREIGN KEY \`FK_user_notifications\``);
        await queryRunner.query(`ALTER TABLE \`notifications\` DROP FOREIGN KEY \`FK_chat_notifications\``);
        await queryRunner.query(`DROP INDEX \`chatId_idx\` ON \`notifications\``);
        await queryRunner.query(`DROP INDEX \`chat_user_notifications_idx\` ON \`notifications\``);
        await queryRunner.query(`ALTER TABLE \`notifications\` DROP COLUMN \`userId\``);
        await queryRunner.query(`CREATE INDEX \`chat_notifications_idx\` ON \`notifications\` (\`chatId\`)`);
        await queryRunner.query(`
            ALTER TABLE \`notifications\`
            ADD CONSTRAINT \`FK_chat_notifications\`
            FOREIGN KEY (\`chatId\`) REFERENCES \`chats\`(\`id\`)
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        await queryRunner.query("SET FOREIGN_KEY_CHECKS = 1");
    }
}