import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { ID } from '@nestjs/graphql';
import { Float } from '@nestjs/graphql';
import { User } from '../user/user.model';
import { Account } from '../account/account.model';

@ObjectType()
export class Income {

    @Field(() => ID, {nullable:false})
    id!: string;

    @Field(() => String, {nullable:false})
    name!: string;

    @Field(() => Float, {nullable:false})
    amount!: number;

    @Field(() => Date, {nullable:false})
    date!: Date;

    @Field(() => String, {nullable:true})
    description!: string | null;

    @Field(() => String, {nullable:false})
    createdBy!: string;

    @Field(() => Date, {nullable:false})
    createdAt!: Date;

    @Field(() => Date, {nullable:false})
    updatedAt!: Date;

    @Field(() => String, {nullable:false})
    accountId!: string;

    @Field(() => User, {nullable:false})
    user?: User;

    @Field(() => Account, {nullable:false})
    account?: Account;
}
