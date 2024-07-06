export interface ITransactionInfo {
  transfersAllList: {
    from_address: string;
    to_address: string;
  };
  ownerAddress: string;
  toAddress: string;
  contractData: {
    amount: number;
  };
  tokenTransferInfo: {
    amount_str: string;
    decimals: number;
    name: string;
  };
  cost: {
    net_fee: number;
    energy_fee: number;
    net_fee_cost: number;
    fee: number;
    net_usage: number;
    energy_usage_total: number;
  };
  timestamp: number;
}
export interface ITransfers {
  message: string;
  url: string;
}
