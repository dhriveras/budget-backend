import { Inject, Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { CreateExpenseInput } from './inputTypes/create-expense.input';
import { UpdateExpenseInput } from './inputTypes/update-expense.input';
import { ExpenseFilterInput } from './inputTypes/filters/expense-filter.input';

@Injectable()
export class ExpenseService {
  constructor(
    @Inject('PrismaService')
    private prismaService: PrismaClient,
  ) {}

  async findOne(id: string, userId: string) {
    const expense = await this.prismaService.expense.findUnique({
      where: { id, createdBy: userId },
    });

    if (!expense) {
      throw new Error('Expense not found');
    }

    return expense;
  }

  async findAll(userId: string, filter?: ExpenseFilterInput) {
    return this.prismaService.user
      .findUnique({
        where: { id: userId },
      })
      .expenses({
        orderBy: { date: 'desc' },
        where: {
          ...(filter && this.whereBasedOnFilter(filter)),
        },
      });
  }

  async create(data: CreateExpenseInput, userId: string) {
    return this.prismaService.expense.create({
      data: {
        ...data,
        createdBy: userId,
      },
    });
  }

  async update(id: string, data: UpdateExpenseInput, userId: string) {
    const expense = await this.findOne(id, userId);

    return this.prismaService.expense.update({
      where: { id: expense.id },
      data,
    });
  }

  async remove(id: string, userId: string) {
    const expense = await this.findOne(id, userId);

    return this.prismaService.expense.delete({
      where: { id: expense.id },
    });
  }

  private whereBasedOnFilter(
    filter: ExpenseFilterInput,
  ): Prisma.ExpenseWhereInput {
    const where = {};

    if (filter?.categoryId) {
      where['categoryId'] = filter.categoryId;
    }

    if (filter?.dateFrom || filter?.dateTo) {
      where['date'] = {
        ...(filter.dateTo && { lte: new Date(filter.dateTo) }),
        ...(filter.dateFrom && { gte: new Date(filter.dateFrom) }),
      };
    }

    if (filter?.minAmount || filter?.maxAmount) {
      where['amount'] = {
        ...(filter.minAmount && { gte: filter.minAmount }),
        ...(filter.maxAmount && { lte: filter.maxAmount }),
      };
    }

    return where;
  }
}
