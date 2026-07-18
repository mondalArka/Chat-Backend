import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyMediaTable1777275194171 implements MigrationInterface {
  name = 'ModifyMediaTable1777275194171';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`medias\` DROP COLUMN \`filename\``);
    await queryRunner.query(
      `ALTER TABLE \`medias\` ADD \`fileName\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`medias\` ADD \`originalName\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`medias\` DROP COLUMN \`originalName\``,
    );
    await queryRunner.query(`ALTER TABLE \`medias\` DROP COLUMN \`fileName\``);
    await queryRunner.query(
      `ALTER TABLE \`medias\` ADD \`filename\` varchar(255) NOT NULL`,
    );
  }
}
