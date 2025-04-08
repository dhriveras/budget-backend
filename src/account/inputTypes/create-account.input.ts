import { InputType, Field } from '@nestjs/graphql';
import { AccountType } from 'src/@generated/objectTypes/prisma/account-type.enum';
import { Currency } from 'src/@generated/objectTypes/prisma/currency.enum';

@InputType()
export class CreateAccountInput {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Number, { defaultValue: 0 })
  initialBalance: number;

  @Field(() => AccountType)
  type: keyof typeof AccountType;

  @Field(() => Currency, { defaultValue: Currency.USD })
  currency: keyof typeof Currency;
}
