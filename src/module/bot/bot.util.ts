import { ITransfers } from '../interfaces/transaction.interface';
import { IWalletTransfers } from '../interfaces/wallet.interface';

export const getContractRes = (functions: string[]): string => {
  return `
    It's smart contract. Here are some details:
    ${functions}`;
};

export const getWalletRes = (tokens: string[]): string => {
  return `
      It's wallet. Here are some details:
      ${tokens}
      `;
};
export const getWalletTransfersRes = (
  transfers: IWalletTransfers[],
  address: string,
): ITransfers[] => {
  return transfers
    .sort((a, b) => a.block_ts + b.block_ts)
    .map((el) => {
      const timestamp = el.block_ts;
      const date = new Date(timestamp);
      const formattedDate = date.toLocaleDateString('uk-UA');
      const formattedTime = date.toLocaleTimeString('uk-UA');
      return {
        message: `
            token ${el.to_address === address ? 'in' : 'out'}\n
from: ${el.from_address === address ? address : el.from_address}
to: ${el.to_address === address ? address : el.to_address}
token: ${Number(el.quant) / 10 ** el.tokenInfo.tokenDecimal} ${el.tokenInfo.tokenAbbr}
Date: ${formattedDate} Time: ${formattedTime}
            `,
        url: `https://tronscan.org/#/transaction/${el.transaction_id}`,
      };
    });
};

export const getTransactionRes = ({
  fromAddress,
  toAddress,
  decimalPlaces,
  trxValue,
  energyCost,
  bandwidthValue,
  amountSent,
  currency,
  convertedToken,
  formattedTime,
  formattedDate,
}): string => {
  return `It's a transaction. Here are some details:\n
From address: ${fromAddress}
To address: ${toAddress}
Transaction cost: ${decimalPlaces > 3 ? parseFloat(trxValue.toFixed(4)) : trxValue} TRX
Energy cost: ${energyCost.length > 1 ? energyCost.slice(0, 2) + ',' + energyCost.slice(2) : energyCost}
Bandwidth usage: ${bandwidthValue}
Was sended: ${amountSent} ${currency} ~ ${convertedToken}$
Date: ${formattedDate} Time: ${formattedTime}
`;
};
