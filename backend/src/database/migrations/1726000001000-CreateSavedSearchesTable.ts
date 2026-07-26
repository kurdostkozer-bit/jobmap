import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateSavedSearchesTable1726000001000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'saved_searches',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'userId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'bounds',
            type: 'jsonb',
            isNullable: false,
          },
          {
            name: 'filters',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'sortBy',
            type: 'varchar',
            default: "'relevance'",
            isNullable: false,
          },
          {
            name: 'notifyOnNewJobs',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'notificationFrequency',
            type: 'varchar',
            default: "'daily'",
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'lastExecutedAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'executionCount',
            type: 'integer',
            default: 0,
            isNullable: false,
          },
        ],
        indices: [
          {
            columnNames: ['userId'],
            name: 'idx_saved_searches_user_id',
          },
          {
            columnNames: ['notifyOnNewJobs', 'notificationFrequency'],
            name: 'idx_saved_searches_notifications',
          },
        ],
      }),
      true
    );

    // Add foreign key constraint
    await queryRunner.createForeignKey(
      'saved_searches',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('saved_searches');
  }
}
