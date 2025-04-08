import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { ID } from '@nestjs/graphql';
import { HideField } from '@nestjs/graphql';
import { Expense } from '../expense/expense.model';
import { Category } from '../category/category.model';
import { Account } from '../account/account.model';
import { Income } from '../income/income.model';
import { UserCount } from './user-count.output';

@ObjectType()
export class User {

    @Field(() => ID, {nullable:false})
    id!: string;

    @Field(() => String, {nullable:false})
    name!: string;

    @Field(() => String, {nullable:false})
    email!: string;

    @HideField()
    password!: string;

    @HideField()
    refreshToken!: string | null;

    @Field(() => Date, {nullable:false})
    createdAt!: Date;

    @Field(() => Date, {nullable:false})
    updatedAt!: Date;

    @Field(() => [Expense], {nullable:true})
    expenses?: Array<Expense>;

    @Field(() => [Category], {nullable:true})
    categories?: Array<Category>;

    @Field(() => [Account], {nullable:true})
    accounts?: Array<Account>;

    @Field(() => [Income], {nullable:true})
    incomes?: Array<Income>;

    @Field(() => UserCount, {nullable:false})
    _count?: UserCount;
}
