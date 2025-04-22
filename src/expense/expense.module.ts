import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseResolver } from './expense.resolver';
import { CategoryModule } from 'src/category/category.module';
import { AccountModule } from 'src/account/account.module';

@Module({
  providers: [ExpenseResolver, ExpenseService],
  imports: [CategoryModule, AccountModule],
  exports: [ExpenseService],
})
export class ExpenseModule {}
