import { AppDataSource } from './datasource';

async function registerMigration() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();

    // Insert the migration record
    await queryRunner.query(
      `INSERT INTO migrations("timestamp", "name") VALUES ($1, $2)`,
      [1726000001000, 'CreateSavedSearchesTable1726000001000']
    );

    console.log('✅ Migration registered successfully');
    await queryRunner.release();
    await AppDataSource.destroy();
  } catch (error: any) {
    if (error.message.includes('duplicate key')) {
      console.log('⚠️ Migration already registered');
    } else {
      console.error('❌ Error registering migration:', error.message);
    }
    process.exit(1);
  }
}

registerMigration();
