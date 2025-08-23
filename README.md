# Water Body Mapping Application

A comprehensive web application for mapping and monitoring water bodies (lakes, rivers, ponds) with environmental assessment questionnaires.

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

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Environment variables configured

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mapping
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file with:
   ```env
   DATABASE_URL="postgresql://username:password@host:port/database"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run database migrations
   npm run db:migrate
   
   # Seed initial data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

### Database Commands

- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with initial water bodies
- `npm run db:studio` - Open Prisma Studio for database management

## Initial Data

The application comes pre-seeded with 5 famous water bodies:
- Lake Tahoe (California/Nevada)
- Crater Lake (Oregon)
- Lake Superior (Great Lakes)
- Great Salt Lake (Utah)
- Lake Michigan (Great Lakes)

## API Endpoints

### Water Bodies
- `GET /api/water-bodies` - Get all water bodies
- `POST /api/water-bodies` - Create new water body

### Questionnaires
- `GET /api/questionnaires` - Get all questionnaires
- `GET /api/questionnaires?waterBodyId=<id>` - Get questionnaires for specific water body
- `POST /api/questionnaires` - Submit new questionnaire

### Clustering
- `GET /api/clusters?bbox=<west,south,east,north>&zoom=<level>` - Get clustered water bodies for map

## Usage

1. **View Water Bodies**: Open the application to see water bodies on the interactive map
2. **Add Water Body**: Click "🌊 Add Water Body" button to add new locations
3. **Use Current Location**: The form can automatically detect your current GPS coordinates
4. **Submit Questionnaires**: Click on any water body marker and use the questionnaire link
5. **Environmental Assessment**: Complete the 5-question assessment for water quality monitoring

## Contributing

This application is designed for environmental monitoring and citizen science. Contributions are welcome for:
- Additional questionnaire questions
- Enhanced mapping features
- Data visualization improvements
- Mobile app development

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
