import { Body, Controller, Delete, Get, NotFoundException, Param, Post } from '@nestjs/common';
import axios from 'axios';

@Controller('profile')
export class ProfileController {
  private readonly emptyGoalsResponse = {
    activeGoals: [],
    dailyQuests: [],
    weeklyQuests: [],
    overview: {
      activeGoals: 0,
      averageProgress: '0 %',
      completedMilestones: 0,
      currentStreak: 0,
      totalQuestXp: 0,
    },
  };

  private readonly emptyStatsResponse = {
    weeklyCards: [],
    liveSummary: {
      totalXp: 0,
      level: 1,
      xpToNextLevel: 100,
      completedQuests: 0,
      completedGoals: 0,
      currentStreak: 0,
    },
    categoryProgress: [],
  };

  private readonly emptyGamificationResponse = {
    currentLevel: 1,
    totalXp: 0,
    nextLevelXp: 100,
    xpToNextLevel: 100,
    levelProgress: 0,
    currentStreak: 0,
    bestStreak: 0,
    headline: null,
    currentLevelReward: null,
    focusAreas: [],
    achievements: [],
    recentXp: [],
  };

  private isIgnorableDeleteError(error: unknown) {
    if (!axios.isAxiosError(error)) {
      return false;
    }

    return error.response?.status === 404;
  }

  private async safeGet<T>(request: Promise<{ data: T }>, fallback: T) {
    try {
      const response = await request;
      return response.data;
    } catch {
      return fallback;
    }
  }

  @Get(':userId')
  async getProfile(@Param('userId') userId: string) {
    const userServiceUrl = process.env.USER_SERVICE_URL ?? 'http://localhost:3001';
    const goalsServiceUrl = process.env.GOALS_SERVICE_URL ?? 'http://localhost:3002';
    const analyticsServiceUrl = process.env.ANALYTICS_SERVICE_URL ?? 'http://localhost:3003';
    const gamificationServiceUrl = process.env.GAMIFICATION_SERVICE_URL ?? 'http://localhost:3004';

    let profileResponse: { data: Record<string, unknown> };

    try {
      profileResponse = await axios.get(`${userServiceUrl}/profile/${userId}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new NotFoundException('No user profile found');
      }

      throw error;
    }
    const [goalsResponse, statsResponse, gamificationResponse] = await Promise.all([
      this.safeGet(
        axios.get(`${goalsServiceUrl}/goals/${userId}`),
        this.emptyGoalsResponse
      ),
      this.safeGet(
        axios.get(`${analyticsServiceUrl}/profile-stats/${userId}`),
        this.emptyStatsResponse
      ),
      this.safeGet(
        axios.get(`${gamificationServiceUrl}/profile-gamification/${userId}`),
        this.emptyGamificationResponse
      ),
    ]);

    return {
      ...profileResponse.data,
      ...gamificationResponse,
      activeGoals: goalsResponse.activeGoals,
      dailyQuests: goalsResponse.dailyQuests,
      weeklyQuests: goalsResponse.weeklyQuests,
      goalsOverview: goalsResponse.overview,
      weeklyStats: statsResponse.weeklyCards,
      statisticsSummary: statsResponse.liveSummary,
      categoryProgress: statsResponse.categoryProgress,
    };
  }

  @Delete(':userId')
  async deleteAccount(@Param('userId') userId: string) {
    const userServiceUrl = process.env.USER_SERVICE_URL ?? 'http://localhost:3001';
    const goalsServiceUrl = process.env.GOALS_SERVICE_URL ?? 'http://localhost:3002';
    const analyticsServiceUrl = process.env.ANALYTICS_SERVICE_URL ?? 'http://localhost:3003';
    const gamificationServiceUrl = process.env.GAMIFICATION_SERVICE_URL ?? 'http://localhost:3004';
    const authServiceUrl = process.env.AUTH_SERVICE_URL ?? 'http://localhost:3005';

    const deletionResults = await Promise.allSettled([
      axios.delete(`${userServiceUrl}/profile/${userId}`),
      axios.delete(`${goalsServiceUrl}/goals/user-data/${userId}`),
      axios.delete(`${analyticsServiceUrl}/profile-stats/${userId}`),
      axios.delete(`${gamificationServiceUrl}/profile-gamification/${userId}`),
      axios.delete(`${authServiceUrl}/auth/users/${userId}`),
    ]);

    const blockingFailure = deletionResults.find(
      (result) =>
        result.status === 'rejected' && !this.isIgnorableDeleteError(result.reason)
    );

    if (blockingFailure?.status === 'rejected') {
      throw blockingFailure.reason;
    }

    return { success: true };
  }

  @Post(':userId/focus-areas')
  async updateFocusAreas(
    @Param('userId') userId: string,
    @Body() body: { selectedKeys?: string[] }
  ) {
    const gamificationServiceUrl = process.env.GAMIFICATION_SERVICE_URL ?? 'http://localhost:3004';
    const response = await axios.post(
      `${gamificationServiceUrl}/profile-gamification/${userId}/focus-areas`,
      body
    );

    return response.data;
  }
}
