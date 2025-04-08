import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AccountService } from './account.service';
import { Account } from 'src/@generated/objectTypes/account/account.model';
import { CreateAccountInput } from './inputTypes/create-account.input';
import { Me } from 'src/user/decorators/me.decorator';
import { User } from 'src/@generated/objectTypes/user/user.model';
import { UpdateAccountInput } from './inputTypes/update-account.input';

@Resolver(() => Account)
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  @Query(() => Account)
  account(@Me() user: User, @Args('id') id: string) {
    return this.accountService.findOne(id, user.id);
  }

  @Query(() => [Account])
  accounts(@Me() user: User) {
    return this.accountService.findAll(user.id);
  }

  @Mutation(() => Account)
  createAccount(@Me() user: User, @Args('data') data: CreateAccountInput) {
    return this.accountService.create(data, user.id);
  }

  @Mutation(() => Account)
  updateAccount(
    @Me() user: User,
    @Args('id') id: string,
    @Args('data') data: UpdateAccountInput,
  ) {
    return this.accountService.update(id, data, user.id);
  }

  @Mutation(() => Account)
  removeAccount(@Me() user: User, @Args('id') id: string) {
    return this.accountService.remove(id, user.id);
  }

  @ResolveField(() => Number)
  balance(@Me() user: User, @Parent() { id }: Account) {
    return this.accountService.getBalance(id, user.id);
  }
}
