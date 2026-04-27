import { NotFoundException } from '@nestjs/common';
import { PrismaClient, Prisma, GoalTemplateCategory, GoalTemplateDetailVisibility } from '../../generated/client';

type GoalsOverview = {
  activeGoals: number;
  averageProgress: string;
  completedMilestones: number;
  streakDays: number;
};

type GoalCard = {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  progress: number;
  percentLabel: string;
  color: string;
  leftMeta: string;
  rightMeta: string;
  milestones: {
    id: string;
    title: string;
    completed: boolean;
    completedLabel?: string;
  }[];
};

type GoalsPageResponse = {
  overview: GoalsOverview;
  activeGoals: GoalCard[];
  completedGoals: GoalCard[];
};

type GoalTemplateCard = {
  id: string;
  title: string;
  icon: string;
  subtitle: string;
  summaryDescription: string;
  category: string;
  color: string;
  summaryDetails: {
    id: string;
    label: string;
    value: string;
  }[];
  milestones: {
    id: string;
    title: string;
  }[];
};

type GoalTemplatePageResponse = {
  steps: { id: number; label: string; complete: boolean }[];
  categories: { key: string; label: string; icon: string; active: boolean }[];
  selectedCategory: string;
  templates: GoalTemplateCard[];
};

type GoalTemplateDetailResponse = {
  id: string;
  title: string;
  icon: string;
  subtitle: string;
  summaryDescription: string;
  detailDescription: string;
  category: string;
  color: string;
  summaryDetails: {
    id: string;
    label: string;
    value: string;
  }[];
  detailDetails: {
    id: string;
    label: string;
    value: string;
  }[];
  milestones: {
    id: string;
    title: string;
    description?: string;
  }[];
};

export class GoalsQueryService {
  constructor(private readonly prisma: PrismaClient) {}

