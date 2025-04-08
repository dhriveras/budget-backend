import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';

@ObjectType()
export class AccountCount {

    @Field(() => Int, {nullable:false})
    expenses?: number;

    @Field(() => Int, {nullable:false})
    incomes?: number;
}
