import { Module } from '@nestjs/common';
import { extendedPrismaClient } from './prisma.extension';

@Module({
  providers: [
    {
      provide: 'PrismaService',
      useValue: extendedPrismaClient,
    },
  ],
  exports: ['PrismaService'],
})
export class PrismaModule {}
