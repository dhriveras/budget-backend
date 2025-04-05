import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateExpenseInput } from './inputTypes/create-expense.input';
import { UpdateExpenseInput } from './inputTypes/update-expense.input';

@Injectable()
export class ExpenseService {
  constructor(
    @Inject('PrismaService')
    private prismaService: PrismaClient,
  ) {}

  async findOne(id: string, userId: string) {
    const expense = await this.prismaService.expense.findUnique({
      where: { id, userId },
    });

    if (!expense) {
      throw new Error('Expense not found');
    }

    return expense;
  }

  async findAll(userId: string) {
    return this.prismaService.user
      .findUnique({
        where: { id: userId },
      })
      .expenses({
        orderBy: { date: 'desc' },
      });
  }

  async create(data: CreateExpenseInput, userId: string) {
    return this.prismaService.expense.create({
      data: {
        ...data,
        userId,
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
}
