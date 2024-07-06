## Description
Our Telegram bot simplifies access to essential information about cryptocurrency wallets and transactions. Easily check your wallet balance, view the latest transfers, and gather insights into transaction details or smart contract statuses using their respective hashes.

Main Features:

- Wallet Information: Get real-time updates on your wallet's balance and the latest four transactions.
- Transaction Lookup: Enter a transaction hash to retrieve comprehensive information about the transaction.
- Smart Contract Insights: Check the status and detailed information of smart contracts using their hash.

Advanced Analytics:
Additionally, our bot collects messaging analytics, providing you with valuable insights into user interactions. You can review this analytics data at this [link](https://app.amplitude.com/analytics/share/a74ca92e41354d47beab3efd0e32fec5)

Experience the convenience of monitoring your cryptocurrency activity and accessing critical information directly within Telegram!

## Technologies

nest js  
telegraf  - [link](https://www.npmjs.com/package/telegraf)  
axios  

all data takes from  [Tronscan](https://docs.tronscan.org/getting-started/api-keys?_gl=1*zm6w1k*_ga*MjU3ODU0NjUuMTcxNTUyNjQ5Mg..*_ga_TBLE5BZDE8*MTcxNTg2NjcxNy4yMC4wLjE3MTU4NjY3MTcuNjAuMC4w )  
prices for token in usd take from  [Coingecko](https://docs.coingecko.com/reference/introduction)  
analytics documentation [Link](https://www.docs.developers.amplitude.com/documentation-home/)
## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

```

## DEMO
[Telegram bot](https://t.me/mega_tron_scan_bot)

