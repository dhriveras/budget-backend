import { PrismaClient } from '@prisma/client';
import { pagination } from 'prisma-extension-pagination';

const baseClient = new PrismaClient();

const extendedClient = baseClient.$extends(pagination());

export type ExtendedPrismaClient = typeof extendedClient;

let prismaSingleton: ExtendedPrismaClient | null = null;

export function getExtendedPrismaClient(): ExtendedPrismaClient {
  if (!prismaSingleton) {
    prismaSingleton = extendedClient;
  }
  return prismaSingleton;
}
