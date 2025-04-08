import { Inject, Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { CreateIncomeInput } from './inputTypes/create-income.input';
import { UpdateIncomeInput } from './inputTypes/update-income.input';
import { IncomeFilterInput } from './inputTypes/filters/income-filter.input';

@Injectable()
export class IncomeService {
  constructor(
    @Inject('PrismaService')
    private prismaService: PrismaClient,
  ) {}

  async findOne(id: string, userId: string) {
    const income = await this.prismaService.income.findUnique({
      where: { id, createdBy: userId },
    });

    if (!income) {
      throw new Error('Income not found');
    }

    return income;
  }

  async findAll(userId: string, filter?: IncomeFilterInput) {
    return this.prismaService.user
      .findUnique({
        where: { id: userId },
      })
      .incomes({
        orderBy: { date: 'desc' },
        where: {
          ...(filter && this.whereBasedOnFilter(filter)),
        },
      });
  }

  async create(data: CreateIncomeInput, userId: string) {
    return this.prismaService.income.create({
      data: {
        ...data,
        createdBy: userId,
      },
    });
  }

  async update(id: string, data: UpdateIncomeInput, userId: string) {
    const income = await this.findOne(id, userId);

    return this.prismaService.income.update({
      where: { id: income.id },
      data,
    });
  }

  async remove(id: string, userId: string) {
    const income = await this.findOne(id, userId);

    return this.prismaService.income.delete({
      where: { id: income.id },
    });
  }

  private whereBasedOnFilter(
    filter: IncomeFilterInput,
  ): Prisma.IncomeWhereInput {
    const where = {};

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
