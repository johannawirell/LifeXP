import { Controller, Get, Param } from '@nestjs/common';
import axios from 'axios';

@Controller('goals')
export class GoalsController {
  @Get('templates/list')
  async getGoalTemplates() {
    const goalsServiceUrl = process.env.GOALS_SERVICE_URL ?? 'http://localhost:3002';
    const response = await axios.get(`${goalsServiceUrl}/goals/templates/list`);

    return response.data;
  }

  @Get(':userId')
  async getGoalsPage(@Param('userId') userId: string) {
    const goalsServiceUrl = process.env.GOALS_SERVICE_URL ?? 'http://localhost:3002';
    const response = await axios.get(`${goalsServiceUrl}/goals/${userId}`);

    return response.data;
  }
}
