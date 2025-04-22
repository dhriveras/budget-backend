import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CreateCategoryInput } from './inputTypes/create-category.input';
import { UpdateCategoryInput } from './inputTypes/update-category.input';
import { SortConsts } from 'src/common/consts/sort.consts';
import { ErrorConsts } from 'src/common/consts/error.consts';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  findOne(id: string, userId: string) {
    return this.prismaService.client.category
      .findUniqueOrThrow({
        where: { id, createdBy: userId },
      })
      .catch(() => {
        throw new HttpException(
          ErrorConsts.CATEGORY_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      });
  }

  findAll(userId: string) {
    return this.prismaService.client.user
      .findUnique({
        where: { id: userId },
      })
      .categories({
        orderBy: { name: SortConsts.ASC },
      });
  }

  async create(data: CreateCategoryInput, userId: string) {
    await this.validateIfNameIsUnique(data.name, userId);

    return this.prismaService.client.category.create({
      data: {
        ...data,
        createdBy: userId,
      },
    });
  }

  async update(id: string, data: UpdateCategoryInput, userId: string) {
    const category = await this.findOne(id, userId);

    if (data.name && category.name !== data.name) {
      await this.validateIfNameIsUnique(data.name, userId);
    }

    return this.prismaService.client.category.update({
      where: { id: category.id },
      data,
    });
  }

  async delete(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prismaService.client.category.delete({
      where: { id },
    });
  }

  private async validateIfNameIsUnique(name: string, userId: string) {
    const isUnque =
      (await this.prismaService.client.category.count({
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
        ErrorConsts.CATEGORY_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
