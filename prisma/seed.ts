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
    },
    {
      name: 'Lonar Lake',
      latitude: 19.9667,
      longitude: 76.5000,
      description: 'Declared a Ramsar site on 22/07/2020 in Maharashtra, covering 427 ha. Famous as a unique meteorite impact crater lake.'
    },
    {
      name: 'Ansupa Lake',
      latitude: 20.4500,
      longitude: 85.6000,
      description: 'Declared a Ramsar site on 12/10/2021 in Odisha, covering 231 ha. A horseshoe-shaped freshwater lake by the Mahanadi river.'
    },
    
  {
    name: 'Chilika Lake',
    latitude: 19.7000,
    longitude: 85.3500,
    description: 'Declared a Ramsar site on 01/10/1981 in Odisha, covering 116,500 ha. It is the largest brackish water lagoon in Asia and an important habitat for migratory birds.'
  },
  {
    name: 'Harike Lake',
    latitude: 31.2000,
    longitude: 75.2000,
    description: 'Declared a Ramsar site on 23/03/1990 in Punjab, covering 4,100 ha. A shallow water reservoir formed by the confluence of the Beas and Sutlej rivers.'
  },
  {
    name: 'Kolleru Lake',
    latitude: 16.6167,
    longitude: 81.2000,
    description: 'Declared a Ramsar site on 19/08/2002 in Andhra Pradesh, covering 90,100 ha. One of the largest freshwater lakes in India, a significant bird habitat.'
  },
  {
    name: 'Loktak Lake',
    latitude: 24.4333,
    longitude: 93.8000,
    description: 'Declared a Ramsar site on 23/03/1990 in Manipur, covering 26,600 ha. Known for its phumdis (floating islands) and the only floating national park in the world.'
  },
  {
    name: 'Nanda Lake',
    latitude: 15.2333,
    longitude: 74.0667,
    description: 'Declared a Ramsar site on 08/06/2022 in Goa, covering 42 ha. A small but ecologically important freshwater lake supporting rich avifauna.'
  },
  {
    name: 'Renuka Wetland (Renuka Lake)',
    latitude: 31.6167,
    longitude: 77.4500,
    description: 'Declared a Ramsar site on 08/11/2005 in Himachal Pradesh, covering 20 ha. A sacred lake surrounded by forests, significant for cultural and ecological value.'
  },
  {
    name: 'Rudrasagar Lake',
    latitude: 23.4667,
    longitude: 91.2667,
    description: 'Declared a Ramsar site on 08/11/2005 in Tripura, covering 240 ha. A natural sedimentation reservoir lake important for fish and waterbirds.'
  },
  {
    name: 'Sakhya Sagar',
    latitude: 25.4333,
    longitude: 77.7000,
    description: 'Declared a Ramsar site on 07/01/2022 in Madhya Pradesh, covering 248 ha. A human-made reservoir adjoining Madhav National Park.'
  },
  {
    name: 'Sambhar Lake',
    latitude: 27.0000,
    longitude: 75.8333,
    description: 'Declared a Ramsar site on 23/03/1990 in Rajasthan, covering 24,000 ha. India’s largest inland saltwater lake and a critical habitat for flamingos.'
  },
  {
    name: 'Surinsar-Mansar Lakes',
    latitude: 32.7500,
    longitude: 75.2000,
    description: 'Declared a Ramsar site on 08/11/2005 in Jammu & Kashmir, covering 350 ha. Twin freshwater lakes with ecological, cultural and recreational value.'
  },
  {
    name: 'Tampara Lake',
    latitude: 19.3500,
    longitude: 85.0000,
    description: 'Declared a Ramsar site on 12/10/2021 in Odisha, covering 300 ha. A natural freshwater lake formed along the Rushikulya river basin.'
  },
  {
    name: 'Tawa Reservoir',
    latitude: 22.5000,
    longitude: 78.0000,
    description: 'Declared a Ramsar site on 08/01/2024 in Madhya Pradesh, covering 20,050 ha. A large reservoir created on the Tawa river, supporting fisheries and irrigation.'
  },
  {
    name: 'Thol Lake Wildlife Sanctuary',
    latitude: 23.1333,
    longitude: 72.4000,
    description: 'Declared a Ramsar site on 05/04/2021 in Gujarat, covering 699 ha. A shallow freshwater lake important for migratory birds like flamingos and cranes.'
  },
  {
    name: 'Tso Kar Wetland Complex',
    latitude: 33.2833,
    longitude: 78.0000,
    description: 'Declared a Ramsar site on 17/11/2020 in Ladakh, covering 9,577 ha. High-altitude salt lake system consisting of freshwater and hypersaline lakes.'
  },
  {
    name: 'Tsomoriri',
    latitude: 32.9000,
    longitude: 78.3000,
    description: 'Declared a Ramsar site on 19/08/2002 in Jammu & Kashmir, covering 12,000 ha. A high-altitude lake in the Changthang region, crucial for migratory birds like the black-necked crane.'
  },
  {
    name: 'Udhwa Lake Bird Sanctuary',
    latitude: 24.9833,
    longitude: 87.8000,
    description: 'Declared a Ramsar site on 08/01/2024 in Jharkhand, covering 936 ha. Twin lakes (Pataura & Berhale) forming a bird sanctuary in the Ganga basin.'
  },
  {
    name: 'Wular Lake',
    latitude: 34.2500,
    longitude: 74.5500,
    description: 'Declared a Ramsar site on 23/03/1990 in Jammu & Kashmir, covering 18,900 ha. One of the largest freshwater lakes in Asia, critical for flood control and fisheries.'
  },
  {
    name: 'Yashwant Sagar',
    latitude: 22.8000,
    longitude: 75.6833,
    description: 'Declared a Ramsar site on 07/01/2022 in Madhya Pradesh, covering 823 ha. A reservoir near Indore, important for waterfowl and city water supply.'
  }
]

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
