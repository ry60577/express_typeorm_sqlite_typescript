import { MigrationInterface, QueryRunner, Table, Timestamp } from 'typeorm';

export class TokenCreating1690447464925 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'token',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'token',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: Timestamp,
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('token');
  }
}
