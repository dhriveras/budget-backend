import { Field, InputType, Float } from '@nestjs/graphql';

@InputType()
export class IncomeFilterInput {
  @Field(() => Float, { nullable: true })
  minAmount?: number;

  @Field(() => Float, { nullable: true })
  maxAmount?: number;

  @Field({ nullable: true })
  dateFrom?: Date;

  @Field({ nullable: true })
  dateTo?: Date;
}
