import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountResolver } from './account.resolver';
import { PrismaService } from 'nestjs-prisma';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [AccountResolver, AccountService, PrismaService],
  imports: [PrismaModule],
  exports: [AccountService],
})
export class AccountModule {}
