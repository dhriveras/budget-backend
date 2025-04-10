import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateCategoryInput } from './inputTypes/create-category.input';
import { UpdateCategoryInput } from './inputTypes/update-category.input';
import { SortConsts } from 'src/common/consts/sort.consts';
import { ErrorConsts } from 'src/common/consts/error.consts';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('PrismaService')
    private prismaService: PrismaClient,
  ) {}

  async findOne(id: string, userId: string) {
    return this.prismaService.category
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
    return this.prismaService.user
      .findUnique({
        where: { id: userId },
      })
      .categories({
        orderBy: { name: SortConsts.ASC },
      });
  }

  async create(data: CreateCategoryInput, userId: string) {
    await this.validateIfNameIsUnique(data.name, userId);

    return this.prismaService.category.create({
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

    return this.prismaService.category.update({
      where: { id: category.id },
      data,
    });
  }

  async delete(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prismaService.category.delete({
      where: { id },
    });
  }

  private async validateIfNameIsUnique(name: string, userId: string) {
    const isUnque =
      (await this.prismaService.category.count({
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
