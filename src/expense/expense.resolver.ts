import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ExpenseService } from './expense.service';
import { Expense } from 'src/@generated/objectTypes/expense/expense.model';
import { CreateExpenseInput } from './inputTypes/create-expense.input';
import { User } from 'src/@generated/objectTypes/user/user.model';
import { Me } from 'src/user/decorators/me.decorator';
import { UpdateExpenseInput } from './inputTypes/update-expense.input';

@Resolver(() => Expense)
export class ExpenseResolver {
  constructor(private readonly expenseService: ExpenseService) {}

  @Query(() => Expense)
  async expense(@Args('id') id: string, @Me() user: User): Promise<Expense> {
    return this.expenseService.findOne(id, user.id);
  }

  @Query(() => [Expense])
  async expenses(@Me() user: User): Promise<Expense[] | null> {
    return this.expenseService.findAll(user.id);
  }

  @Mutation(() => Expense)
  async createExpense(
    @Args('data') data: CreateExpenseInput,
    @Me() user: User,
  ): Promise<Expense> {
    return this.expenseService.create(data, user.id);
  }

  @Mutation(() => Expense)
  async updateExpense(
    @Args('id') id: string,
    @Args('data') data: UpdateExpenseInput,
    @Me() user: User,
  ): Promise<Expense> {
    return this.expenseService.update(id, data, user.id);
  }

  @Mutation(() => Expense)
  async deleteExpense(
    @Args('id') id: string,
    @Me() user: User,
  ): Promise<Expense> {
    return this.expenseService.remove(id, user.id);
  }
}
