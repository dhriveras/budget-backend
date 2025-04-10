import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseResolver } from './expense.resolver';
import { PrismaService } from 'nestjs-prisma';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CategoryModule } from 'src/category/category.module';
import { AccountModule } from 'src/account/account.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  providers: [ExpenseResolver, ExpenseService, PrismaService],
  imports: [PrismaModule, CategoryModule, AccountModule, CommonModule],
  exports: [ExpenseService],
})
export class ExpenseModule {}
