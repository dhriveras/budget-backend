import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { IncomeService } from './income.service';
import { Income } from 'src/@generated/objectTypes/income/income.model';
import { CreateIncomeInput } from './inputTypes/create-income.input';
import { User } from 'src/@generated/objectTypes/user/user.model';
import { Me } from 'src/user/decorators/me.decorator';
import { UpdateIncomeInput } from './inputTypes/update-income.input';
import { IncomeFilterInput } from './inputTypes/filters/income-filter.input';
import { Account } from 'src/@generated/objectTypes/account/account.model';
import { AccountService } from 'src/account/account.service';

@Resolver(() => Income)
export class IncomeResolver {
  constructor(
    private readonly incomeService: IncomeService,
    private readonly accountService: AccountService,
  ) {}

  @Query(() => Income)
  income(@Args('id') id: string, @Me() user: User) {
    return this.incomeService.findOne(id, user.id);
  }

  @Query(() => [Income])
  incomes(
    @Me() user: User,
    @Args('filter', { nullable: true }) filter?: IncomeFilterInput,
  ): Promise<Income[] | null> {
    return this.incomeService.findAll(user.id, filter);
  }

  @Mutation(() => Income)
  createIncome(@Args('data') data: CreateIncomeInput, @Me() user: User) {
    return this.incomeService.create(data, user.id);
  }

  @Mutation(() => Income)
  updateIncome(
    @Args('id') id: string,
    @Args('data') data: UpdateIncomeInput,
    @Me() user: User,
  ) {
    return this.incomeService.update(id, data, user.id);
  }

  @Mutation(() => Income)
  deleteIncome(@Args('id') id: string, @Me() user: User) {
    return this.incomeService.remove(id, user.id);
  }

  @ResolveField(() => Account)
  async account(@Parent() { accountId }: Income, @Me() user: User) {
    return this.accountService.findOne(accountId, user.id);
  }
}
