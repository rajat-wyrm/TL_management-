import { PrismaClient } from '@prisma/client';
import config from '../config/index.js';

const prisma = new PrismaClient({
  log: config.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

export async function connectDB() {
  await prisma.$connect();
  console.log('📦 PostgreSQL connected');
}

export async function disconnectDB() {
  await prisma.$disconnect();
}

export default prisma;
