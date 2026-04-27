import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PrismaClient } from '../../generated/client';

import { GoalsQueryService } from './goals-query.service';

const prisma = new PrismaClient();
const goalsQueryService = new GoalsQueryService(prisma);

@Controller('goals')
export class GoalsController {
  @Get('templates/list')
  getGoalTemplates(@Query('category') category?: string) {
    return goalsQueryService.getGoalTemplatePage(category);
  }

  @Get('templates/:templateId')
  getGoalTemplateDetail(@Param('templateId') templateId: string) {
    return goalsQueryService.getGoalTemplateDetail(templateId);
  }

  @Post(':userId/from-template/:templateId')
  createGoalFromTemplate(
    @Param('userId') userId: string,
    @Param('templateId') templateId: string,
    @Body() body?: unknown
  ) {
    return goalsQueryService.createGoalFromTemplate(userId, templateId, body as never);
  }

  @Get(':userId/detail/:goalId')
  getGoalDetail(@Param('userId') userId: string, @Param('goalId') goalId: string) {
    return goalsQueryService.getGoalDetail(userId, goalId);
  }

  @Patch(':userId/subtasks/:subtaskId')
  updateSubtaskCompletion(
    @Param('userId') userId: string,
    @Param('subtaskId') subtaskId: string,
    @Body() body?: { completed?: boolean }
  ) {
    return goalsQueryService.updateSubtaskCompletion(userId, subtaskId, Boolean(body?.completed));
  }

  @Delete(':userId/:goalId')
  deleteGoal(@Param('userId') userId: string, @Param('goalId') goalId: string) {
    return goalsQueryService.deleteGoal(userId, goalId);
  }

  @Get(':userId')
  getGoalsPage(@Param('userId') userId: string) {
    return goalsQueryService.getGoalsPage(userId);
  }
}
