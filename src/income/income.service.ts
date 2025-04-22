import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateIncomeInput } from './inputTypes/create-income.input';
import { UpdateIncomeInput } from './inputTypes/update-income.input';
import { IncomeFilterInput } from './inputTypes/filters/income-filter.input';
import { SortConsts } from 'src/common/consts/sort.consts';
import { ErrorConsts } from 'src/common/consts/error.consts';
import { CommonService } from 'src/common/common.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class IncomeService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly commonService: CommonService,
  ) {}

  findOne(id: string, userId: string) {
    return this.prismaService.client.income
      .findUniqueOrThrow({
        where: { id, createdBy: userId },
      })
      .catch(() => {
        throw new HttpException(
          ErrorConsts.INCOME_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      });
  }

  findAll(userId: string, filter?: IncomeFilterInput) {
    return this.prismaService.client.user
      .findUnique({
        where: { id: userId },
      })
      .incomes({
        orderBy: { date: SortConsts.DESC },
        where: {
          ...(filter && this.whereBasedOnFilter(filter)),
        },
      });
  }

  async create(data: CreateIncomeInput, userId: string) {
    // Validate account if provided
    if (data.accountId)
      await this.commonService.validateAccount(data.accountId, userId);

    return this.prismaService.client.income.create({
      data: {
        ...data,
        createdBy: userId,
      },
    });
  }

  async update(id: string, data: UpdateIncomeInput, userId: string) {
    await this.findOne(id, userId);

    // Validate account if provided
    if (data.accountId)
      await this.commonService.validateAccount(data.accountId, userId);

    return this.prismaService.client.income.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prismaService.client.income.delete({
      where: { id },
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
