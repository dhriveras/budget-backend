import { PrismaClient } from '@prisma/client';

const prismaSingleton = new PrismaClient();

export { prismaSingleton as extendedPrismaClient };
export type ExtendedPrismaClient = PrismaClient;
