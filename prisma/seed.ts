import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌊 Seeding water bodies...');

  // Sample water bodies data
  const waterBodies = [
    {
      name: 'Lake Tahoe',
      latitude: 39.0968,
      longitude: -120.0324,
      description: 'A large freshwater lake in the Sierra Nevada mountains, known for its clear blue waters and stunning alpine scenery.'
    },
    {
      name: 'Crater Lake',
      latitude: 42.9440,
      longitude: -122.1090,
      description: 'A volcanic crater lake in Oregon, famous for its deep blue color and water clarity. It is the deepest lake in the United States.'
    },
    {
      name: 'Lake Superior',
      latitude: 47.7289,
      longitude: -87.5500,
      description: 'The largest of the Great Lakes and the largest freshwater lake by surface area in the world.'
    },
    {
      name: 'Great Salt Lake',
      latitude: 41.1620,
      longitude: -112.4990,
      description: 'The largest saltwater lake in the Western Hemisphere, located in Utah.'
    },
    {
      name: 'Lake Michigan',
      latitude: 44.3148,
      longitude: -85.6024,
      description: 'One of the five Great Lakes, known for its beautiful beaches and recreational opportunities.'
    }
  ];

  for (const waterBody of waterBodies) {
    await prisma.waterBody.upsert({
      where: { name: waterBody.name },
      update: {},
      create: waterBody,
    });
    console.log(`✅ Added/Updated: ${waterBody.name}`);
  }

  console.log('🌊 Water bodies seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
