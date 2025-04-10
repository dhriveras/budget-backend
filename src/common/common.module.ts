import { Module } from '@nestjs/common';
import { CommonResolver } from './common.resolver';
import { CommonService } from './common.service';
import { PrismaService } from 'nestjs-prisma';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [CommonResolver, CommonService, PrismaService],
  imports: [PrismaModule],
  exports: [CommonService],
})
export class CommonModule {}
