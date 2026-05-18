import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import axios from 'axios';

import { LiveUpdatesGateway } from '../live-updates/live-updates.gateway';

@Controller('goals')
export class GoalsController {
  constructor(private readonly liveUpdatesGateway: LiveUpdatesGateway) {}

  @Get('templates/list')
  async getGoalTemplates(@Query('category') category?: string) {
    const goalsServiceUrl = process.env.GOALS_SERVICE_URL ?? 'http://localhost:3002';
    const response = await axios.get(`${goalsServiceUrl}/goals/templates/list`, {
      params: category ? { category } : undefined,
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
    this.liveUpdatesGateway.emitUserUpdate({
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
    this.liveUpdatesGateway.emitUserUpdate({
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
    this.liveUpdatesGateway.emitUserUpdate({
      userId,
      resources: ['goals', 'profile', 'statistics'],
      type: response.data?.reward ? 'reward' : 'invalidate',
      reward: response.data?.reward
        ? {
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
    this.liveUpdatesGateway.emitUserUpdate({
      userId,
      resources: ['goals', 'profile', 'statistics'],
      type: response.data?.reward ? 'reward' : 'invalidate',
      reward: response.data?.reward
        ? {
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
    this.liveUpdatesGateway.emitUserUpdate({
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
