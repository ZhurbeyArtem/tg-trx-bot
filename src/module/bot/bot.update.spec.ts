import { BotUpdate } from './bot.update';
import { BotService } from './bot.service';
import { ApiService } from '../analytic/analytic.service';
import { Context, Telegraf } from 'telegraf';

describe('BotUpdate', () => {
  let botUpdate: BotUpdate;
  let botService: BotService;
  let apiService: ApiService;
  let bot: Telegraf<any>;

  beforeEach(() => {
    botService = new BotService();
    botUpdate = new BotUpdate(bot, botService, apiService);
    apiService = new ApiService();
  });

  describe('seyHello', () => {
    it('should reply with a welcome message', async () => {
      const ctx = {
        reply: jest.fn(),
      } as unknown as Context;

      await botUpdate.seyHello(ctx);

      expect(ctx.reply).toHaveBeenCalledWith(
        'Hello it`s telegram bot for analytic your crypto wallet ☺️',
      );
    });
  });

  describe('on message', () => {
    it('should reply with an error message', async () => {
      const ctx = {
        update: {
          message: {
            from: { username: 'testuser' },
            text: 'invalid_message',
          },
        },
        reply: jest.fn(),
        replyWithHTML: jest.fn(),
        deleteMessage: jest.fn(),
      } as unknown as Context;

      apiService.analyticPost = jest.fn().mockResolvedValue(true);
      botService.detectContract = jest.fn().mockResolvedValue(false);
      botService.detectWallet = jest.fn().mockResolvedValue(false);
      botService.detectTransaction = jest.fn().mockReturnValue(false);

      await botUpdate.detecting(ctx.update['message'].text, ctx);

      expect(ctx.reply).toHaveBeenCalledWith('Loading...');
      expect(ctx.replyWithHTML).toHaveBeenCalledWith(
        '<b>Error. Try input correct data or other data</b>',
      );
    });

    it('should reply with transaction details', async () => {
      const ctx = {
        update: {
          message: {
            from: { username: 'testuser' },
            text: 'd00d05dbb0dd0c24b60635503934a4defc04d924061d8088eab11bb34acd8348',
          },
        },
        reply: jest.fn(),
        deleteMessage: jest.fn(),
      } as unknown as Context;
      apiService.analyticPost = jest.fn().mockResolvedValue(true);

      botService.detectTransaction = jest.fn().mockReturnValue(true);
      botService.getTransaction = jest
        .fn()
        .mockResolvedValue('Transaction details');

      await botUpdate.detecting(ctx.update['message'].text, ctx);

      expect(botService.detectTransaction).toHaveBeenCalledWith(
        ctx.update['message'].text,
      );
      expect(botService.getTransaction).toHaveBeenCalledWith(
        ctx.update['message'].text,
      );
      expect(ctx.reply).toHaveBeenCalledWith('Loading...');
      expect(ctx.reply).toHaveBeenCalledWith(
        'Transaction details',
        expect.anything(),
      );
    });

    it('should reply with wallet details and transfers', async () => {
      const ctx = {
        update: {
          message: {
            from: { username: 'testuser' },
            text: 'TFKSWmnRJkzCfWUr56DQ1zqGCxZLW9dKSv',
          },
        },
        reply: jest.fn(),
        deleteMessage: jest.fn(),
      } as unknown as Context;
      const transfers = [
        { message: 'Transfer 1', url: 'url1' },
        { message: 'Transfer 2', url: 'url2' },
      ];

      botService.detectWallet = jest
        .fn()
        .mockResolvedValue(ctx.update['message'].text);
      botService.getWallet = jest.fn().mockResolvedValue('Wallet details');
      botService.getWalletTransfers = jest.fn().mockResolvedValue(transfers);
      apiService.analyticPost = jest.fn().mockResolvedValue(true);

      await botUpdate.detecting(ctx.update['message'].text, ctx);

      expect(botService.detectWallet).toHaveBeenCalledWith(
        ctx.update['message'].text,
      );
      expect(botService.getWallet).toHaveBeenCalledWith(
        ctx.update['message'].text,
      );
      expect(botService.getWalletTransfers).toHaveBeenCalledWith(
        ctx.update['message'].text,
      );
      expect(ctx.reply).toHaveBeenCalledWith('Loading...');
      expect(ctx.reply).toHaveBeenCalledWith(
        'Wallet details',
        expect.anything(),
      );
      expect(ctx.reply).toHaveBeenCalledWith(
        'There are last 4 transfers on your account',
      );
      transfers.forEach((transfer) => {
        expect(ctx.reply).toHaveBeenCalledWith(
          transfer.message,
          expect.anything(),
        );
      });
    });
  });
});
