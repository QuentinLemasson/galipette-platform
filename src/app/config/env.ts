import pkg from '../../../package.json' with { type: 'json' };

export const config = {
  // API Configuration
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  apiTimeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,

  // App Configuration (from package.json)
  appName: pkg.displayName || pkg.name,
  appVersion: pkg.version,
  appDescription: pkg.description,

  // Environment
  environment: import.meta.env.MODE,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,

  // Features
  enableMocking: import.meta.env.VITE_ENABLE_MOCKING === 'true',
  enableDebug: import.meta.env.VITE_ENABLE_DEBUG === 'true',
} as const;

export type Config = typeof config;

// Validation
export const validateConfig = () => {
  const required = ['apiUrl'] as const;

  for (const key of required) {
    if (!config[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  return true;
};
