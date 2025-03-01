import { Inject, Injectable } from '@nestjs/common';
import { CreateUserInput } from './inputTypes/create-user.input';
import { UpdateUserInput } from './inputTypes/update-user.input';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    @Inject('PrismaService')
    private prismaService: PrismaClient,
  ) {}

  findOne(id: string) {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  async create(data: CreateUserInput) {
    console.log('🚀 ~ UsersService ~ create ~ data:', data);
    const user = await this.prismaService.user.create({
      data: {
        ...data,
      },
    });
    return user;
  }

  update(id: string, data: UpdateUserInput) {
    return this.prismaService.user.update({
      where: { id },
      data: { ...data },
    });
  }

  remove(id: string) {
    return this.prismaService.user.delete({
      where: { id },
    });
  }
}
