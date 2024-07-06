import {
  InjectBot,
  Message,
  Context as context,
  On,
  Start,
  Update,
} from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { BotService } from './bot.service';

@Update()
export class BotUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly botService: BotService,
  ) {}

  @Start()
  async seyHello(ctx: Context) {
    await ctx.reply(
      'Hello it`s telegram bot for analytic your crypto wallet ☺️',
    );
  }

  @On('text')
  async detecting(@Message('text') message: string, @context() ctx: Context) {
    try {
      await this.botService.sendResult(message, ctx);
    } catch (error) {
      console.log(error);
      await ctx.replyWithHTML(
        '<b>Error. Try input correct data or other data</b>',
      );
    }
  }
}
