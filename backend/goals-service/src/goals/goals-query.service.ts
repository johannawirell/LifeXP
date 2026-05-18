import axios from 'axios';
import { NotFoundException } from '@nestjs/common';
import {
  GoalDifficulty,
  GoalTemplateCategory,
  GoalTemplateDetailVisibility,
  Prisma,
  PrismaClient,
  QuestCategory,
  QuestType,
} from '../../generated/client';

type GoalsOverview = {
  activeGoals: number;
  averageProgress: string;
  completedMilestones: number;
  streakDays: number;
  totalQuestXp: number;
};

type QuestCard = {
  id: string;
  title: string;
  description?: string;
  type: QuestType;
  category: string;
  difficulty: GoalDifficulty;
  xpReward: number;
  progress: number;
  progressLabel: string;
  completed: boolean;
  streakCount: number;
  color: string;
};

type GoalCard = {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  difficulty: GoalDifficulty;
  progress: number;
  percentLabel: string;
  color: string;
  leftMeta: string;
  rightMeta: string;
  totalXpReward: number;
  goalXpReward: number;
  milestones: {
    id: string;
    title: string;
    description?: string;
    xpReward: number;
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
  dailyQuests: QuestCard[];
  weeklyQuests: QuestCard[];
  activeGoals: GoalCard[];
  completedGoals: GoalCard[];
};

type GoalSummaryResponse = {
  completedGoals: number;
  activeGoals: number;
  completedMilestones: number;
  totalMilestones: number;
  completedQuests: number;
  totalQuestXp: number;
};

type GoalTemplateCard = {
  id: string;
  title: string;
  icon: string;
  subtitle: string;
  summaryDescription: string;
  category: string;
  difficulty: GoalDifficulty;
  totalXpReward: number;
  goalXpReward: number;
  color: string;
  summaryDetails: {
    id: string;
    label: string;
    value: string;
  }[];
  milestones: {
    id: string;
    title: string;
    xpReward: number;
    subtasks: {
      id: string;
      title: string;
    }[];
    tips: {
      id: string;
      text: string;
    }[];
  }[];
  quests: {
    id: string;
    title: string;
    description?: string;
    frequency: QuestType;
    xpReward: number;
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
  difficulty: GoalDifficulty;
  totalXpReward: number;
  goalXpReward: number;
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
    xpReward: number;
    subtasks: {
      id: string;
      title: string;
    }[];
    tips: {
      id: string;
      text: string;
    }[];
  }[];
  quests: {
    id: string;
    title: string;
    description?: string;
    frequency: QuestType;
    xpReward: number;
  }[];
};

type CreateGoalFromTemplateInput = {
  title?: string;
  milestones?: {
    title: string;
    description?: string;
    xpReward?: number;
    subtasks?: string[];
    tips?: string[];
  }[];
};

type CreateCustomGoalInput = {
  title?: string;
  subtitle?: string;
  category?: string;
  difficulty?: GoalDifficulty;
  color?: string;
  icon?: string;
  goalXpReward?: number;
  totalXpReward?: number;
  milestones?: {
    title: string;
    description?: string;
    xpReward?: number;
    subtasks?: string[];
    tips?: string[];
  }[];
};

type CreateCustomQuestInput = {
  title?: string;
  description?: string;
  type?: QuestType;
  category?: QuestCategory;
  difficulty?: GoalDifficulty;
  xpReward?: number;
  targetCount?: number;
};

type UpdateQuestProgressInput = {
  currentCount?: number;
  completed?: boolean;
  incrementBy?: number;
};

type GoalWithMilestones = Prisma.GoalGetPayload<{
  include: {
    milestones: {
      include: {
        subtasks: true;
        tips: true;
      };
    };
  };
}>;

const CATEGORY_COLORS: Record<string, string> = {
  TRAINING: '#73D86A',
  HEALTH: '#F08A45',
  PRODUCTIVITY: '#5E8BFF',
  MINDFULNESS: '#A866FF',
  CAREER: '#6DA6FF',
  CREATIVITY: '#FF77C8',
  SOCIAL: '#7A8CFF',
  FINANCE: '#56D2C5',
  Träning: '#73D86A',
  Hälsa: '#F08A45',
  Plugg: '#B269FF',
  Jobb: '#5E8BFF',
  Mindfulness: '#A866FF',
  Ekonomi: '#56D2C5',
  Relationer: '#7A8CFF',
};

export class GoalsQueryService {
  constructor(private readonly prisma: PrismaClient) {}

  async getGoalsPage(userId: string): Promise<GoalsPageResponse> {
    await this.refreshQuestStates(userId);

    const [goals, quests] = await Promise.all([
      this.prisma.goal.findMany({
        where: { userId },
        include: {
          milestones: {
            include: {
              subtasks: {
                orderBy: { position: 'asc' },
              },
              tips: {
                orderBy: { position: 'asc' },
              },
            },
            orderBy: { position: 'asc' },
          },
        },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.quest.findMany({
        where: { userId },
        orderBy: [{ type: 'asc' }, { position: 'asc' }],
      }),
    ]);

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
    const streakDays = Math.max(
      0,
      ...activeGoals.map((goal) => goal.streakDays ?? 0),
      ...quests.map((quest) => quest.streakCount ?? 0)
    );
    const totalQuestXp = quests.filter((quest) => quest.completed).reduce((sum, quest) => sum + quest.xpReward, 0);

    return {
      overview: {
        activeGoals: activeGoals.length,
        averageProgress,
        completedMilestones,
        streakDays,
        totalQuestXp,
      },
      dailyQuests: quests.filter((quest) => quest.type === 'DAILY').map((quest) => this.toQuestCard(quest)),
      weeklyQuests: quests.filter((quest) => quest.type === 'WEEKLY').map((quest) => this.toQuestCard(quest)),
      activeGoals: activeGoals
        .sort((left, right) => right.updatedAt.getTime() - left.updatedAt.getTime())
        .map((goal) => this.toGoalCard(goal)),
      completedGoals: completedGoals
        .sort(
          (left, right) =>
            (right.completedAt?.getTime() ?? right.updatedAt.getTime()) -
            (left.completedAt?.getTime() ?? left.updatedAt.getTime())
        )
        .map((goal) => this.toGoalCard(goal)),
    };
  }

  async getGoalSummary(userId: string): Promise<GoalSummaryResponse> {
    await this.refreshQuestStates(userId);

    const [goals, quests] = await Promise.all([
      this.prisma.goal.findMany({
        where: { userId },
        include: {
          milestones: true,
        },
      }),
      this.prisma.quest.findMany({
        where: { userId },
      }),
    ]);

    return {
      completedGoals: goals.filter((goal) => goal.status === 'COMPLETED').length,
      activeGoals: goals.filter((goal) => goal.status === 'ACTIVE').length,
      completedMilestones: goals.reduce(
        (sum, goal) => sum + goal.milestones.filter((milestone) => Boolean(milestone.completedAt)).length,
        0
      ),
      totalMilestones: goals.reduce((sum, goal) => sum + goal.milestones.length, 0),
      completedQuests: quests.filter((quest) => quest.completed).length,
      totalQuestXp: quests.filter((quest) => quest.completed).reduce((sum, quest) => sum + quest.xpReward, 0),
    };
  }

  async getGoalDetail(userId: string, goalId: string): Promise<GoalCard> {
    const goal = await this.prisma.goal.findFirst({
      where: { id: goalId, userId },
      include: {
        milestones: {
          include: {
            subtasks: {
              orderBy: { position: 'asc' },
            },
            tips: {
              orderBy: { position: 'asc' },
            },
          },
          orderBy: { position: 'asc' },
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

    let milestoneXpRewardToGrant = 0;
    let goalBonusXpToGrant = 0;
    let completedMilestoneTitle = '';
    let completedGoalTitle = '';
    let categoryLabel = subtask.milestone.goal.subtitle ?? subtask.milestone.goal.category ?? 'Produktivitet';

    await this.prisma.$transaction(async (tx) => {
      await tx.milestoneSubtask.update({
        where: { id: subtaskId },
        data: { completed },
      });

      const milestoneSubtasks = await tx.milestoneSubtask.findMany({
        where: { milestoneId: subtask.milestoneId },
      });

      const milestoneBefore = await tx.milestone.findUniqueOrThrow({
        where: { id: subtask.milestoneId },
      });

      const allSubtasksCompleted = milestoneSubtasks.length > 0 && milestoneSubtasks.every((item) => item.completed);
      const milestoneCompletedAt = allSubtasksCompleted ? milestoneBefore.completedAt ?? new Date() : null;
      const milestoneJustCompleted = allSubtasksCompleted && !milestoneBefore.completedAt;

      await tx.milestone.update({
        where: { id: subtask.milestoneId },
        data: {
          completedAt: milestoneCompletedAt,
          xpGrantedAt:
            milestoneJustCompleted && !milestoneBefore.xpGrantedAt ? milestoneCompletedAt : milestoneBefore.xpGrantedAt,
        },
      });

      const goalMilestones = await tx.milestone.findMany({
        where: { goalId: subtask.milestone.goalId },
      });

      const completedMilestoneCount = goalMilestones.filter((milestone) => Boolean(milestone.completedAt)).length;
      const totalMilestones = goalMilestones.length;
      const progressPercent = totalMilestones > 0 ? Math.round((completedMilestoneCount / totalMilestones) * 100) : 0;
      const isGoalCompleted = totalMilestones > 0 && completedMilestoneCount === totalMilestones;
      const goalJustCompleted = isGoalCompleted && !subtask.milestone.goal.completedAt;

      await tx.goal.update({
        where: { id: subtask.milestone.goalId },
        data: {
          currentValue: completedMilestoneCount,
          targetValue: totalMilestones,
          percentLabel: `${progressPercent} %`,
          status: isGoalCompleted ? 'COMPLETED' : 'ACTIVE',
          completedAt: isGoalCompleted ? subtask.milestone.goal.completedAt ?? new Date() : null,
          completedXpGrantedAt:
            goalJustCompleted && !subtask.milestone.goal.completedXpGrantedAt
              ? new Date()
              : subtask.milestone.goal.completedXpGrantedAt,
        },
      });

      if (milestoneJustCompleted && !milestoneBefore.xpGrantedAt) {
        milestoneXpRewardToGrant = milestoneBefore.xpReward;
        completedMilestoneTitle = milestoneBefore.title;
      }

      if (goalJustCompleted && !subtask.milestone.goal.completedXpGrantedAt) {
        goalBonusXpToGrant = subtask.milestone.goal.goalXpReward;
        completedGoalTitle = subtask.milestone.goal.title;
      }
    });

    if (milestoneXpRewardToGrant > 0) {
      await this.awardXp({
        userId,
        amount: milestoneXpRewardToGrant,
        sourceType: 'MILESTONE_COMPLETED',
        sourceId: subtask.milestoneId,
        title: completedMilestoneTitle,
        description: `Milestone klar i målet ${subtask.milestone.goal.title}.`,
        category: this.mapCategoryLabelToSkillCategory(categoryLabel),
      });
    }

    if (goalBonusXpToGrant > 0) {
      await this.awardXp({
        userId,
        amount: goalBonusXpToGrant,
        sourceType: 'GOAL_COMPLETED',
        sourceId: subtask.milestone.goalId,
        title: completedGoalTitle,
        description: `Bonus-XP för att du slutförde hela målet.`,
        category: this.mapCategoryLabelToSkillCategory(categoryLabel),
      });
    }

    return {
      page: await this.getGoalsPage(userId),
      reward:
        milestoneXpRewardToGrant > 0 || goalBonusXpToGrant > 0
          ? {
              milestoneXp: milestoneXpRewardToGrant,
              goalBonusXp: goalBonusXpToGrant,
              totalXp: milestoneXpRewardToGrant + goalBonusXpToGrant,
              title: completedGoalTitle || completedMilestoneTitle,
            }
          : null,
    };
  }

  async updateQuestProgress(userId: string, questId: string, payload?: UpdateQuestProgressInput) {
    const quest = await this.prisma.quest.findFirst({
      where: {
        id: questId,
        userId,
      },
    });

    if (!quest) {
      throw new NotFoundException('Quest not found.');
    }

    const nextCount = typeof payload?.currentCount === 'number'
      ? Math.max(0, Math.min(quest.targetCount, payload.currentCount))
      : typeof payload?.incrementBy === 'number'
        ? Math.max(0, Math.min(quest.targetCount, quest.currentCount + payload.incrementBy))
        : payload?.completed === false
          ? 0
          : payload?.completed === true
            ? quest.targetCount
            : Math.max(0, Math.min(quest.targetCount, quest.currentCount + 1));

    const nextCompleted = nextCount >= quest.targetCount;
    const justCompleted = nextCompleted && !quest.completed;

    await this.prisma.quest.update({
      where: { id: quest.id },
      data: {
        currentCount: nextCount,
        completed: nextCompleted,
        completedAt: nextCompleted ? quest.completedAt ?? new Date() : null,
        streakCount: quest.type === 'DAILY' && justCompleted ? quest.streakCount + 1 : quest.streakCount,
      },
    });

    if (justCompleted) {
      await this.awardXp({
        userId,
        amount: quest.xpReward,
        sourceType: quest.type === 'DAILY' ? 'DAILY_QUEST_COMPLETED' : 'WEEKLY_QUEST_COMPLETED',
        sourceId: quest.id,
        title: quest.title,
        description: quest.description ?? undefined,
        category: quest.category,
      });
    }

    return {
      page: await this.getGoalsPage(userId),
      reward: justCompleted
        ? {
            questXp: quest.xpReward,
            totalXp: quest.xpReward,
            title: quest.title,
          }
        : null,
    };
  }

  async createCustomQuest(userId: string, input?: CreateCustomQuestInput) {
    const title = input?.title?.trim();

    if (!title) {
      throw new NotFoundException('Quest title is required.');
    }

    const type = input?.type ?? 'DAILY';
    const createdQuest = await this.prisma.quest.create({
      data: {
        userId,
        title,
        description: input?.description?.trim() || null,
        type,
        category: input?.category ?? 'PRODUCTIVITY',
        difficulty: input?.difficulty ?? 'EASY',
        xpReward: input?.xpReward ?? (type === 'DAILY' ? 25 : 100),
        targetCount: Math.max(1, input?.targetCount ?? 1),
        currentCount: 0,
        streakCount: 0,
        isCustom: true,
        completed: false,
        periodStart: new Date(),
        resetsAt: type === 'DAILY' ? this.getNextDailyReset() : this.getNextWeeklyReset(),
        position: (await this.prisma.quest.count({ where: { userId, type } })) + 10,
      },
    });

    return {
      questId: createdQuest.id,
      ...(await this.getGoalsPage(userId)),
    };
  }

  async createCustomGoal(userId: string, input?: CreateCustomGoalInput) {
    const title = input?.title?.trim();

    if (!title) {
      throw new NotFoundException('Goal title is required.');
    }

    const existingGoal = await this.prisma.goal.findFirst({
      where: {
        userId,
        status: {
          in: ['ACTIVE', 'COMPLETED'],
        },
        title: {
          equals: title,
          mode: 'insensitive',
        },
      },
      select: { id: true },
    });

    if (existingGoal) {
      throw new NotFoundException('Goal already exists for this user.');
    }

    const milestones = (input?.milestones ?? []).filter((milestone) => milestone.title.trim().length > 0);
    const totalMilestoneXp = milestones.reduce((sum, milestone) => sum + (milestone.xpReward ?? 0), 0);
    const goalXpReward = Math.max(0, input?.goalXpReward ?? 0);

    const createdGoal = await this.prisma.$transaction(async (tx) => {
      const goal = await tx.goal.create({
        data: {
          userId,
          title,
          subtitle: input?.subtitle?.trim() || this.mapCategoryKeyToLabel((input?.category ?? 'productivity').toLowerCase()),
          description: null,
          category: this.mapCategoryKeyToLabel((input?.category ?? 'productivity').toLowerCase()),
          icon: input?.icon?.trim() || 'flag-outline',
          difficulty: input?.difficulty ?? 'MEDIUM',
          goalXpReward,
          totalXpReward: Math.max(goalXpReward + totalMilestoneXp, input?.totalXpReward ?? goalXpReward + totalMilestoneXp),
          status: 'ACTIVE',
          targetValue: milestones.length,
          currentValue: 0,
          percentLabel: '0 %',
          cardColor: input?.color?.trim() || '#A866FF',
        },
      });

      for (const [index, milestone] of milestones.entries()) {
        const createdMilestone = await tx.milestone.create({
          data: {
            goalId: goal.id,
            title: milestone.title.trim(),
            description: milestone.description?.trim() || null,
            xpReward: Math.max(0, milestone.xpReward ?? 0),
            position: index,
          },
        });

        const subtasks = (milestone.subtasks ?? []).map((subtask) => subtask.trim()).filter(Boolean);
        const tips = (milestone.tips ?? []).map((tip) => tip.trim()).filter(Boolean);

        if (subtasks.length > 0) {
          await tx.milestoneSubtask.createMany({
            data: subtasks.map((subtask, subtaskIndex) => ({
              milestoneId: createdMilestone.id,
              title: subtask,
              position: subtaskIndex,
            })),
          });
        }

        if (tips.length > 0) {
          await tx.milestoneTip.createMany({
            data: tips.map((tip, tipIndex) => ({
              milestoneId: createdMilestone.id,
              text: tip,
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
      message: 'Custom goal created.',
    };
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

  async getGoalTemplatePage(userId: string | undefined, category = 'popular'): Promise<GoalTemplatePageResponse> {
    const normalizedCategory = category.toLowerCase();
    const [templates, existingGoals] = await Promise.all([
      this.prisma.goalTemplate.findMany({
        where:
          normalizedCategory === 'popular'
            ? { isPopular: true }
            : { category: this.mapCategoryKeyToEnum(normalizedCategory) },
        include: {
          details: {
            orderBy: { position: 'asc' },
          },
          milestones: {
            include: {
              subtasks: {
                orderBy: { position: 'asc' },
              },
              tips: {
                orderBy: { position: 'asc' },
              },
            },
            orderBy: { position: 'asc' },
          },
          quests: {
            orderBy: { position: 'asc' },
          },
        },
        orderBy: [{ isPopular: 'desc' }, { position: 'asc' }],
      }),
      userId
        ? this.prisma.goal.findMany({
            where: {
              userId,
              status: {
                in: ['ACTIVE', 'COMPLETED'],
              },
            },
            select: {
              title: true,
              sourceTemplateId: true,
            },
          })
        : Promise.resolve([]),
    ]);
    const unavailableTemplateIds = new Set(
      existingGoals.flatMap((goal) => (goal.sourceTemplateId ? [goal.sourceTemplateId] : []))
    );
    const unavailableTemplateTitles = new Set(existingGoals.map((goal) => goal.title.trim().toLowerCase()));
    const availableTemplates = templates.filter(
      (template) =>
        !unavailableTemplateIds.has(template.id) &&
        !unavailableTemplateTitles.has(template.title.trim().toLowerCase())
    );

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
      templates: availableTemplates.map((template) => ({
        id: template.id,
        title: template.title,
        icon: template.icon,
        subtitle: template.subtitle,
        summaryDescription: template.summaryDescription,
        category: this.mapCategoryEnumToLabel(template.category),
        difficulty: template.difficulty,
        totalXpReward: template.totalXpReward,
        goalXpReward: template.goalXpReward,
        color: template.color,
        summaryDetails: [
          ...template.details
            .filter((detail) => this.isVisibleInSummary(detail.visibility))
            .map((detail) => ({
              id: detail.id,
              label: detail.label,
              value: this.mapDetailValue(detail.label, detail.value, template.milestones.length),
            })),
          {
            id: `${template.id}-xp`,
            label: 'XP',
            value: `${template.totalXpReward} XP`,
          },
        ],
        milestones: template.milestones.map((milestone) => ({
          id: milestone.id,
          title: milestone.title,
          xpReward: milestone.xpReward,
          subtasks: milestone.subtasks.map((subtask) => ({
            id: subtask.id,
            title: subtask.title,
          })),
          tips: milestone.tips.map((tip) => ({
            id: tip.id,
            text: tip.text,
          })),
        })),
        quests: template.quests.map((quest) => ({
          id: quest.id,
          title: quest.title,
          description: quest.description ?? undefined,
          frequency: quest.type,
          xpReward: quest.xpReward,
        })),
      })),
    };
  }

  async getGoalTemplateDetail(templateId: string): Promise<GoalTemplateDetailResponse> {
    const template = await this.prisma.goalTemplate.findUnique({
      where: { id: templateId },
      include: {
        details: {
          orderBy: { position: 'asc' },
        },
        milestones: {
          include: {
            subtasks: {
              orderBy: { position: 'asc' },
            },
            tips: {
              orderBy: { position: 'asc' },
            },
          },
          orderBy: { position: 'asc' },
        },
        quests: {
          orderBy: { position: 'asc' },
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
      difficulty: template.difficulty,
      totalXpReward: template.totalXpReward,
      goalXpReward: template.goalXpReward,
      color: template.color,
      summaryDetails: [
        ...template.details
          .filter((detail) => this.isVisibleInSummary(detail.visibility))
          .map((detail) => ({
            id: detail.id,
            label: detail.label,
            value: this.mapDetailValue(detail.label, detail.value, template.milestones.length),
          })),
        {
          id: `${template.id}-xp-summary`,
          label: 'Total XP',
          value: `${template.totalXpReward} XP`,
        },
      ],
      detailDetails: [
        ...template.details
          .filter((detail) => this.isVisibleInDetail(detail.visibility))
          .map((detail) => ({
            id: detail.id,
            label: detail.label,
            value: this.mapDetailValue(detail.label, detail.value, template.milestones.length),
          })),
        {
          id: `${template.id}-difficulty`,
          label: 'Svårighet',
          value: template.difficulty,
        },
        {
          id: `${template.id}-goal-bonus`,
          label: 'Goal-bonus',
          value: `${template.goalXpReward} XP`,
        },
      ],
      milestones: template.milestones.map((milestone) => ({
        id: milestone.id,
        title: milestone.title,
        description: milestone.description ?? undefined,
        xpReward: milestone.xpReward,
        subtasks: milestone.subtasks.map((subtask) => ({
          id: subtask.id,
          title: subtask.title,
        })),
        tips: milestone.tips.map((tip) => ({
          id: tip.id,
          text: tip.text,
        })),
      })),
      quests: template.quests.map((quest) => ({
        id: quest.id,
        title: quest.title,
        description: quest.description ?? undefined,
        frequency: quest.type,
        xpReward: quest.xpReward,
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
              orderBy: { position: 'asc' },
            },
            tips: {
              orderBy: { position: 'asc' },
            },
          },
          orderBy: { position: 'asc' },
        },
        quests: {
          orderBy: { position: 'asc' },
        },
      },
    });

    if (!template) {
      throw new NotFoundException('Goal template not found.');
    }

    const existingGoal = await this.prisma.goal.findFirst({
      where: {
        userId,
        status: {
          in: ['ACTIVE', 'COMPLETED'],
        },
        OR: [{ sourceTemplateId: template.id }, { title: template.title }],
      },
      select: { id: true },
    });

    if (existingGoal) {
      throw new NotFoundException('Goal template is already active or completed for this user.');
    }

    const sourceMilestones = input?.milestones?.length
      ? input.milestones
      : template.milestones.map((milestone) => ({
          title: milestone.title,
          description: milestone.description ?? undefined,
          xpReward: milestone.xpReward,
          subtasks: milestone.subtasks.map((subtask) => subtask.title),
          tips: milestone.tips.map((tip) => tip.text),
        }));

    const createdGoal = await this.prisma.$transaction(async (tx) => {
      const goal = await tx.goal.create({
        data: {
          userId,
          sourceTemplateId: template.id,
          title: input?.title?.trim() || template.title,
          subtitle: template.subtitle,
          description: template.detailDescription,
          category: this.mapCategoryEnumToLabel(template.category),
          icon: template.icon,
          difficulty: template.difficulty,
          goalXpReward: template.goalXpReward,
          totalXpReward: template.totalXpReward,
          status: 'ACTIVE',
          targetValue: sourceMilestones.length,
          currentValue: 0,
          percentLabel: '0 %',
          cardColor: template.color,
        },
      });

      for (const [index, milestone] of sourceMilestones.entries()) {
        const createdMilestone = await tx.milestone.create({
          data: {
            goalId: goal.id,
            title: milestone.title,
            description: milestone.description,
            xpReward: milestone.xpReward ?? template.milestones[index]?.xpReward ?? 50,
            position: index,
          },
        });

        const subtasks = milestone.subtasks?.length ? milestone.subtasks : [];
        const tips = milestone.tips?.length ? milestone.tips : [];

        if (subtasks.length > 0) {
          await tx.milestoneSubtask.createMany({
            data: subtasks.map((title, subtaskIndex) => ({
              milestoneId: createdMilestone.id,
              title,
              position: subtaskIndex,
            })),
          });
        }

        if (tips.length > 0) {
          await tx.milestoneTip.createMany({
            data: tips.map((text, tipIndex) => ({
              milestoneId: createdMilestone.id,
              text,
              position: tipIndex,
            })),
          });
        }
      }

      if (template.quests.length > 0) {
        const existingSharedKeys = new Set(
          (
            await tx.quest.findMany({
              where: {
                userId,
                sharedKey: {
                  not: null,
                },
              },
              select: { sharedKey: true },
            })
          )
            .map((quest) => quest.sharedKey)
            .filter((sharedKey): sharedKey is string => Boolean(sharedKey))
        );
        const dailyQuestCount = await tx.quest.count({
          where: { userId, type: 'DAILY' },
        });
        const weeklyQuestCount = await tx.quest.count({
          where: { userId, type: 'WEEKLY' },
        });
        let nextDailyPosition = dailyQuestCount + 1;
        let nextWeeklyPosition = weeklyQuestCount + 1;

        await tx.quest.createMany({
          data: template.quests
            .filter((quest) => !quest.sharedKey || !existingSharedKeys.has(quest.sharedKey))
            .map((quest) => {
            const position = quest.type === 'DAILY' ? nextDailyPosition++ : nextWeeklyPosition++;

            return {
              userId,
              goalId: goal.id,
              sharedKey: quest.sharedKey,
              title: quest.title,
              description: quest.description,
              type: quest.type,
              category: this.mapGoalTemplateCategoryToQuestCategory(template.category),
              difficulty: template.difficulty,
              xpReward: quest.xpReward,
              targetCount: 1,
              currentCount: 0,
              streakCount: 0,
              isCustom: false,
              completed: false,
              periodStart: new Date(),
              resetsAt: quest.type === 'DAILY' ? this.getNextDailyReset() : this.getNextWeeklyReset(),
              position,
            };
          }),
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

  private async refreshQuestStates(userId: string) {
    const quests = await this.prisma.quest.findMany({
      where: { userId },
    });

    const now = new Date();

    await Promise.all(
      quests.map(async (quest) => {
        if (!quest.resetsAt || quest.resetsAt > now) {
          return;
        }

        await this.prisma.quest.update({
          where: { id: quest.id },
          data: {
            currentCount: 0,
            completed: false,
            completedAt: null,
            periodStart: now,
            resetsAt: quest.type === 'DAILY' ? this.getNextDailyReset(now) : this.getNextWeeklyReset(now),
          },
        });
      })
    );
  }

  private async awardXp(input: {
    userId: string;
    amount: number;
    sourceType: string;
    sourceId?: string;
    title: string;
    description?: string;
    category?: string;
  }) {
    const gamificationServiceUrl = process.env.GAMIFICATION_SERVICE_URL ?? 'http://localhost:3004';

    await axios.post(`${gamificationServiceUrl}/profile-gamification/xp`, {
      userId: input.userId,
      amount: input.amount,
      sourceType: input.sourceType,
      sourceId: input.sourceId,
      title: input.title,
      description: input.description,
      category: input.category,
    });
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

  private mapCategoryKeyToLabel(category: string) {
    switch (category) {
      case 'job':
        return 'Jobb';
      case 'study':
        return 'Plugg';
      case 'training':
        return 'Träning';
      case 'health':
        return 'Hälsa';
      case 'finance':
        return 'Ekonomi';
      case 'relationship':
        return 'Relationer';
      default:
        return 'Produktivitet';
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

  private mapGoalTemplateCategoryToQuestCategory(category: GoalTemplateCategory): QuestCategory {
    switch (category) {
      case 'JOB':
        return 'CAREER';
      case 'STUDY':
        return 'PRODUCTIVITY';
      case 'TRAINING':
        return 'TRAINING';
      case 'HEALTH':
        return 'HEALTH';
      case 'FINANCE':
        return 'FINANCE';
      case 'RELATIONSHIP':
        return 'SOCIAL';
      default:
        return 'PRODUCTIVITY';
    }
  }

  private mapCategoryLabelToSkillCategory(label: string) {
    const normalized = label.toLowerCase();

    if (normalized.includes('träning')) {
      return 'TRAINING';
    }
    if (normalized.includes('hälsa')) {
      return 'HEALTH';
    }
    if (normalized.includes('mindfulness') || normalized.includes('balans')) {
      return 'MINDFULNESS';
    }
    if (normalized.includes('jobb') || normalized.includes('karri')) {
      return 'CAREER';
    }
    if (normalized.includes('relation')) {
      return 'SOCIAL';
    }
    if (normalized.includes('ekonomi')) {
      return 'FINANCE';
    }

    return 'PRODUCTIVITY';
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

  private toQuestCard(quest: Prisma.QuestGetPayload<Record<string, never>>): QuestCard {
    const progress = quest.targetCount > 0 ? Math.min(quest.currentCount / quest.targetCount, 1) : 0;

    return {
      id: quest.id,
      title: quest.title,
      description: quest.description ?? undefined,
      type: quest.type,
      category: this.mapQuestCategoryToLabel(quest.category),
      difficulty: quest.difficulty,
      xpReward: quest.xpReward,
      progress,
      progressLabel:
        quest.targetCount <= 1 ? (quest.completed ? 'Klar' : 'Pågår') : `${quest.currentCount} / ${quest.targetCount}`,
      completed: quest.completed,
      streakCount: quest.streakCount,
      color: CATEGORY_COLORS[quest.category] ?? '#A866FF',
    };
  }

  private toGoalCard(goal: GoalWithMilestones): GoalCard {
    const completedMilestones = goal.milestones.filter((milestone) => Boolean(milestone.completedAt)).length;
    const totalMilestones = goal.milestones.length;
    const earnedXp = goal.milestones
      .filter((milestone) => Boolean(milestone.completedAt))
      .reduce((sum, milestone) => sum + milestone.xpReward, 0);

    return {
      id: goal.id,
      icon: goal.icon ?? 'flag-outline',
      title: goal.title,
      subtitle: goal.subtitle ?? goal.category ?? '',
      difficulty: goal.difficulty,
      progress: this.getGoalProgress(goal),
      percentLabel: `${Math.round(this.getGoalProgress(goal) * 100)} %`,
      color: goal.cardColor ?? '#73D86A',
      leftMeta: totalMilestones > 0 ? `Steg ${completedMilestones} av ${totalMilestones}` : '',
      rightMeta: `${earnedXp} / ${goal.totalXpReward} XP`,
      totalXpReward: goal.totalXpReward,
      goalXpReward: goal.goalXpReward,
      milestones: goal.milestones.map((milestone) => ({
        id: milestone.id,
        title: milestone.title,
        description: milestone.description ?? undefined,
        xpReward: milestone.xpReward,
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

  private getGoalProgress(goal: GoalWithMilestones) {
    if (goal.milestones.length > 0) {
      const completedMilestones = goal.milestones.filter((milestone) => Boolean(milestone.completedAt)).length;
      return completedMilestones / goal.milestones.length;
    }

    const current = Number(goal.currentValue ?? 0);
    const target = Number(goal.targetValue ?? 0);

    if (target <= 0) {
      return 0;
    }

    return Math.min(current / target, 1);
  }

  private mapQuestCategoryToLabel(category: QuestCategory) {
    switch (category) {
      case 'TRAINING':
        return 'Träning';
      case 'HEALTH':
        return 'Hälsa';
      case 'PRODUCTIVITY':
        return 'Produktivitet';
      case 'MINDFULNESS':
        return 'Mindfulness';
      case 'CAREER':
        return 'Karriär';
      case 'CREATIVITY':
        return 'Kreativitet';
      case 'SOCIAL':
        return 'Socialt';
      case 'FINANCE':
        return 'Ekonomi';
      default:
        return 'Produktivitet';
    }
  }

  private formatDateLabel(date: Date) {
    return `Klart ${date.toLocaleDateString('sv-SE', {
      day: 'numeric',
      month: 'short',
    })}`;
  }

  private getNextDailyReset(baseDate = new Date()) {
    const next = new Date(baseDate);
    next.setDate(next.getDate() + 1);
    next.setHours(0, 0, 0, 0);
    return next;
  }

  private getNextWeeklyReset(baseDate = new Date()) {
    const next = new Date(baseDate);
    const day = next.getDay();
    const daysUntilMonday = ((8 - day) % 7) || 7;
    next.setDate(next.getDate() + daysUntilMonday);
    next.setHours(0, 0, 0, 0);
    return next;
  }
}
