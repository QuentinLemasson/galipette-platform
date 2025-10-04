import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

interface Config {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
}

export const config: Config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  DATABASE_URL: process.env.DATABASE_URL || '',
};

// Validate required env variables
const validateEnv = (): void => {
  const requiredEnvVars: (keyof Config)[] = ['DATABASE_URL'];

  const missingEnvVars = requiredEnvVars.filter((envVar) => !config[envVar]);

  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  }
};

try {
  validateEnv();
} catch (error: any) {
  console.error('Environment validation failed:', error.message);
  process.exit(1);
}
