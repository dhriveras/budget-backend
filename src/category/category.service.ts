import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateCategoryInput } from './inputTypes/create-category.input';
import { UpdateCategoryInput } from './inputTypes/update-category.input';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('PrismaService')
    private prismaService: PrismaClient,
  ) {}

  async findOne(id: string, userId: string) {
    const category = await this.prismaService.category.findUnique({
      where: { id, createdBy: userId },
    });

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  }

  findAll(userId: string) {
    return this.prismaService.user
      .findUnique({
        where: { id: userId },
      })
      .categories({
        orderBy: { name: 'asc' },
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

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prismaService.category.delete({
      where: { id },
    });
  }

  private async validateIfNameIsUnique(name: string, userId: string) {
    const isUnque =
      (await this.prismaService.category.count({
        where: {
          name,
          createdBy: userId,
        },
      })) === 0;

    if (!isUnque) {
      throw new Error('Category name must be unique');
    }
  }
}
