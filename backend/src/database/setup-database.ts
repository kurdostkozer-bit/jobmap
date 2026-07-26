import { AppDataSource } from './datasource';
import { Job } from '../modules/jobs/entities/job.entity';

async function setupDatabase() {
  try {
    console.log('🔄 Initializing database connection...');
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();

    // Step 1: Register migration
    console.log('📝 Registering migration...');
    try {
      await queryRunner.query(
        `INSERT INTO migrations("timestamp", "name") VALUES ($1, $2)`,
        [1726000001000, 'CreateSavedSearchesTable1726000001000']
      );
      console.log('✅ Migration registered');
    } catch (err: any) {
      if (err.message.includes('duplicate')) {
        console.log('⚠️ Migration already registered, skipping...');
      } else {
        throw err;
      }
    }

    await queryRunner.release();

    // Step 2: Seed jobs data
    console.log('🌱 Seeding P3 discovery jobs...');
    
    const jobsRepository = AppDataSource.getRepository(Job);
    
    const testJobs = [
      {
        companyId: 'company-1',
        title: 'Senior TypeScript Developer',
        description: 'Looking for experienced TypeScript developer with 5+ years',
        category: 'IT',
        jobType: 'Full-Time',
        experienceLevel: 'Senior',
        salaryMin: 7000000,
        salaryMax: 10000000,
        salaryCurrency: 'IQD',
        governorate: 'Baghdad',
        district: 'Al-Jadiriyah',
        neighborhood: 'Karrada',
        realLatitude: 33.3156,
        realLongitude: 44.3661,
        anonymizedLatitude: 33.3156,
        anonymizedLongitude: 44.3661,
        skills: ['TypeScript', 'Node.js', 'React', 'PostgreSQL'],
        languages: ['Arabic', 'English'],
        applicantsCount: 24,
        isActive: true,
      },
      {
        companyId: 'company-1',
        title: 'Mid-Level Frontend Developer',
        description: 'React developer with 3-4 years experience needed',
        category: 'IT',
        jobType: 'Full-Time',
        experienceLevel: 'Mid',
        salaryMin: 4500000,
        salaryMax: 6500000,
        salaryCurrency: 'IQD',
        governorate: 'Baghdad',
        district: 'Al-Jadiriyah',
        neighborhood: 'Karrada',
        realLatitude: 33.3140,
        realLongitude: 44.3680,
        anonymizedLatitude: 33.3140,
        anonymizedLongitude: 44.3680,
        skills: ['React', 'JavaScript', 'CSS', 'Redux'],
        languages: ['Arabic', 'English'],
        applicantsCount: 18,
        isActive: true,
      },
      {
        companyId: 'company-2',
        title: 'Junior Developer - Entry Level',
        description: 'Fresh graduate or bootcamp graduate welcome',
        category: 'IT',
        jobType: 'Full-Time',
        experienceLevel: 'Entry',
        salaryMin: 1500000,
        salaryMax: 2500000,
        salaryCurrency: 'IQD',
        governorate: 'Baghdad',
        district: 'Al-Mansour',
        neighborhood: 'Central',
        realLatitude: 33.3125,
        realLongitude: 44.3720,
        anonymizedLatitude: 33.3125,
        anonymizedLongitude: 44.3720,
        skills: ['HTML', 'CSS', 'JavaScript'],
        languages: ['Arabic'],
        applicantsCount: 45,
        isActive: true,
      },
      {
        companyId: 'company-3',
        title: 'UI/UX Designer',
        description: 'Create beautiful user interfaces for web and mobile apps',
        category: 'Design',
        jobType: 'Full-Time',
        experienceLevel: 'Mid',
        salaryMin: 3500000,
        salaryMax: 5000000,
        salaryCurrency: 'IQD',
        governorate: 'Baghdad',
        district: 'Al-Waziriyah',
        neighborhood: 'Design District',
        realLatitude: 33.3200,
        realLongitude: 44.3650,
        anonymizedLatitude: 33.3200,
        anonymizedLongitude: 44.3650,
        skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
        languages: ['Arabic', 'English'],
        applicantsCount: 12,
        isActive: true,
      },
      {
        companyId: 'company-4',
        title: 'Database Administrator',
        description: 'PostgreSQL and MongoDB expertise required',
        category: 'IT',
        jobType: 'Full-Time',
        experienceLevel: 'Senior',
        salaryMin: 6000000,
        salaryMax: 8500000,
        salaryCurrency: 'IQD',
        governorate: 'Basra',
        district: 'Al-Ashaar',
        neighborhood: 'Port Area',
        realLatitude: 30.5136,
        realLongitude: 47.7979,
        anonymizedLatitude: 30.5136,
        anonymizedLongitude: 47.7979,
        skills: ['PostgreSQL', 'MongoDB', 'Backup', 'Performance Tuning'],
        languages: ['Arabic', 'English'],
        applicantsCount: 8,
        isActive: true,
      },
      {
        companyId: 'company-5',
        title: 'DevOps Engineer',
        description: 'Docker, Kubernetes, CI/CD pipeline management',
        category: 'IT',
        jobType: 'Full-Time',
        experienceLevel: 'Mid',
        salaryMin: 5000000,
        salaryMax: 7000000,
        salaryCurrency: 'IQD',
        governorate: 'Basra',
        district: 'Al-Faw',
        neighborhood: 'Tech Hub',
        realLatitude: 30.5180,
        realLongitude: 47.8050,
        anonymizedLatitude: 30.5180,
        anonymizedLongitude: 47.8050,
        skills: ['Docker', 'Kubernetes', 'AWS', 'Jenkins'],
        languages: ['English'],
        applicantsCount: 6,
        isActive: true,
      },
      {
        companyId: 'company-6',
        title: 'QA Automation Engineer',
        description: 'Test automation with Selenium and Jest',
        category: 'IT',
        jobType: 'Full-Time',
        experienceLevel: 'Mid',
        salaryMin: 4000000,
        salaryMax: 5500000,
        salaryCurrency: 'IQD',
        governorate: 'Erbil',
        district: 'Ankawa',
        neighborhood: 'Modern City',
        realLatitude: 36.1914,
        realLongitude: 44.0085,
        anonymizedLatitude: 36.1914,
        anonymizedLongitude: 44.0085,
        skills: ['Selenium', 'Jest', 'Test Planning', 'Bug Reporting'],
        languages: ['Arabic', 'English', 'Kurdish'],
        applicantsCount: 9,
        isActive: true,
      },
      {
        companyId: 'company-7',
        title: 'Solutions Architect',
        description: 'Design enterprise-level solutions',
        category: 'IT',
        jobType: 'Full-Time',
        experienceLevel: 'Senior',
        salaryMin: 8000000,
        salaryMax: 11000000,
        salaryCurrency: 'IQD',
        governorate: 'Erbil',
        district: 'Soran',
        neighborhood: 'Business District',
        realLatitude: 36.1950,
        realLongitude: 44.0120,
        anonymizedLatitude: 36.1950,
        anonymizedLongitude: 44.0120,
        skills: ['System Design', 'Cloud Architecture', 'Microservices'],
        languages: ['English'],
        applicantsCount: 3,
        isActive: true,
      },
      {
        companyId: 'company-8',
        title: 'Graphic Designer',
        description: 'Visual design for marketing materials',
        category: 'Design',
        jobType: 'Part-Time',
        experienceLevel: 'Entry',
        salaryMin: 1200000,
        salaryMax: 2000000,
        salaryCurrency: 'IQD',
        governorate: 'Nineveh',
        district: 'Mosul',
        neighborhood: 'Old City',
        realLatitude: 36.3601,
        realLongitude: 43.1158,
        anonymizedLatitude: 36.3601,
        anonymizedLongitude: 43.1158,
        skills: ['Photoshop', 'Illustrator', 'Branding'],
        languages: ['Arabic'],
        applicantsCount: 22,
        isActive: true,
      },
      {
        companyId: 'company-9',
        title: 'Sales Executive',
        description: 'B2B sales with commission structure',
        category: 'Sales',
        jobType: 'Full-Time',
        experienceLevel: 'Mid',
        salaryMin: 2500000,
        salaryMax: 4000000,
        salaryCurrency: 'IQD',
        governorate: 'Nineveh',
        district: 'Mosul',
        neighborhood: 'Commercial Zone',
        realLatitude: 36.3620,
        realLongitude: 43.1200,
        anonymizedLatitude: 36.3620,
        anonymizedLongitude: 43.1200,
        skills: ['Sales', 'CRM', 'Negotiation', 'Client Management'],
        languages: ['Arabic', 'English'],
        applicantsCount: 14,
        isActive: true,
      },
    ];

    let createdCount = 0;
    for (const jobData of testJobs) {
      const existingJob = await jobsRepository.findOne({
        where: {
          title: jobData.title,
          governorate: jobData.governorate,
        },
      });

      if (!existingJob) {
        const job = jobsRepository.create(jobData);
        await jobsRepository.save(job);
        createdCount++;
        console.log(`✓ Created: ${jobData.title}`);
      } else {
        console.log(`⊙ Skipped (exists): ${jobData.title}`);
      }
    }

    const totalJobs = await jobsRepository.count();
    console.log(`\n✅ Database setup complete!`);
    console.log(`📊 Created: ${createdCount} new jobs`);
    console.log(`📈 Total jobs in database: ${totalJobs}`);

    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
