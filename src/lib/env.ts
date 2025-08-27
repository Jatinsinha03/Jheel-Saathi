// Environment variable validation
export function validateEnv() {
  const requiredEnvVars = [
    'DATABASE_URL',
    'GEMINI_API_KEY'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  // Validate DATABASE_URL format
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl && !dbUrl.startsWith('postgresql://')) {
    console.warn('Warning: DATABASE_URL should start with "postgresql://"');
  }

  // Validate GEMINI_API_KEY
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey && geminiKey.length < 10) {
    console.warn('Warning: GEMINI_API_KEY seems too short');
  }

  console.log('✅ Environment variables validated successfully');
}

// Call validation on import
if (typeof window === 'undefined') {
  // Only run on server side
  validateEnv();
}
