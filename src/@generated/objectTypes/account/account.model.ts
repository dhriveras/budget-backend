import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { ID } from '@nestjs/graphql';
import { Float } from '@nestjs/graphql';
import { AccountType } from '../prisma/account-type.enum';
import { Currency } from '../prisma/currency.enum';
import { User } from '../user/user.model';
import { Expense } from '../expense/expense.model';
import { Income } from '../income/income.model';
import { AccountCount } from './account-count.output';

@ObjectType()
export class Account {

    @Field(() => ID, {nullable:false})
    id!: string;

    @Field(() => String, {nullable:false})
    name!: string;

    @Field(() => String, {nullable:true})
    description!: string | null;

    @Field(() => Float, {nullable:false})
    initialBalance!: number;

    @Field(() => AccountType, {nullable:false})
    type!: `${AccountType}`;

    @Field(() => Currency, {nullable:false})
    currency!: `${Currency}`;

    @Field(() => String, {nullable:false})
    createdBy!: string;

    @Field(() => Date, {nullable:false})
    createdAt!: Date;

    @Field(() => Date, {nullable:false})
    updatedAt!: Date;

    @Field(() => User, {nullable:false})
    user?: User;

    @Field(() => [Expense], {nullable:true})
    expenses?: Array<Expense>;

    @Field(() => [Income], {nullable:true})
    incomes?: Array<Income>;

    @Field(() => AccountCount, {nullable:false})
    _count?: AccountCount;
}
