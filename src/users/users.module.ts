import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { PrismaService } from 'nestjs-prisma';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [UsersResolver, UsersService, PrismaService],
  imports: [PrismaModule],
  exports: [UsersService],
})
export class UsersModule {}
