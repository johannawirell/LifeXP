import { Controller, Get, Param } from '@nestjs/common';
import { PrismaClient } from '../../generated/client';

import { GoalsQueryService } from './goals-query.service';

const prisma = new PrismaClient();
const goalsQueryService = new GoalsQueryService(prisma);

@Controller('goals')
export class GoalsController {
  @Get(':userId')
  getGoalsPage(@Param('userId') userId: string) {
    return goalsQueryService.getGoalsPage(userId);
  }

  @Get('templates/list')
  getGoalTemplates() {
    return goalsQueryService.getGoalTemplatePage();
  }
}
