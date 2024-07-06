import { Module } from '@nestjs/common';
import { BotUpdate } from './bot.update';
import { BotService } from './bot.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { AnalyticModule } from '../analytic/analytic.module';
import * as dotenv from 'dotenv';
import { CoingeckoModule } from '../coingecko/coingecko.module';
import { TronscanModule } from '../tronscan/tronscan.module';
dotenv.config();
@Module({
  imports: [
    TelegrafModule.forRoot({
      token: process.env.TG_TOKEN,
    }),
    AnalyticModule,
    CoingeckoModule,
    TronscanModule,
  ],
  controllers: [],
  providers: [BotService, BotUpdate],
})
export class BotModule {}
