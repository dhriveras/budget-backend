import { InputType, PartialType } from '@nestjs/graphql';
import { CreateIncomeInput } from './create-income.input';

@InputType()
export class UpdateIncomeInput extends PartialType(CreateIncomeInput) {}
