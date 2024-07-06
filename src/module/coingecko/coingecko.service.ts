import { Injectable } from '@nestjs/common';
import axios from 'axios';

const COINGECKO_API_BASE_URL = 'https://api.coingecko.com/api/v3';

@Injectable()
export class CoingeckoService {
  async getTokenPrice(name: string) {
    try {
      const { data } = await axios(
        `${COINGECKO_API_BASE_URL}/simple/price?ids=${name.toLowerCase()}&vs_currencies=usd`,
      );
      return data;
    } catch (error) {
      throw error;
    }
  }
}
