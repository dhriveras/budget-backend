import { Inject, Injectable } from '@nestjs/common';
import { CreateUserInput } from './inputTypes/create-user.input';
import { UpdateUserInput } from './inputTypes/update-user.input';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(
    @Inject('PrismaService')
    private prismaService: PrismaClient,
  ) {}

  async findOne(id: string) {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }

  async findAll() {
    return this.prismaService.user.findMany();
  }

  async create(data: CreateUserInput) {
    const { email, password, ...rest } = data;

    // Check if email is already taken
    const isEmailTaken = !!(await this.findByEmail(email));
    if (isEmailTaken) {
      throw new Error('This email is already taken');
    }

    // Hash the password
    const hashedPassword = await argon2.hash(password);

    // Store the user in the database
    return this.prismaService.user.create({
      data: {
        ...rest,
        email,
        password: hashedPassword,
      },
    });
  }

  async update(id: string, data: UpdateUserInput) {
    await this.findOne(id);

    return this.prismaService.user.update({
      where: { id },
      data: { ...data },
    });
  }

  async remove(id: string) {
    return this.prismaService.user.delete({
      where: { id },
    });
  }

  async updateRefreshToken(id: string, refreshToken: string | null) {
    return this.prismaService.user.update({
      where: { id },
      data: { refreshToken },
    });
  }
}
