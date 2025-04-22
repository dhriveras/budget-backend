import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {
  getExtendedPrismaClient,
  ExtendedPrismaClient,
} from './prisma.extension';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly prisma: ExtendedPrismaClient;

  constructor() {
    this.prisma = getExtendedPrismaClient();
  }

  async onModuleInit() {
    console.log('Connecting to the database...');
    await this.prisma.$connect();
    console.log('Connected to the database');
  }

  async onModuleDestroy() {
    console.log('Disconnecting from the database...');
    await this.prisma.$disconnect();
    console.log('Disconnected from the database');
  }

  get client(): ExtendedPrismaClient {
    return this.prisma;
  }
}
