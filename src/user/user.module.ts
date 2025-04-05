import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { PrismaService } from 'nestjs-prisma';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [UserResolver, UserService, PrismaService],
  imports: [PrismaModule],
  exports: [UserService],
})
export class UserModule {}
