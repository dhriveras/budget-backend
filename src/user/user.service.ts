import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserInput } from './inputTypes/create-user.input';
import { UpdateUserInput } from './inputTypes/update-user.input';
import * as argon2 from 'argon2';
import { ErrorConsts } from 'src/common/consts/error.consts';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  findOne(id: string) {
    return this.prismaService.client.user
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

  findByEmail(email: string) {
    return this.prismaService.client.user.findUnique({
      where: { email },
    });
  }

  findAll() {
    return this.prismaService.client.user.findMany();
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
    return this.prismaService.client.user.create({
      data: {
        ...rest,
        email,
        password: hashedPassword,
      },
    });
  }

  async update(id: string, data: UpdateUserInput) {
    await this.findOne(id);

    return this.prismaService.client.user.update({
      where: { id },
      data: { ...data },
    });
  }

  delete(id: string) {
    return this.prismaService.client.user.delete({
      where: { id },
    });
  }

  updateRefreshToken(id: string, refreshToken: string | null) {
    return this.prismaService.client.user.update({
      where: { id },
      data: { refreshToken },
    });
  }
}
