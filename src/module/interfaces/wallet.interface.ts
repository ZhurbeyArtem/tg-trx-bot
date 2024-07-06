interface IWalletTokens {
  tokenPriceInTrx: number;
  balance: string;
  tokenDecimal: number;
  tokenAbbr: string;
}
export interface IWallet {
  withPriceTokens: IWalletTokens[];
}

export interface IWalletTransfers {
  block_ts: number;
  to_address: string;
  from_address: string;
  quant: string;
  transaction_id: string;
  tokenInfo: {
    tokenDecimal: number;
    tokenAbbr: string;
  };
}
