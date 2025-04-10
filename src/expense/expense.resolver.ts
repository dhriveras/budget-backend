import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ExpenseService } from './expense.service';
import { Expense } from 'src/@generated/objectTypes/expense/expense.model';
import { CreateExpenseInput } from './inputTypes/create-expense.input';
import { User } from 'src/@generated/objectTypes/user/user.model';
import { Me } from 'src/user/decorators/me.decorator';
import { UpdateExpenseInput } from './inputTypes/update-expense.input';
import { Category } from 'src/@generated/objectTypes/category/category.model';
import { CategoryService } from 'src/category/category.service';
import { ExpenseFilterInput } from './inputTypes/filters/expense-filter.input';
import { AccountService } from 'src/account/account.service';
import { Account } from 'src/@generated/objectTypes/account/account.model';

@Resolver(() => Expense)
export class ExpenseResolver {
  constructor(
    private readonly expenseService: ExpenseService,
    private readonly categoryService: CategoryService,
    private readonly accountService: AccountService,
  ) {}

  @Query(() => Expense)
  async expense(@Args('id') id: string, @Me() user: User) {
    return this.expenseService.findOne(id, user.id);
  }

  @Query(() => [Expense])
  async expenses(
    @Me() user: User,
    @Args('filter', { nullable: true }) filter?: ExpenseFilterInput,
  ) {
    return this.expenseService.findAll(user.id, filter);
  }

  @Mutation(() => Expense)
  async createExpense(
    @Args('data') data: CreateExpenseInput,
    @Me() user: User,
  ) {
    return this.expenseService.create(data, user.id);
  }

  @Mutation(() => Expense)
  async updateExpense(
    @Args('id') id: string,
    @Args('data') data: UpdateExpenseInput,
    @Me() user: User,
  ) {
    return this.expenseService.update(id, data, user.id);
  }

  @Mutation(() => Expense)
  async deleteExpense(@Args('id') id: string, @Me() user: User) {
    return this.expenseService.delete(id, user.id);
  }

  @ResolveField(() => Category, { nullable: true })
  async category(@Parent() { categoryId, createdBy }: Expense) {
    if (categoryId) return this.categoryService.findOne(categoryId, createdBy);
  }

  @ResolveField(() => Account, { nullable: true })
  async account(@Parent() { accountId }: Expense, @Me() user: User) {
    if (accountId) return this.accountService.findOne(accountId, user.id);
  }
}
