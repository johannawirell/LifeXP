import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
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

  @Get(':userId')
  async getGoalsPage(@Param('userId') userId: string) {
    const goalsServiceUrl = process.env.GOALS_SERVICE_URL ?? 'http://localhost:3002';
    const response = await axios.get(`${goalsServiceUrl}/goals/${userId}`);

    return response.data;
  }
}
