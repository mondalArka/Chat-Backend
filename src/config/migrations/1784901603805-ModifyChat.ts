import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyChat1784901603805 implements MigrationInterface {
  name = 'ModifyChat1784901603805';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`DROP INDEX \`chatId_idx\` ON \`notifications\``);
    await queryRunner.query(
      `ALTER TABLE \`chats\` ADD \`createdById\` bigint UNSIGNED NULL`,
    );
    // await queryRunner.query(`CREATE INDEX \`FK_user_messages\` ON \`messages\` (\`senderId\`)`);
    await queryRunner.query(
      `CREATE INDEX \`idx_createdBy\` ON \`chats\` (\`createdById\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`chats\` ADD CONSTRAINT \`FK_user_chats_createdBy\` FOREIGN KEY (\`createdById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`chats\` DROP FOREIGN KEY \`FK_user_chats_createdBy\``,
    );
    await queryRunner.query(`DROP INDEX \`idx_createdBy\` ON \`chats\``);
    // await queryRunner.query(`DROP INDEX \`FK_user_messages\` ON \`messages\``);
    await queryRunner.query(
      `ALTER TABLE \`chats\` DROP COLUMN \`createdById\``,
    );
    // await queryRunner.query(
    //   `CREATE INDEX \`chatId_idx\` ON \`notifications\` (\`chatId\`)`,
    // );
  }
}
