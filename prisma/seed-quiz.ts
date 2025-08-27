import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

const quizQuestions = [
  {
    question: "What is the primary source of oxygen in lake ecosystems?",
    optionA: "Fish respiration",
    optionB: "Aquatic plants and algae",
    optionC: "Atmospheric diffusion",
    optionD: "Underwater springs",
    correctAnswer: "B",
    explanation: "Aquatic plants and algae are the primary producers that generate oxygen through photosynthesis in lake ecosystems.",
    category: "ecology",
    difficulty: "medium"
  },
  {
    question: "Which of the following is NOT a common indicator of poor water quality in lakes?",
    optionA: "High levels of dissolved oxygen",
    optionB: "Excessive algae growth",
    optionC: "Low water clarity",
    optionD: "High levels of nutrients",
    correctAnswer: "A",
    explanation: "High levels of dissolved oxygen indicate good water quality. Poor water quality is characterized by low oxygen levels.",
    category: "water_quality",
    difficulty: "easy"
  },
  {
    question: "What is eutrophication?",
    optionA: "The natural aging process of lakes",
    optionB: "Excessive nutrient enrichment causing algae blooms",
    optionC: "The formation of new lakes",
    optionD: "The drying up of lakes",
    correctAnswer: "B",
    explanation: "Eutrophication is the excessive enrichment of water with nutrients, leading to dense plant growth and oxygen depletion.",
    category: "conservation",
    difficulty: "medium"
  },
  {
    question: "Which lake is the largest freshwater lake by surface area?",
    optionA: "Lake Superior",
    optionB: "Lake Victoria",
    optionC: "Caspian Sea",
    optionD: "Lake Baikal",
    correctAnswer: "A",
    explanation: "Lake Superior is the largest freshwater lake by surface area, covering 82,100 square kilometers.",
    category: "geography",
    difficulty: "easy"
  },
  {
    question: "What role do wetlands play in lake ecosystems?",
    optionA: "They only provide habitat for birds",
    optionB: "They act as natural filters and flood control",
    optionC: "They have no significant role",
    optionD: "They only exist for aesthetic purposes",
    correctAnswer: "B",
    explanation: "Wetlands act as natural filters, removing pollutants, and provide flood control by absorbing excess water.",
    category: "ecology",
    difficulty: "medium"
  },
  {
    question: "Which of the following is a non-point source of water pollution?",
    optionA: "Industrial discharge pipe",
    optionB: "Agricultural runoff",
    optionC: "Sewage treatment plant",
    optionD: "Factory outlet",
    correctAnswer: "B",
    explanation: "Agricultural runoff is a non-point source of pollution as it comes from diffuse sources across a wide area.",
    category: "pollution",
    difficulty: "medium"
  },
  {
    question: "What is the pH range considered normal for most freshwater lakes?",
    optionA: "3.0-5.0",
    optionB: "6.5-8.5",
    optionC: "9.0-11.0",
    optionD: "1.0-3.0",
    correctAnswer: "B",
    explanation: "Most freshwater lakes have a pH range of 6.5-8.5, which is suitable for most aquatic life.",
    category: "water_quality",
    difficulty: "medium"
  },
  {
    question: "Which of the following best describes a lake's thermocline?",
    optionA: "The surface layer of water",
    optionB: "A rapid temperature change zone between warm and cold water",
    optionC: "The bottom layer of water",
    optionD: "The area where rivers enter the lake",
    correctAnswer: "B",
    explanation: "The thermocline is a layer where water temperature changes rapidly with depth, separating warm surface water from cold deep water.",
    category: "ecology",
    difficulty: "hard"
  },
  {
    question: "What percentage of Earth's surface freshwater is contained in lakes?",
    optionA: "About 20%",
    optionB: "About 50%",
    optionC: "About 87%",
    optionD: "About 95%",
    correctAnswer: "C",
    explanation: "Lakes contain about 87% of Earth's surface freshwater, making them crucial freshwater resources.",
    category: "geography",
    difficulty: "medium"
  },
  {
    question: "Which of the following is a natural way lakes are formed?",
    optionA: "Only by human construction",
    optionB: "Only by volcanic activity",
    optionC: "By glaciers, tectonic activity, and volcanic activity",
    optionD: "Only by river erosion",
    correctAnswer: "C",
    explanation: "Lakes can be formed naturally by glaciers, tectonic activity, volcanic activity, and other geological processes.",
    category: "geography",
    difficulty: "easy"
  },
  {
    question: "What is the main cause of lake acidification?",
    optionA: "Natural processes only",
    optionB: "Acid rain from air pollution",
    optionC: "Fish waste",
    optionD: "Plant decomposition",
    correctAnswer: "B",
    explanation: "Lake acidification is primarily caused by acid rain resulting from air pollution, particularly sulfur dioxide and nitrogen oxides.",
    category: "pollution",
    difficulty: "medium"
  },
  {
    question: "Which of the following is an invasive species that can harm lake ecosystems?",
    optionA: "Native fish species",
    optionB: "Water lilies",
    optionC: "Zebra mussels",
    optionD: "Local algae",
    correctAnswer: "C",
    explanation: "Zebra mussels are invasive species that can disrupt lake ecosystems by outcompeting native species and clogging infrastructure.",
    category: "conservation",
    difficulty: "medium"
  },
  {
    question: "What is the primary function of riparian zones around lakes?",
    optionA: "To provide swimming areas",
    optionB: "To act as buffers and protect water quality",
    optionC: "To create fishing spots",
    optionD: "To provide boat access",
    correctAnswer: "B",
    explanation: "Riparian zones act as natural buffers, filtering pollutants and protecting water quality in lakes.",
    category: "ecology",
    difficulty: "medium"
  },
  {
    question: "Which of the following is a measure of water clarity?",
    optionA: "Secchi disk depth",
    optionB: "Water temperature",
    optionC: "Dissolved oxygen",
    optionD: "pH level",
    correctAnswer: "A",
    explanation: "Secchi disk depth is a standard measure of water clarity, indicating how deep light penetrates into the water.",
    category: "water_quality",
    difficulty: "easy"
  },
  {
    question: "What is the main threat to lake biodiversity?",
    optionA: "Natural climate cycles",
    optionB: "Human activities and pollution",
    optionC: "Fish migration",
    optionD: "Seasonal changes",
    correctAnswer: "B",
    explanation: "Human activities and pollution are the main threats to lake biodiversity, including habitat destruction and water pollution.",
    category: "conservation",
    difficulty: "easy"
  },
  {
    question: "Which lake is the deepest in the world?",
    optionA: "Lake Superior",
    optionB: "Lake Baikal",
    optionC: "Lake Tanganyika",
    optionD: "Lake Victoria",
    correctAnswer: "B",
    explanation: "Lake Baikal in Russia is the deepest lake in the world, reaching depths of over 1,600 meters.",
    category: "geography",
    difficulty: "easy"
  },
  {
    question: "What is the process called when lakes naturally fill with sediment over time?",
    optionA: "Eutrophication",
    optionB: "Sedimentation",
    optionC: "Succession",
    optionD: "All of the above",
    correctAnswer: "D",
    explanation: "Lakes naturally fill with sediment over time through a process called succession, which includes sedimentation and eutrophication.",
    category: "ecology",
    difficulty: "hard"
  },
  {
    question: "Which of the following is a sustainable practice for lake conservation?",
    optionA: "Using chemical fertilizers near lake shores",
    optionB: "Implementing buffer zones and reducing runoff",
    optionC: "Draining wetlands for development",
    optionD: "Removing all aquatic plants",
    correctAnswer: "B",
    explanation: "Implementing buffer zones and reducing runoff are sustainable practices that help protect lake water quality.",
    category: "conservation",
    difficulty: "medium"
  },
  {
    question: "What is the primary source of energy in lake food webs?",
    optionA: "Fish",
    optionB: "Sunlight",
    optionC: "Bacteria",
    optionD: "Minerals",
    correctAnswer: "B",
    explanation: "Sunlight is the primary source of energy in lake food webs, driving photosynthesis in aquatic plants and algae.",
    category: "ecology",
    difficulty: "easy"
  },
  {
    question: "Which of the following best describes a lake's watershed?",
    optionA: "The lake's surface area",
    optionB: "The area of land that drains into the lake",
    optionC: "The lake's depth",
    optionD: "The lake's shoreline",
    correctAnswer: "B",
    explanation: "A watershed is the area of land that drains water into a lake, river, or other water body.",
    category: "geography",
    difficulty: "medium"
  }
];

async function main() {
  console.log('🌊 Seeding quiz questions...');

  for (const question of quizQuestions) {
    await prisma.quizQuestion.create({
      data: question
    });
  }

  console.log(`✅ Seeded ${quizQuestions.length} quiz questions`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding quiz questions:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
