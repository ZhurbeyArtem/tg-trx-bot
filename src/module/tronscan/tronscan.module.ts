import { Module } from '@nestjs/common';
import { TronscanService } from './tronscan.service';

@Module({
  providers: [TronscanService],
  exports: [TronscanService],
})
export class TronscanModule {}
