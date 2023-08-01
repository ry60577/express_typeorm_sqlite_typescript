import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UserCreateAtColumnAdding1690446719459 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'created_at',
        type: 'timestamp',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'created_at');
  }
}
