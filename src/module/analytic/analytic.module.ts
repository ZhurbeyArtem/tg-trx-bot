import { Module } from '@nestjs/common';
import { AnalyticService } from './analytic.service';

@Module({
  providers: [AnalyticService],
  exports: [AnalyticService],
})
export class AnalyticModule {}
