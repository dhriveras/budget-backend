import { registerEnumType } from '@nestjs/graphql';

export enum AccountType {
    CASH = "CASH",
    BANK = "BANK",
    CREDIT_CARD = "CREDIT_CARD"
}


registerEnumType(AccountType, { name: 'AccountType', description: undefined })