  async getGoalsPage(userId: string): Promise<GoalsPageResponse> {
    const goals = await this.prisma.goal.findMany({
      where: { userId },
      include: {
        milestones: {
          orderBy: {
            position: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const activeGoals = goals.filter((goal) => goal.status === 'ACTIVE');
    const completedGoals = goals.filter((goal) => goal.status === 'COMPLETED');

    const progressValues = activeGoals.map((goal) => this.getGoalProgress(goal.currentValue, goal.targetValue));
    const averageProgress =
      progressValues.length > 0
        ? `${Math.round((progressValues.reduce((sum, value) => sum + value, 0) / progressValues.length) * 100)} %`
        : '0 %';

    const completedMilestones = activeGoals.reduce(
      (sum, goal) => sum + goal.milestones.filter((milestone) => Boolean(milestone.completedAt)).length,
      0
    );

    const streakDays = Math.max(0, ...activeGoals.map((goal) => goal.streakDays ?? 0));

    return {
      overview: {
        activeGoals: activeGoals.length,
        averageProgress,
        completedMilestones,
        streakDays,
      },
      activeGoals: activeGoals.map((goal) => this.toGoalCard(goal)),
      completedGoals: completedGoals.map((goal) => this.toGoalCard(goal)),
    };
  }

  async getGoalTemplatePage(category = 'popular'): Promise<GoalTemplatePageResponse> {
    const normalizedCategory = category.toLowerCase();
    const templates = await this.prisma.goalTemplate.findMany({
      where:
        normalizedCategory === 'popular'
          ? { isPopular: true }
          : { category: this.mapCategoryKeyToEnum(normalizedCategory) },
      include: {
        details: {
          orderBy: {
            position: 'asc',
          },
        },
        milestones: {
          orderBy: {
            position: 'asc',
          },
        },
      },
      orderBy: [{ isPopular: 'desc' }, { position: 'asc' }],
    });

    const categories = [
      { key: 'popular', label: 'Populära', icon: 'star-outline', active: normalizedCategory === 'popular' },
      { key: 'job', label: 'Jobb', icon: 'briefcase-outline', active: normalizedCategory === 'job' },
      { key: 'study', label: 'Plugg', icon: 'school-outline', active: normalizedCategory === 'study' },
      { key: 'training', label: 'Träning', icon: 'barbell-outline', active: normalizedCategory === 'training' },
      { key: 'health', label: 'Hälsa', icon: 'heart-outline', active: normalizedCategory === 'health' },
      { key: 'relationship', label: 'Relationer', icon: 'people-outline', active: normalizedCategory === 'relationship' },
    ];

    return {
      steps: [
        { id: 1, label: 'Välj mål', complete: true },
        { id: 2, label: 'Anpassa', complete: false },
        { id: 3, label: 'Klart!', complete: false },
      ],
      categories,
      selectedCategory: normalizedCategory,
      templates: templates.map((template) => ({
        id: template.id,
        title: template.title,
        icon: template.icon,
        subtitle: template.subtitle,
        summaryDescription: template.summaryDescription,
        category: this.mapCategoryEnumToLabel(template.category),
        color: template.color,
        summaryDetails: template.details
          .filter((detail) => this.isVisibleInSummary(detail.visibility))
          .map((detail) => ({
            id: detail.id,
            label: detail.label,
            value: detail.value,
          })),
        milestones: template.milestones.map((milestone) => ({
          id: milestone.id,
          title: milestone.title,
        })),
      })),
    };
  }

  async getGoalTemplateDetail(templateId: string): Promise<GoalTemplateDetailResponse> {
    const template = await this.prisma.goalTemplate.findUnique({
      where: { id: templateId },
      include: {
        details: {
          orderBy: {
            position: 'asc',
          },
        },
        milestones: {
          orderBy: {
            position: 'asc',
          },
        },
      },
    });

    if (!template) {
      throw new NotFoundException('Goal template not found.');
    }

    return {
      id: template.id,
      title: template.title,
      icon: template.icon,
      subtitle: template.subtitle,
      summaryDescription: template.summaryDescription,
      detailDescription: template.detailDescription,
      category: this.mapCategoryEnumToLabel(template.category),
      color: template.color,
      summaryDetails: template.details
        .filter((detail) => this.isVisibleInSummary(detail.visibility))
        .map((detail) => ({
          id: detail.id,
          label: detail.label,
          value: detail.value,
        })),
      detailDetails: template.details
        .filter((detail) => this.isVisibleInDetail(detail.visibility))
        .map((detail) => ({
          id: detail.id,
          label: detail.label,
          value: detail.value,
        })),
      milestones: template.milestones.map((milestone) => ({
        id: milestone.id,
        title: milestone.title,
        description: milestone.description ?? undefined,
      })),
    };
  }

  async createGoalFromTemplate(userId: string, templateId: string) {
    const template = await this.prisma.goalTemplate.findUnique({
      where: { id: templateId },
      include: {
        milestones: {
          orderBy: {
            position: 'asc',
          },
        },
      },
    });

    if (!template) {
      throw new NotFoundException('Goal template not found.');
    }

    const createdGoal = await this.prisma.$transaction(async (tx) => {
      const goal = await tx.goal.create({
        data: {
          userId,
          title: template.title,
          subtitle: template.subtitle,
          description: template.detailDescription,
          category: this.mapCategoryEnumToLabel(template.category),
          icon: template.icon,
          status: 'ACTIVE',
          targetValue: template.milestones.length,
          currentValue: 0,
          percentLabel: '0 %',
          cardColor: template.color,
        },
      });

      if (template.milestones.length > 0) {
        await tx.milestone.createMany({
          data: template.milestones.map((milestone, index) => ({
            goalId: goal.id,
            title: milestone.title,
            description: milestone.description,
            position: index,
          })),
        });
      }

      return goal;
    });

    return {
      goalId: createdGoal.id,
      userId,
      templateId,
      message: 'Goal created from template.',
    };
  }

  private mapCategoryKeyToEnum(category: string): GoalTemplateCategory {
    switch (category) {
      case 'job':
        return 'JOB';
      case 'study':
        return 'STUDY';
      case 'training':
        return 'TRAINING';
      case 'health':
        return 'HEALTH';
      case 'relationship':
        return 'RELATIONSHIP';
      default:
        return 'TRAINING';
    }
  }

  private mapCategoryEnumToLabel(category: GoalTemplateCategory): string {
    switch (category) {
      case 'JOB':
        return 'Jobb';
      case 'STUDY':
        return 'Plugg';
      case 'TRAINING':
        return 'Träning';
      case 'HEALTH':
        return 'Hälsa';
      case 'RELATIONSHIP':
        return 'Relationer';
      default:
        return 'Träning';
    }
  }

  private isVisibleInSummary(visibility: GoalTemplateDetailVisibility) {
    return visibility === 'SUMMARY' || visibility === 'BOTH';
  }

  private isVisibleInDetail(visibility: GoalTemplateDetailVisibility) {
    return visibility === 'DETAIL' || visibility === 'BOTH';
  }

  private toGoalCard(
    goal: Prisma.GoalGetPayload<{
      include: {
        milestones: true;
      };
    }>
  ): GoalCard {
    const completedMilestones = goal.milestones.filter((milestone) => Boolean(milestone.completedAt)).length;
    const totalMilestones = goal.milestones.length;

    return {
      id: goal.id,
      icon: goal.icon ?? 'flag-outline',
      title: goal.title,
      subtitle: goal.subtitle ?? goal.category ?? '',
      progress: this.getGoalProgress(goal.currentValue, goal.targetValue),
      percentLabel: goal.percentLabel ?? `${Math.round(this.getGoalProgress(goal.currentValue, goal.targetValue) * 100)} %`,
      color: goal.cardColor ?? '#73D86A',
      leftMeta: totalMilestones > 0 ? `Steg ${completedMilestones} av ${totalMilestones}` : '',
      rightMeta: this.getRightMeta(goal, completedMilestones),
      milestones: goal.milestones.map((milestone) => ({
        id: milestone.id,
        title: milestone.title,
        completed: Boolean(milestone.completedAt),
        completedLabel: milestone.completedAt ? this.formatDateLabel(milestone.completedAt) : undefined,
      })),
    };
  }

  private getGoalProgress(currentValue: unknown, targetValue: unknown) {
    if (typeof currentValue !== 'object' && typeof targetValue !== 'object') {
      const current = Number(currentValue ?? 0);
      const target = Number(targetValue ?? 0);

      if (target <= 0) {
        return 0;
      }

      return Math.min(current / target, 1);
    }

    return 0;
  }

  private getRightMeta(
    goal: Awaited<ReturnType<PrismaClient['goal']['findMany']>>[number],
    completedMilestones: number
  ) {
    const current = Number(goal.currentValue ?? 0);
    const target = Number(goal.targetValue ?? 0);

    if (goal.unit === 'days' && target > 0) {
      return `${current} av ${target} dagar`;
    }

    return `${completedMilestones} delmål klara`;
  }

  private formatDateLabel(date: Date) {
    return `Klart ${date.toLocaleDateString('sv-SE', {
      day: 'numeric',
      month: 'short',
    })}`;
  }
}
