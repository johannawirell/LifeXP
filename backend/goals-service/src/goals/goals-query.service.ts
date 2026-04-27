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
    description?: string;
    completed: boolean;
    completedLabel?: string;
    subtasks: {
      id: string;
      title: string;
      completed: boolean;
    }[];
    tips: {
      id: string;
      text: string;
    }[];
  }[];
};

type GoalsPageResponse = {
  overview: GoalsOverview;
  activeGoals: GoalCard[];
  completedGoals: GoalCard[];
};

type GoalDetailResponse = GoalCard;

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
    subtasks: {
      id: string;
      title: string;
    }[];
    tips: {
      id: string;
      text: string;
    }[];
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
    subtasks: {
      id: string;
      title: string;
    }[];
    tips: {
      id: string;
      text: string;
    }[];
  }[];
};

type CreateGoalFromTemplateInput = {
  title?: string;
  milestones?: {
    title: string;
    description?: string;
    subtasks?: string[];
    tips?: string[];
  }[];
};

export class GoalsQueryService {
  constructor(private readonly prisma: PrismaClient) {}

  async getGoalsPage(userId: string): Promise<GoalsPageResponse> {
    const goals = await this.prisma.goal.findMany({
      where: { userId },
      include: {
        milestones: {
          include: {
            subtasks: {
              orderBy: {
                position: 'asc',
              },
            },
            tips: {
              orderBy: {
                position: 'asc',
              },
            },
          },
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

    const progressValues = activeGoals.map((goal) => this.getGoalProgress(goal));
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

  async getGoalDetail(userId: string, goalId: string): Promise<GoalDetailResponse> {
    const goal = await this.prisma.goal.findFirst({
      where: { id: goalId, userId },
      include: {
        milestones: {
          include: {
            subtasks: {
              orderBy: {
                position: 'asc',
              },
            },
            tips: {
              orderBy: {
                position: 'asc',
              },
            },
          },
          orderBy: {
            position: 'asc',
          },
        },
      },
    });

    if (!goal) {
      throw new NotFoundException('Goal not found.');
    }

    return this.toGoalCard(goal);
  }

  async updateSubtaskCompletion(userId: string, subtaskId: string, completed: boolean) {
    const subtask = await this.prisma.milestoneSubtask.findFirst({
      where: {
        id: subtaskId,
        milestone: {
          goal: {
            userId,
          },
        },
      },
      include: {
        milestone: {
          include: {
            goal: true,
          },
        },
      },
    });

    if (!subtask) {
      throw new NotFoundException('Subtask not found.');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.milestoneSubtask.update({
        where: { id: subtaskId },
        data: { completed },
      });

      const milestoneSubtasks = await tx.milestoneSubtask.findMany({
        where: { milestoneId: subtask.milestoneId },
      });

      const allSubtasksCompleted = milestoneSubtasks.length > 0 && milestoneSubtasks.every((item) => item.completed);

      await tx.milestone.update({
        where: { id: subtask.milestoneId },
        data: {
          completedAt: allSubtasksCompleted ? new Date() : null,
        },
      });

      const goalMilestones = await tx.milestone.findMany({
        where: { goalId: subtask.milestone.goalId },
      });

      const completedMilestoneCount = goalMilestones.filter((milestone) => Boolean(milestone.completedAt)).length;
      const totalMilestones = goalMilestones.length;
      const progressPercent = totalMilestones > 0 ? Math.round((completedMilestoneCount / totalMilestones) * 100) : 0;
      const isGoalCompleted = totalMilestones > 0 && completedMilestoneCount === totalMilestones;

      await tx.goal.update({
        where: { id: subtask.milestone.goalId },
        data: {
          currentValue: completedMilestoneCount,
          targetValue: totalMilestones,
          percentLabel: `${progressPercent} %`,
          status: isGoalCompleted ? 'COMPLETED' : 'ACTIVE',
          completedAt: isGoalCompleted ? new Date() : null,
        },
      });
    });

    return this.getGoalsPage(userId);
  }

  async deleteGoal(userId: string, goalId: string) {
    const goal = await this.prisma.goal.findFirst({
      where: {
        id: goalId,
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!goal) {
      throw new NotFoundException('Goal not found.');
    }

    await this.prisma.goal.delete({
      where: {
        id: goalId,
      },
    });

    return this.getGoalsPage(userId);
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
          include: {
            subtasks: {
              orderBy: {
                position: 'asc',
              },
            },
            tips: {
              orderBy: {
                position: 'asc',
              },
            },
          },
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
      { key: 'finance', label: 'Ekonomi', icon: 'wallet-outline', active: normalizedCategory === 'finance' },
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
            value: this.mapDetailValue(detail.label, detail.value, template.milestones.length),
          })),
        milestones: template.milestones.map((milestone) => ({
          id: milestone.id,
          title: milestone.title,
          subtasks: milestone.subtasks.map((subtask) => ({
            id: subtask.id,
            title: subtask.title,
          })),
          tips: milestone.tips.map((tip) => ({
            id: tip.id,
            text: tip.text,
          })),
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
          include: {
            subtasks: {
              orderBy: {
                position: 'asc',
              },
            },
            tips: {
              orderBy: {
                position: 'asc',
              },
            },
          },
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
          value: this.mapDetailValue(detail.label, detail.value, template.milestones.length),
        })),
      detailDetails: template.details
        .filter((detail) => this.isVisibleInDetail(detail.visibility))
        .map((detail) => ({
          id: detail.id,
          label: detail.label,
          value: this.mapDetailValue(detail.label, detail.value, template.milestones.length),
        })),
      milestones: template.milestones.map((milestone) => ({
        id: milestone.id,
        title: milestone.title,
        description: milestone.description ?? undefined,
        subtasks: milestone.subtasks.map((subtask) => ({
          id: subtask.id,
          title: subtask.title,
        })),
        tips: milestone.tips.map((tip) => ({
          id: tip.id,
          text: tip.text,
        })),
      })),
    };
  }

  async createGoalFromTemplate(userId: string, templateId: string, input?: CreateGoalFromTemplateInput) {
    const template = await this.prisma.goalTemplate.findUnique({
      where: { id: templateId },
      include: {
        milestones: {
          include: {
            subtasks: {
              orderBy: {
                position: 'asc',
              },
            },
            tips: {
              orderBy: {
                position: 'asc',
              },
            },
          },
          orderBy: {
            position: 'asc',
          },
        },
      },
    });

    if (!template) {
      throw new NotFoundException('Goal template not found.');
    }

    const sourceMilestones = input?.milestones?.length
      ? input.milestones
      : template.milestones.map((milestone) => ({
          title: milestone.title,
          description: milestone.description ?? undefined,
          subtasks: milestone.subtasks.map((subtask) => subtask.title),
          tips: milestone.tips.map((tip) => tip.text),
        }));

    const createdGoal = await this.prisma.$transaction(async (tx) => {
      const goal = await tx.goal.create({
        data: {
          userId,
          title: input?.title?.trim() || template.title,
          subtitle: template.subtitle,
          description: template.detailDescription,
          category: this.mapCategoryEnumToLabel(template.category),
          icon: template.icon,
          status: 'ACTIVE',
          targetValue: sourceMilestones.length,
          currentValue: 0,
          percentLabel: '0 %',
          cardColor: template.color,
        },
      });

      if (sourceMilestones.length > 0) {
        for (const [index, milestone] of sourceMilestones.entries()) {
          const createdMilestone = await tx.milestone.create({
            data: {
              goalId: goal.id,
              title: milestone.title,
              description: milestone.description,
              position: index,
            },
          });

          const subtasks = milestone.subtasks?.length ? milestone.subtasks : [`Förbered: ${milestone.title}`];
          const tips = milestone.tips?.length ? milestone.tips : [`Boka tid för "${milestone.title}".`];

          await tx.milestoneSubtask.createMany({
            data: subtasks.map((title, subtaskIndex) => ({
              milestoneId: createdMilestone.id,
              title,
              position: subtaskIndex,
            })),
          });

          await tx.milestoneTip.createMany({
            data: tips.map((text, tipIndex) => ({
              milestoneId: createdMilestone.id,
              text,
              position: tipIndex,
            })),
          });
        }
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
      case 'finance':
        return 'FINANCE';
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
      case 'FINANCE':
        return 'Ekonomi';
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

  private mapDetailValue(label: string, value: string, milestoneCount: number) {
    if (label !== 'Upplägg') {
      return value;
    }

    const match = value.match(/^\d+\s+(.+)$/);

    if (match) {
      return `${milestoneCount} ${match[1]}`;
    }

    return `${milestoneCount} ${value}`;
  }

  private toGoalCard(
    goal: Prisma.GoalGetPayload<{
      include: {
        milestones: {
          include: {
            subtasks: true;
            tips: true;
          };
        };
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
      progress: this.getGoalProgress(goal),
      percentLabel: `${Math.round(this.getGoalProgress(goal) * 100)} %`,
      color: goal.cardColor ?? '#73D86A',
      leftMeta: totalMilestones > 0 ? `Steg ${completedMilestones} av ${totalMilestones}` : '',
      rightMeta: this.getRightMeta(goal, completedMilestones),
      milestones: goal.milestones.map((milestone) => ({
        id: milestone.id,
        title: milestone.title,
        description: milestone.description ?? undefined,
        completed: Boolean(milestone.completedAt),
        completedLabel: milestone.completedAt ? this.formatDateLabel(milestone.completedAt) : undefined,
        subtasks: milestone.subtasks.map((subtask) => ({
          id: subtask.id,
          title: subtask.title,
          completed: subtask.completed,
        })),
        tips: milestone.tips.map((tip) => ({
          id: tip.id,
          text: tip.text,
        })),
      })),
    };
  }

  private getGoalProgress(
    goal: Prisma.GoalGetPayload<{
      include: {
        milestones: {
          include: {
            subtasks: true;
            tips: true;
          };
        };
      };
    }>
  ) {
    if (goal.milestones.length > 0) {
      const completedMilestones = goal.milestones.filter((milestone) => Boolean(milestone.completedAt)).length;
      return completedMilestones / goal.milestones.length;
    }

    if (typeof goal.currentValue !== 'object' && typeof goal.targetValue !== 'object') {
      const current = Number(goal.currentValue ?? 0);
      const target = Number(goal.targetValue ?? 0);

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
