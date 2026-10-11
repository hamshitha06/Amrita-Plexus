import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __webPrisma: PrismaClient | undefined;
}

export const prisma =
  global.__webPrisma ??
  new PrismaClient({
    log: ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.__webPrisma = prisma;
}
