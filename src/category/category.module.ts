import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryResolver } from './category.resolver';
import { PrismaService } from 'nestjs-prisma';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [CategoryResolver, CategoryService, PrismaService],
  imports: [PrismaModule],
  exports: [CategoryService],
})
export class CategoryModule {}
