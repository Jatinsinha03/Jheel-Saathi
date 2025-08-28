# Jheel Saathi

### Problem Statement

India’s lakes and traditional water bodies are rapidly deteriorating due to unchecked urbanization, sewage discharge, solid-waste dumping, loss of green buffers, and fading community stewardship. Once vital for biodiversity, groundwater recharge, and local livelihoods, these ecosystems now suffer from neglect, pollution, and shrinking water capacity. Scientific lake monitoring remains limited, expensive, and inaccessible to most citizens. There is no simple way for people to assess the health of their neighborhood lake or understand how to help, leaving communities disempowered and restoration efforts under-supported.

Personal experiences with local water bodies such as Girital, Dronasagar, and numerous seasonal streams mirror a nationwide reality: the absence of a scalable, community‑driven system for monitoring, learning, and participating in lake conservation. This gap slows collective action and environmental learning, especially among students and youth who are eager to contribute but lack practical tools and guidance.

### Solution

Jheel Saathi is a web‑based, community‑centered platform that empowers citizens—especially students, youth, and local communities—to understand and evaluate the ecological health of their neighborhood lakes and water bodies. Through an intuitive interface, users answer simple visual and text‑based questions on water clarity, biodiversity presence, vegetation, human activity, and seasonal changes. The platform generates a dynamic, easy‑to‑read Lake Health Report and an AI‑assisted summary with actionable conservation recommendations.

Beyond data collection, Jheel Saathi is a learning experience designed to build ecological literacy and inspire behavioral change. By observing real‑world indicators, users learn concepts such as eutrophication, habitat loss, and pollution through guided, experiential interactions. The platform bridges scientific assessment with citizen participation, making lake monitoring accessible, meaningful, and classroom‑friendly.

### Demo Link - [Demo Link](https://jheel-saathi.vercel.app/)
### Demo Video Link - [Demo Video Link](https://youtu.be/eTlDFY0aUeY)

### PPT Link - [PPT Link](https://docs.google.com/presentation/d/1sXhWfUTS63lJ0VPR7lYSZ_TxTRv_9vYk9x8C31BQ9TI/edit?usp=sharing)

### Features

- **Interactive Lake Questionnaire**: Guided, student‑friendly assessment of water clarity, biodiversity, vegetation, and human activity; supports repeat submissions over time.
- **AI Lake Health Report**: Gemini‑powered analysis summarizing ecological status, trends, conservation recommendations, and “how you can contribute” actions.
- **Printable Reports & Forms**: One‑click print for completed reports and a clean, blank questionnaire for offline fieldwork.
- **Map‑Based Explorer**: View and select lakes/water bodies, see recent observations and community insights.
- **Community Insights**: Aggregated metrics (e.g., average clarity, vegetation density, sightings) and top notes from contributors.
- **Quiz & Leaderboard**: 10‑question quizzes from a curated pool to reinforce lake ecology concepts; track scores on a friendly leaderboard.
- **Resources Hub**: Curated PDFs and credible links to learn about freshwater ecosystems, assessment methods, and restoration.
- **Safety Guide**: Clear, youth‑oriented do’s & don’ts for safe and responsible lake exploration.
- **Accounts & Auth**: Simple authentication to attribute contributions and retain progress.
- **Scalable & Classroom‑Ready**: Works for schools, NGOs, and citizen groups aiming to monitor multiple sites over time.


## Features

### 🌊 Water Body Management
- **Interactive Map**: View water bodies on an interactive map using MapLibre GL
- **Add New Water Bodies**: Users can add new water bodies with their current location or manual coordinates
- **Water Body Details**: Store name, description, and precise coordinates for each water body

### 📝 Environmental Assessment Questionnaires
The application includes a comprehensive 5-question questionnaire system covering:

1. **Water Clarity Rating** (1-5 scale)
   - 1 = Very murky
   - 5 = Crystal clear

2. **Biodiversity Presence**
   - Fish presence
   - Bird presence
   - Other wildlife presence
   - Biodiversity notes

3. **Vegetation Assessment**
   - Vegetation density (1-5 scale)
   - Vegetation types (Trees, Shrubs, Grass, Aquatic Plants, Reeds, Moss, Ferns, Wildflowers)

4. **Additional Information**
   - General notes and observations
   - User name (optional)
   - User location data

### 🗄️ Database
- **PostgreSQL Database**: Powered by Prisma ORM
- **Data Models**: 
  - `WaterBody`: Stores water body information
  - `WaterBodyQuestionnaire`: Stores assessment data with relationships

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Mapping**: MapLibre GL (open-source alternative to Mapbox)
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Deployment**: Ready for Vercel deployment

## License

Open source - feel free to use for environmental monitoring and educational purposes.

## Environmental Impact

This application supports:
- Citizen science water quality monitoring
- Environmental data collection
- Water body health tracking
- Biodiversity assessment
- Vegetation monitoring

Perfect for environmental organizations, schools, and individuals interested in water quality and ecosystem health.
