import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ErrorConsts } from 'src/common/consts/error.consts';

@Injectable()
export class CommonService {
  constructor(
    @Inject('PrismaService')
    private readonly prismaService: PrismaClient,
  ) {}

  async validateCategory(categoryId: string, userId: string) {
    return this.prismaService.category
      .findFirstOrThrow({
        where: { id: categoryId, createdBy: userId },
      })
      .catch(() => {
        throw new HttpException(
          ErrorConsts.CATEGORY_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      });
  }

  async validateAccount(accountId: string, userId: string) {
    return this.prismaService.account
      .findFirstOrThrow({
        where: { id: accountId, createdBy: userId },
      })
      .catch(() => {
        throw new HttpException(
          ErrorConsts.ACCOUNT_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      });
  }
}
