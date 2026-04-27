import { Controller, Get, Param } from '@nestjs/common';
import axios from 'axios';

@Controller('profile')
export class ProfileController {
  @Get(':userId')
  async getProfile(@Param('userId') userId: string) {
    const userServiceUrl = process.env.USER_SERVICE_URL ?? 'http://localhost:3001';
    const goalsServiceUrl = process.env.GOALS_SERVICE_URL ?? 'http://localhost:3002';
    const analyticsServiceUrl = process.env.ANALYTICS_SERVICE_URL ?? 'http://localhost:3003';
    const gamificationServiceUrl = process.env.GAMIFICATION_SERVICE_URL ?? 'http://localhost:3004';

    const [profileResponse, goalsResponse, statsResponse, gamificationResponse] =
      await Promise.all([
        axios.get(`${userServiceUrl}/profile/${userId}`),
        axios.get(`${goalsServiceUrl}/profile-goals/${userId}`),
        axios.get(`${analyticsServiceUrl}/profile-stats/${userId}`),
        axios.get(`${gamificationServiceUrl}/profile-gamification/${userId}`),
      ]);

    return {
      ...profileResponse.data,
      ...gamificationResponse.data,
      activeGoals: goalsResponse.data,
      weeklyStats: statsResponse.data,
    };
  }
}
