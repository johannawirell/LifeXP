import { Controller, Delete, Get, Param } from '@nestjs/common';
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
        axios.get(`${goalsServiceUrl}/goals/${userId}`),
        axios.get(`${analyticsServiceUrl}/profile-stats/${userId}`),
        axios.get(`${gamificationServiceUrl}/profile-gamification/${userId}`),
      ]);

    return {
      ...profileResponse.data,
      ...gamificationResponse.data,
      activeGoals: goalsResponse.data.activeGoals,
      dailyQuests: goalsResponse.data.dailyQuests,
      weeklyQuests: goalsResponse.data.weeklyQuests,
      goalsOverview: goalsResponse.data.overview,
      weeklyStats: statsResponse.data.weeklyCards,
      statisticsSummary: statsResponse.data.liveSummary,
      categoryProgress: statsResponse.data.categoryProgress,
    };
  }

  @Delete(':userId')
  async deleteAccount(@Param('userId') userId: string) {
    const userServiceUrl = process.env.USER_SERVICE_URL ?? 'http://localhost:3001';
    const goalsServiceUrl = process.env.GOALS_SERVICE_URL ?? 'http://localhost:3002';
    const analyticsServiceUrl = process.env.ANALYTICS_SERVICE_URL ?? 'http://localhost:3003';
    const gamificationServiceUrl = process.env.GAMIFICATION_SERVICE_URL ?? 'http://localhost:3004';
    const authServiceUrl = process.env.AUTH_SERVICE_URL ?? 'http://localhost:3005';

    await Promise.all([
      axios.delete(`${userServiceUrl}/profile/${userId}`),
      axios.delete(`${goalsServiceUrl}/goals/user-data/${userId}`),
      axios.delete(`${analyticsServiceUrl}/profile-stats/${userId}`),
      axios.delete(`${gamificationServiceUrl}/profile-gamification/${userId}`),
      axios.delete(`${authServiceUrl}/auth/users/${userId}`),
    ]);

    return { success: true };
  }
}
