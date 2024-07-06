import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AnalyticService {
  async analyticPost(
    userName: string,
    message: string,
    messageType: string,
  ): Promise<void> {
    try {
      await axios.post(
        'https://api2.amplitude.com/2/httpapi',
        {
          api_key: process.env.AMPLITUDE_API_KEY,
          events: [
            {
              user_id: `${userName}`,
              event_type: 'message',
              event_properties: {
                userName,
                message,
                messageType,
              },
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
          },
        },
      );
    } catch (error) {
      throw error;
    }
  }
}
