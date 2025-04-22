import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ExpenseModule } from './expense/expense.module';
import { CategoryModule } from './category/category.module';
import { IncomeModule } from './income/income.module';
import { AccountModule } from './account/account.module';
import { PrismaModule } from './prisma/prisma.module';
import { CommonModule } from './common/common.module';

export default [
  PrismaModule,
  CommonModule,
  AccountModule,
  AuthModule,
  UserModule,
  CategoryModule,
  ExpenseModule,
  IncomeModule,
];
