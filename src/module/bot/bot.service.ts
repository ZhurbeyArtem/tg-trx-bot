import { Injectable } from '@nestjs/common';

import {
  getContractRes,
  getTransactionRes,
  getWalletRes,
  getWalletTransfersRes,
} from './bot.util';
import { CoingeckoService } from '../coingecko/coingecko.service';
import { TronscanService } from '../tronscan/tronscan.service';
import { AnalyticService } from '../analytic/analytic.service';
import { inlineButton } from './bot.button';
import { IContract } from '../interfaces/contract.interface';
import { ITransfers } from '../interfaces/transaction.interface';
import { IWallet } from '../interfaces/wallet.interface';

@Injectable()
export class BotService {
  constructor(
    private readonly coingeckoService: CoingeckoService,
    private readonly tronscanService: TronscanService,
    private readonly analyticService: AnalyticService,
  ) {}
  detectTransaction(str: string): boolean {
    const tronTxRegex = /^(0x)?[a-fA-F0-9]{64}$/; // Регулярний вираз для хешу транзакції Tron
    return tronTxRegex.test(str);
  }

  getContract(contract: IContract): string {
    const functions: string[] = [];

    for (const val in contract.methodMap) {
      functions.push(`\n${contract.methodMap[val]}`);
    }

    return getContractRes(functions);
  }

  async getWallet(wallet: IWallet): Promise<string> {
    try {
      const tokenPrice = await this.coingeckoService.getTokenPrice('tron'); // ціна трона
      const tokens = wallet.withPriceTokens.map(
        ({ tokenAbbr, balance, tokenDecimal, tokenPriceInTrx }) => {
          const priceInUsd = (
            (Number(balance) / 10 ** tokenDecimal) *
            tokenPriceInTrx *
            tokenPrice.tron.usd
          ).toFixed(2);
          return `\n${(Number(balance) / 10 ** tokenDecimal).toFixed(tokenDecimal)} ${tokenAbbr} = ${Number(priceInUsd) < 0.01 ? '<0.01' : priceInUsd}$`;
        },
      );

      return getWalletRes(tokens);
    } catch (error) {
      console.log('here 2');
      throw error;
    }
  }

  async getWalletTransfers(address: string): Promise<ITransfers[]> {
    try {
      const transfers =
        await this.tronscanService.getWalletTransfersTrc20(address);
      return getWalletTransfersRes(transfers, address);
    } catch (error) {
      throw error;
    }
  }

  async getTransaction(transactionAddress: string): Promise<string> {
    try {
      const transaction =
        await this.tronscanService.getTransactionInfo(transactionAddress);
      const fromAddress = transaction.transfersAllList // Звідки відправлено
        ? transaction.transfersAllList[0].from_address
        : transaction.ownerAddress;

      const toAddress = transaction.transfersAllList // Куди відправлено
        ? transaction.transfersAllList[0].to_address
        : transaction.toAddress;

      const amountSent = transaction.contractData.amount // Скільки відправили
        ? transaction.contractData.amount / 10 ** 6
        : Number(transaction.tokenTransferInfo.amount_str) /
          10 ** transaction.tokenTransferInfo.decimals;

      const currency = transaction.tokenTransferInfo // Яка валюта
        ? transaction.tokenTransferInfo.name
        : 'Tron';
      let amountCurrency; // Курс токена до долара

      if (!currency.split(' ').includes('USD')) {
        const tokenPrice = await this.coingeckoService.getTokenPrice(currency);
        amountCurrency = tokenPrice;
      }

      const course = amountCurrency && amountCurrency[currency.toLowerCase()];
      const convertedToken = course ? course.usd * amountSent : amountSent;

      let trxValue = // комісія в тронах
        (transaction.cost.net_fee + transaction.cost.energy_fee) /
        transaction.cost.net_fee_cost /
        1000;

      if (trxValue < 0.11) {
        trxValue =
          transaction.cost.net_fee / 10 ** 6 +
          transaction.cost.net_fee_cost / 10 ** 3;
        if (transaction.cost.fee === 0) trxValue = 0;
      }

      const bandwidthValue = //  bandwidth комісія
        transaction.cost.net_fee / 10 ** 3 < 1
          ? transaction.cost.net_usage
          : transaction.cost.net_fee / 10 ** 3;

      const decimalIndex = trxValue.toString().indexOf('.');
      const decimalPlaces = trxValue.toString().length - decimalIndex - 1;

      const energyCost = transaction.cost.energy_usage_total.toString(); // Комісія енергії
      const timestamp = transaction.timestamp;
      const date = new Date(timestamp);
      const formattedDate = date.toLocaleDateString('uk-UA');
      const formattedTime = date.toLocaleTimeString('uk-UA');
      return getTransactionRes({
        fromAddress,
        toAddress,
        decimalPlaces,
        trxValue,
        energyCost,
        bandwidthValue,
        amountSent,
        currency,
        convertedToken,
        formattedDate,
        formattedTime,
      });
    } catch (error) {
      throw error.message;
    }
  }

  async sendResult(message, ctx): Promise<void> {
    try {
      let result: string,
        url: string,
        messageType: string,
        transfers: ITransfers[];
      await ctx.reply('Loading...');

      const userName = ctx.update['message'].from.username;

      const isTransaction = this.detectTransaction(message);

      const wallet = await this.tronscanService.detectWallet(message);

      const contract = await this.tronscanService.detectContract(message);

      if (typeof contract === 'object') {
        result = this.getContract(contract);
        url = `https://tronscan.org/#/contract/${message}`;
        messageType = 'contract';
      } else if (typeof wallet === 'object') {
        result = await this.getWallet(wallet);
        messageType = 'wallet';
        transfers = await this.getWalletTransfers(message);
      } else if (isTransaction) {
        result = await this.getTransaction(message);
        url = `https://tronscan.org/#/transaction/${message}`;
        messageType = 'transaction';
      } else {
        messageType = 'error';
        throw Error;
      }

      await this.analyticService.analyticPost(userName, message, messageType);

      const ctxButton =
        messageType === 'transaction' || messageType === 'contract'
          ? inlineButton('Link', url)
          : {};

      await ctx.deleteMessage(ctx.update['message'].message_id + 1);

      await ctx.reply(result, ctxButton);

      if (transfers) {
        await ctx.reply('There are last 4 transfers on your account');

        transfers.forEach(async (el) => {
          await ctx.reply(el.message, inlineButton('Link', el.url));
        });
      }
    } catch (error) {
      throw error;
    }
  }
}
