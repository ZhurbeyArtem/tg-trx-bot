import { Module } from '@nestjs/common';
import { BotModule } from './module/bot/bot.module';
import { AnalyticModule } from './module/analytic/analytic.module';

import { TronscanModule } from './module/tronscan/tronscan.module';
import { CoingeckoModule } from './module/coingecko/coingecko.module';

@Module({
  imports: [BotModule, AnalyticModule, TronscanModule, CoingeckoModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
