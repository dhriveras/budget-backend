import { Global, Module } from '@nestjs/common';
import { CommonResolver } from './common.resolver';
import { CommonService } from './common.service';

@Global()
@Module({
  providers: [CommonResolver, CommonService],
  imports: [],
  exports: [CommonService],
})
export class CommonModule {}
