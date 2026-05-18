import { Controller, Get, Param } from '@nestjs/common';
import axios from 'axios';

@Controller('statistics')
export class StatisticsController {
  @Get(':userId')
  async getStatistics(@Param('userId') userId: string) {
    const analyticsServiceUrl = process.env.ANALYTICS_SERVICE_URL ?? 'http://localhost:3003';
    const response = await axios.get(`${analyticsServiceUrl}/profile-stats/${userId}`);

    return response.data;
  }
}
