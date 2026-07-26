/**
 * Seed test data into JobMap database
 * 
 * Creates mock jobs in Iraq area for P2.9 performance testing
 */

const { DataSource } = require('typeorm');
const path = require('path');
require('dotenv').config();

async function seedTestData() {
  const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'jobmap',
    entities: ['dist/src/modules/**/entities/**/*.entity.js'],
    migrations: ['dist/src/database/migrations/**/*.js'],
    synchronize: false,
    logging: false,
  });

  try {
    console.log('🔗 Connecting to database...');
    await AppDataSource.initialize();
    console.log('✅ Connected');

    const jobRepository = AppDataSource.getRepository('Job');

    // Check if data already seeded
    const count = await jobRepository.count();
    if (count > 0) {
      console.log(`ℹ️  Database already has ${count} jobs. Skipping seed.`);
      await AppDataSource.destroy();
      return;
    }

    console.log('\n📝 Seeding test data...');

    // Iraq area coordinates for testing
    const baghdad = { lat: 33.3136, lng: 44.3615 };
    const basra = { lat: 30.5085, lng: 47.8089 };
    const mosul = { lat: 36.3378, lng: 43.1577 };

    // Job titles
    const titles = [
      'Senior React Developer',
      'Backend Engineer',
      'DevOps Specialist',
      'Product Manager',
      'UX Designer',
      'Data Scientist',
      'QA Engineer',
      'Full Stack Developer',
      'Mobile Developer',
      'System Administrator',
    ];

    // Companies
    const companies = [
      'Tech Solutions Iraq',
      'Digital Innovation Hub',
      'Cloud Services Ltd',
      'Data Analytics Pro',
      'Web Development Studio',
      'Mobile Apps Factory',
      'Enterprise Systems',
      'Startup Accelerator',
      'IT Consulting Group',
      'Software House',
    ];

    // Categories
    const categories = [
      'IT', 'Design', 'Sales', 'Marketing', 'HR',
      'Finance', 'Operations', 'Management'
    ];

    // Employment types
    const employmentTypes = ['full-time', 'part-time', 'contract', 'freelance'];

    // Generate jobs
    const jobs = [];
    const locations = [
      { ...baghdad, range: 1.0 }, // ±1 degree
      { ...basra, range: 1.0 },
      { ...mosul, range: 1.0 },
    ];

    let jobId = 1;
    for (const location of locations) {
      for (let i = 0; i < 150; i++) {
        // Add random variance to location
        const latVar = (Math.random() - 0.5) * location.range;
        const lngVar = (Math.random() - 0.5) * location.range;

        jobs.push({
          id: `job_${jobId++}`,
          anonymizedLatitude: location.lat + latVar,
          anonymizedLongitude: location.lng + lngVar,
          title: titles[Math.floor(Math.random() * titles.length)],
          description: `Exciting opportunity for a talented professional. Join our team at ${companies[Math.floor(Math.random() * companies.length)]}`,
          company: companies[Math.floor(Math.random() * companies.length)],
          companyId: `company_${Math.floor(Math.random() * 10) + 1}`,
          category: categories[Math.floor(Math.random() * categories.length)],
          jobType: employmentTypes[Math.floor(Math.random() * employmentTypes.length)],
          salaryMin: Math.floor(Math.random() * 1000) * 1000 + 1000000,
          salaryMax: Math.floor(Math.random() * 2000) * 1000 + 3000000,
          governorate: ['Baghdad', 'Basra', 'Nineveh'][Math.floor(Math.random() * 3)],
          district: 'Test District',
          isActive: true,
          applicantsCount: Math.floor(Math.random() * 50),
          skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'PostgreSQL'],
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
        });
      }
    }

    // Insert in batches
    const batchSize = 100;
    for (let i = 0; i < jobs.length; i += batchSize) {
      const batch = jobs.slice(i, i + batchSize);
      await jobRepository.insert(batch);
      console.log(`  ✓ Inserted ${Math.min(i + batchSize, jobs.length)}/${jobs.length} jobs`);
    }

    console.log(`\n✅ Seeded ${jobs.length} test jobs`);
    console.log(`\nLocations:`);
    console.log(`  • Baghdad: ~150 jobs`);
    console.log(`  • Basra: ~150 jobs`);
    console.log(`  • Mosul: ~150 jobs`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
  }
}

seedTestData();
