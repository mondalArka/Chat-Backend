import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyMessageTable1779954333461 implements MigrationInterface {
    name = 'ModifyMessageTable1779954333461'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`messages\` ADD \`replyToMessageId\` bigint UNSIGNED NULL`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_message_messages\` FOREIGN KEY (\`replyToMessageId\`) REFERENCES \`messages\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_message_messages\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP COLUMN \`replyToMessageId\``);
    }

}
