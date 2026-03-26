import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'], //it show in terminal what commands run
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}