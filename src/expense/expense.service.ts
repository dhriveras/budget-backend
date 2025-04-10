import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { CreateExpenseInput } from './inputTypes/create-expense.input';
import { UpdateExpenseInput } from './inputTypes/update-expense.input';
import { ExpenseFilterInput } from './inputTypes/filters/expense-filter.input';
import { ErrorConsts } from 'src/common/consts/error.consts';
import { SortConsts } from 'src/common/consts/sort.consts';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class ExpenseService {
  constructor(
    @Inject('PrismaService')
    private readonly prismaService: PrismaClient,
    private readonly commonService: CommonService,
  ) {}

  async findOne(id: string, userId: string) {
    return this.prismaService.expense
      .findUniqueOrThrow({
        where: { id, createdBy: userId },
      })
      .catch(() => {
        throw new HttpException(
          ErrorConsts.EXPENSE_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      });
  }

  async findAll(userId: string, filter?: ExpenseFilterInput) {
    return this.prismaService.user
      .findUnique({
        where: { id: userId },
      })
      .expenses({
        orderBy: { date: SortConsts.DESC },
        where: {
          ...(filter && this.whereBasedOnFilter(filter)),
        },
      });
  }

  async create(data: CreateExpenseInput, userId: string) {
    // Validate category and account if provided
    if (data.categoryId)
      await this.commonService.validateCategory(data.categoryId, userId);
    if (data.accountId)
      await this.commonService.validateAccount(data.accountId, userId);

    return this.prismaService.expense.create({
      data: {
        ...data,

        createdBy: userId,
      },
    });
  }

  async update(id: string, data: UpdateExpenseInput, userId: string) {
    // Validate if the expense exists
    await this.findOne(id, userId);

    // Validate category and account if provided
    if (data.categoryId)
      await this.commonService.validateCategory(data.categoryId, userId);
    if (data.accountId)
      await this.commonService.validateAccount(data.accountId, userId);

    return this.prismaService.expense.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prismaService.expense.delete({
      where: { id },
    });
  }

  private whereBasedOnFilter(
    filter: ExpenseFilterInput,
  ): Prisma.ExpenseWhereInput {
    const where = {};

    if (filter?.categoryId) {
      where['categoryId'] = filter.categoryId;
    }

    if (filter?.accountId) {
      where['accountId'] = filter.accountId;
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
