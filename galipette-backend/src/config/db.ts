import { PrismaClient } from '@prisma/client';

// Create Prisma client instance
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Note: For database shutdown, handle this in the app shutdown process
// Prisma client doesn't support 'beforeExit' events

// Export Prisma client
export default prisma;
