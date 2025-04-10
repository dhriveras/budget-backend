import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateAccountInput } from './inputTypes/create-account.input';
import { SortConsts } from 'src/common/consts/sort.consts';
import { ErrorConsts } from 'src/common/consts/error.consts';

@Injectable()
export class AccountService {
  constructor(@Inject() private readonly prismaService: PrismaService) {}

  async findOne(id: string, userId: string) {
    return this.prismaService.account
      .findUniqueOrThrow({
        where: { id, createdBy: userId },
      })
      .catch(() => {
        throw new HttpException(
          ErrorConsts.ACCOUNT_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      });
  }

  findAll(userId: string) {
    return this.prismaService.user
      .findUnique({
        where: { id: userId },
      })
      .accounts({
        orderBy: { name: SortConsts.ASC },
      });
  }

  async create(data: CreateAccountInput, userId: string) {
    await this.validateIfNameIsUnique(data.name, userId);

    return this.prismaService.account.create({
      data: {
        ...data,
        createdBy: userId,
      },
    });
  }

  async update(id: string, data: any, userId: string) {
    const account = await this.findOne(id, userId);

    if (data.name && account.name !== data.name) {
      await this.validateIfNameIsUnique(data.name, userId);
    }

    return this.prismaService.account.update({
      where: { id: account.id },
      data,
    });
  }

  async delete(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prismaService.account.delete({
      where: { id },
    });
  }

  private async validateIfNameIsUnique(name: string, userId: string) {
    const isUnque =
      (await this.prismaService.account.count({
        where: {
          name: {
            equals: name,
            mode: 'insensitive',
          },
          createdBy: userId,
        },
      })) === 0;

    if (!isUnque) {
      throw new HttpException(
        ErrorConsts.ACCOUNT_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getBalance(id: string, userId: string) {
    const { initialBalance } = await this.findOne(id, userId);

    const { expenses = [], incomes = [] } =
      (await this.prismaService.account.findUnique({
        where: { id, createdBy: userId },
        include: { incomes: true, expenses: true },
      })) ?? { expenses: [], incomes: [] };

    const totalIncomes = incomes.reduce(
      (acc, income) => acc + income.amount,
      0,
    );
    const totalExpenses = expenses.reduce(
      (acc, expense) => acc + expense.amount,
      0,
    );

    return initialBalance + (totalIncomes - totalExpenses);
  }
}
