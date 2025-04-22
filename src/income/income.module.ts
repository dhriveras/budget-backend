import { Module } from '@nestjs/common';
import { IncomeService } from './income.service';
import { IncomeResolver } from './income.resolver';
import { AccountModule } from 'src/account/account.module';

@Module({
  providers: [IncomeResolver, IncomeService],
  imports: [AccountModule],
  exports: [IncomeService],
})
export class IncomeModule {}
