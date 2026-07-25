import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { getConnection } from 'typeorm';
import { Governorate, District, Neighborhood } from '../../modules/locations/entities/location.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const connection = getConnection();
  
  const governorateRepository = connection.getRepository(Governorate);
  const districtRepository = connection.getRepository(District);
  const neighborhoodRepository = connection.getRepository(Neighborhood);

  // Iraqi Governorates with coordinates
  const governorates = [
    { name: 'Baghdad', latitude: 33.3133, longitude: 44.3613, populationEstimate: 7665000 },
    { name: 'Basra', latitude: 30.4760, longitude: 47.8176, populationEstimate: 1880000 },
    { name: 'Nineveh', latitude: 36.3405, longitude: 43.1553, populationEstimate: 3920000 },
    { name: 'Dhi Qar', latitude: 31.0012, longitude: 46.2525, populationEstimate: 1570000 },
    { name: 'Maysan', latitude: 31.8447, longitude: 48.6734, populationEstimate: 860000 },
    { name: 'Wasit', latitude: 32.7464, longitude: 46.4147, populationEstimate: 1070000 },
    { name: 'Karbala', latitude: 32.5455, longitude: 44.0247, populationEstimate: 730000 },
    { name: 'Najaf', latitude: 31.9489, longitude: 44.3569, populationEstimate: 1130000 },
    { name: 'Babil', latitude: 32.9012, longitude: 44.9656, populationEstimate: 1880000 },
    { name: 'Qadisiyyah', latitude: 31.9454, longitude: 44.3569, populationEstimate: 1340000 },
    { name: 'Anbar', latitude: 33.7298, longitude: 41.9294, populationEstimate: 1750000 },
    { name: 'Salah ad-Din', latitude: 34.7656, longitude: 43.7297, populationEstimate: 1420000 },
    { name: 'Sulaymaniyah', latitude: 35.5628, longitude: 46.1267, populationEstimate: 1780000 },
    { name: 'Erbil', latitude: 36.1914, longitude: 44.0092, populationEstimate: 1500000 },
    { name: 'Duhok', latitude: 36.8723, longitude: 42.9898, populationEstimate: 1400000 },
    { name: 'Kirkuk', latitude: 35.4750, longitude: 44.4140, populationEstimate: 1460000 },
    { name: 'Muthanna', latitude: 31.1422, longitude: 45.6842, populationEstimate: 670000 },
    { name: 'Thi-Qar', latitude: 31.0012, longitude: 46.2525, populationEstimate: 1570000 },
  ];

  console.log('🌍 Seeding Iraqi Governorates...');
  
  for (const govData of governorates) {
    const existing = await governorateRepository.findOne({ where: { name: govData.name } });
    if (!existing) {
      await governorateRepository.save(govData);
      console.log(`✓ Added: ${govData.name}`);
    }
  }

  // Baghdad Districts (example)
  const baghdadGov = await governorateRepository.findOne({ where: { name: 'Baghdad' } });
  if (baghdadGov) {
    const baghdadDistricts = [
      { name: 'Karrada', latitude: 33.2844, longitude: 44.3615, governorateId: baghdadGov.id },
      { name: 'Mansour', latitude: 33.3220, longitude: 44.3584, governorateId: baghdadGov.id },
      { name: 'Jadriya', latitude: 33.2995, longitude: 44.4046, governorateId: baghdadGov.id },
      { name: 'Kadhimiya', latitude: 33.3400, longitude: 44.3800, governorateId: baghdadGov.id },
      { name: 'Karkh', latitude: 33.3200, longitude: 44.3300, governorateId: baghdadGov.id },
      { name: 'Adhamiya', latitude: 33.3600, longitude: 44.4200, governorateId: baghdadGov.id },
      { name: 'Sadr City', latitude: 33.3650, longitude: 44.4100, governorateId: baghdadGov.id },
    ];

    console.log('\n📍 Seeding Baghdad Districts...');
    for (const districtData of baghdadDistricts) {
      const existing = await districtRepository.findOne({ where: { name: districtData.name, governorateId: baghdadGov.id } });
      if (!existing) {
        const district = await districtRepository.save(districtData);
        console.log(`✓ Added: ${districtData.name}`);

        // Add neighborhoods for Karrada as example
        if (districtData.name === 'Karrada') {
          const neighborhoods = [
            { name: 'Karrada Al-Sharqiya', latitude: 33.2850, longitude: 44.3700, districtId: district.id },
            { name: 'Karrada Al-Gharbiya', latitude: 33.2850, longitude: 44.3500, districtId: district.id },
            { name: 'Abu Nuwas', latitude: 33.2900, longitude: 44.3800, districtId: district.id },
          ];

          console.log(`  → Adding neighborhoods to ${districtData.name}...`);
          for (const neighborhoodData of neighborhoods) {
            const existingNeighborhood = await neighborhoodRepository.findOne({ 
              where: { name: neighborhoodData.name, districtId: district.id } 
            });
            if (!existingNeighborhood) {
              await neighborhoodRepository.save(neighborhoodData);
              console.log(`    ✓ Added: ${neighborhoodData.name}`);
            }
          }
        }
      }
    }
  }

  console.log('\n✅ Database seeding completed!');
  await app.close();
}

bootstrap();
