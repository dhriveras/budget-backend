import { registerEnumType } from '@nestjs/graphql';

export enum Currency {
    NIO = "NIO",
    USD = "USD",
    EUR = "EUR"
}


registerEnumType(Currency, { name: 'Currency', description: undefined })
