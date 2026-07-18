import { MigrationInterface, QueryRunner } from 'typeorm';

export class MOdifyParticipants1777551236886 implements MigrationInterface {
  name = 'MOdifyParticipants1777551236886';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`participants\` ADD \`unreadCount\` int NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`participants\` DROP COLUMN \`unreadCount\``,
    );
  }
}
