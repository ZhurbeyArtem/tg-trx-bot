import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { IContract } from '../interfaces/contract.interface';
import { ITransactionInfo } from '../interfaces/transaction.interface';
import { IWallet, IWalletTransfers } from '../interfaces/wallet.interface';

const TRONSCAN_API_BASE_URL = 'https://apilist.tronscanapi.com/api';

@Injectable()
export class TronscanService {
  async detectWallet(str: string): Promise<boolean | IWallet> {
    try {
      const { data: wallet } = await axios.get(
        `${TRONSCAN_API_BASE_URL}/accountv2?address=${str}`,
      );

      return wallet.message ? false : wallet;
    } catch (error) {
      throw error;
    }
  }

  async detectContract(str: string): Promise<boolean | IContract> {
    try {
      const { data: contract } = await axios.get(
        `${TRONSCAN_API_BASE_URL}/contract?contract=${str}`,
      );

      return contract.data[0].address === '' ? false : contract.data[0];
    } catch (error) {
      throw error;
    }
  }

  async getWalletTransfersTrc20(address: string): Promise<IWalletTransfers[]> {
    try {
      const { data: transfers } = await axios.get(
        `${TRONSCAN_API_BASE_URL}/filter/trc20/transfers?limit=4&start=0&sort=-timestamp&count=true&filterTokenValue=0&relatedAddress=${address}`,
      );
      return transfers.token_transfers;
    } catch (error) {
      throw error;
    }
  }

  async getTransactionInfo(
    transactionAddress: string,
  ): Promise<ITransactionInfo> {
    try {
      const { data: transaction } = await axios(
        `${TRONSCAN_API_BASE_URL}/transaction-info?hash=${transactionAddress}`,
      );
      return transaction;
    } catch (error) {
      throw error;
    }
  }
}
