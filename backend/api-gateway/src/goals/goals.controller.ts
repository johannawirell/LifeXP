import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import axios from 'axios';

@Controller('goals')
export class GoalsController {
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

    return response.data;
  }

  @Get(':userId/detail/:goalId')
  async getGoalDetail(@Param('userId') userId: string, @Param('goalId') goalId: string) {
    const goalsServiceUrl = process.env.GOALS_SERVICE_URL ?? 'http://localhost:3002';
    const response = await axios.get(`${goalsServiceUrl}/goals/${userId}/detail/${goalId}`);

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

    return response.data;
  }

  @Delete(':userId/:goalId')
  async deleteGoal(@Param('userId') userId: string, @Param('goalId') goalId: string) {
    const goalsServiceUrl = process.env.GOALS_SERVICE_URL ?? 'http://localhost:3002';
    const response = await axios.delete(`${goalsServiceUrl}/goals/${userId}/${goalId}`);

    return response.data;
  }

  @Get(':userId')
  async getGoalsPage(@Param('userId') userId: string) {
    const goalsServiceUrl = process.env.GOALS_SERVICE_URL ?? 'http://localhost:3002';
    const response = await axios.get(`${goalsServiceUrl}/goals/${userId}`);

    return response.data;
  }
}
