// Prisma client instance
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Dynamic import to handle Prisma client in serverless
let PrismaClient: any;
try {
  PrismaClient = require('@prisma/client').PrismaClient;
} catch (error) {
  console.error('Failed to import PrismaClient:', error);
  throw error;
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

// Use singleton pattern for Prisma Client in serverless
const globalForPrisma = global as unknown as { prisma: any };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;