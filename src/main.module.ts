import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ExpenseModule } from './expense/expense.module';
import { CategoryModule } from './category/category.module';
import { IncomeModule } from './income/income.module';

export default [
  AuthModule,
  UserModule,
  CategoryModule,
  ExpenseModule,
  IncomeModule,
];
