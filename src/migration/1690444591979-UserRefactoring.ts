import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserRefactoring1690444591979 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "firstName" TO "email"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "email" TO "firstName"`); // reverts things made in "up" method
  }
}
