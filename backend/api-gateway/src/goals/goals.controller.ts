import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import axios from 'axios';

import { LiveUpdatesGateway } from '../live-updates/live-updates.gateway';

@Controller('goals')
export class GoalsController {
  constructor(private readonly liveUpdatesGateway: LiveUpdatesGateway) {}

  private emitUserUpdate(payload: {
    userId: string;
    resources: string[];
    type: 'invalidate' | 'reward';
    reward?: {
      milestoneXp?: number;
      goalBonusXp?: number;
      questXp?: number;
      totalXp: number;
      title: string;
    } | null;
  }) {
    this.liveUpdatesGateway?.emitUserUpdate(payload);
  }

  @Get('templates/list')
  async getGoalTemplates(@Query('userId') userId?: string, @Query('category') category?: string) {
    const goalsServiceUrl = process.env.GOALS_SERVICE_URL ?? 'http://localhost:3002';
    const response = await axios.get(`${goalsServiceUrl}/goals/templates/list`, {
      params: {
        ...(category ? { category } : {}),
        ...(userId ? { userId } : {}),
      },
    });

    return response.data;
  }

  @Get('templates/:templateId')
  async getGoalTemplateDetail(@Param('templateId') templateId: string) {
    const goalsServiceUrl = process.env.GOALS_SERVICE_URL ?? 'http://localhost:3002';
    const response = await axios.get(`${goalsServiceUrl}/goals/templates/${templateId}`);

    return response.data;
  }

  @Post(':userId/from-template/:templateId')
  async createGoalFromTemplate(
    @Param('userId') userId: string,
    @Param('templateId') templateId: string,
    @Body() body?: unknown
  ) {
    const goalsServiceUrl = process.env.GOALS_SERVICE_URL ?? 'http://localhost:3002';
    const response = await axios.post(`${goalsServiceUrl}/goals/${userId}/from-template/${templateId}`, body);
    this.emitUserUpdate({
      userId,
      resources: ['goals', 'profile', 'statistics'],
      type: 'invalidate',
    });

    return response.data;
  }

  @Post(':userId/quests')
  async createCustomQuest(@Param('userId') userId: string, @Body() body?: unknown) {
    const goalsServiceUrl = process.env.GOALS_SERVICE_URL ?? 'http://localhost:3002';
    const response = await axios.post(`${goalsServiceUrl}/goals/${userId}/quests`, body);
    this.emitUserUpdate({
      userId,
      resources: ['goals', 'profile', 'statistics'],
      type: 'invalidate',
    });

    return response.data;
  }

  @Post(':userId/custom')
  async createCustomGoal(@Param('userId') userId: string, @Body() body?: unknown) {
    const goalsServiceUrl = process.env.GOALS_SERVICE_URL ?? 'http://localhost:3002';
    const response = await axios.post(`${goalsServiceUrl}/goals/${userId}/custom`, body);
    this.emitUserUpdate({
      userId,
      resources: ['goals', 'profile', 'statistics'],
      type: 'invalidate',
    });

    return response.data;
  }

  @Get(':userId/detail/:goalId')
  async getGoalDetail(@Param('userId') userId: string, @Param('goalId') goalId: string) {
    const goalsServiceUrl = process.env.GOALS_SERVICE_URL ?? 'http://localhost:3002';
    const response = await axios.get(`${goalsServiceUrl}/goals/${userId}/detail/${goalId}`);

    return response.data;
  }

  @Get(':userId/summary')
  async getGoalSummary(@Param('userId') userId: string) {
    const goalsServiceUrl = process.env.GOALS_SERVICE_URL ?? 'http://localhost:3002';
    const response = await axios.get(`${goalsServiceUrl}/goals/${userId}/summary`);

    return response.data;
  }

  @Patch(':userId/subtasks/:subtaskId')
  async updateSubtaskCompletion(
    @Param('userId') userId: string,
    @Param('subtaskId') subtaskId: string,
    @Body() body?: { completed?: boolean }
  ) {
    const goalsServiceUrl = process.env.GOALS_SERVICE_URL ?? 'http://localhost:3002';
    const response = await axios.patch(`${goalsServiceUrl}/goals/${userId}/subtasks/${subtaskId}`, body);
    this.emitUserUpdate({
      userId,
      resources: ['goals', 'profile', 'statistics'],
      type: response.data?.reward ? 'reward' : 'invalidate',
      reward: response.data?.reward
        ? {
            milestoneXp: response.data.reward.milestoneXp,
            goalBonusXp: response.data.reward.goalBonusXp,
            questXp: response.data.reward.questXp,
            totalXp: response.data.reward.totalXp,
            title: response.data.reward.title,
          }
        : null,
    });

    return response.data;
  }

  @Patch(':userId/quests/:questId')
  async updateQuestProgress(
    @Param('userId') userId: string,
    @Param('questId') questId: string,
    @Body() body?: { currentCount?: number; completed?: boolean; incrementBy?: number }
  ) {
    const goalsServiceUrl = process.env.GOALS_SERVICE_URL ?? 'http://localhost:3002';
    const response = await axios.patch(`${goalsServiceUrl}/goals/${userId}/quests/${questId}`, body);
    this.emitUserUpdate({
      userId,
      resources: ['goals', 'profile', 'statistics'],
      type: response.data?.reward ? 'reward' : 'invalidate',
      reward: response.data?.reward
        ? {
            milestoneXp: response.data.reward.milestoneXp,
            goalBonusXp: response.data.reward.goalBonusXp,
            questXp: response.data.reward.questXp,
            totalXp: response.data.reward.totalXp,
            title: response.data.reward.title,
          }
        : null,
    });

    return response.data;
  }

  @Delete(':userId/:goalId')
  async deleteGoal(@Param('userId') userId: string, @Param('goalId') goalId: string) {
    const goalsServiceUrl = process.env.GOALS_SERVICE_URL ?? 'http://localhost:3002';
    const response = await axios.delete(`${goalsServiceUrl}/goals/${userId}/${goalId}`);
    this.emitUserUpdate({
      userId,
      resources: ['goals', 'profile', 'statistics'],
      type: 'invalidate',
    });

    return response.data;
  }

  @Get(':userId')
  async getGoalsPage(@Param('userId') userId: string) {
    const goalsServiceUrl = process.env.GOALS_SERVICE_URL ?? 'http://localhost:3002';
    const response = await axios.get(`${goalsServiceUrl}/goals/${userId}`);

    return response.data;
  }
}
