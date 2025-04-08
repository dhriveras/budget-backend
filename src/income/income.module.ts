import { Module } from '@nestjs/common';
import { IncomeService } from './income.service';
import { IncomeResolver } from './income.resolver';
import { PrismaService } from 'nestjs-prisma';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AccountModule } from 'src/account/account.module';

@Module({
  providers: [IncomeResolver, IncomeService, PrismaService],
  imports: [PrismaModule, AccountModule],
  exports: [IncomeService],
})
export class IncomeModule {}
