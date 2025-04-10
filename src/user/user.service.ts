import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserInput } from './inputTypes/create-user.input';
import { UpdateUserInput } from './inputTypes/update-user.input';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import { ErrorConsts } from 'src/common/consts/error.consts';

@Injectable()
export class UserService {
  constructor(
    @Inject('PrismaService')
    private prismaService: PrismaClient,
  ) {}

  async findOne(id: string) {
    return this.prismaService.user
      .findUniqueOrThrow({
        where: { id },
      })
      .catch(() => {
        throw new HttpException(
          ErrorConsts.USER_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
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
      throw new HttpException(
        ErrorConsts.USER_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
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

  async delete(id: string) {
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
