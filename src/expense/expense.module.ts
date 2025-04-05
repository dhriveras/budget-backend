import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseResolver } from './expense.resolver';
import { PrismaService } from 'nestjs-prisma';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CategoryModule } from 'src/category/category.module';

@Module({
  providers: [ExpenseResolver, ExpenseService, PrismaService],
  imports: [PrismaModule, CategoryModule],
  exports: [ExpenseService],
})
export class ExpenseModule {}
