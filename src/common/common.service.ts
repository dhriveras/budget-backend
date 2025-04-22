import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ErrorConsts } from 'src/common/consts/error.consts';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommonService {
  constructor(private readonly prismaService: PrismaService) {}

  validateCategory(categoryId: string, userId: string) {
    return this.prismaService.client.category
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

  validateAccount(accountId: string, userId: string) {
    return this.prismaService.client.account
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
