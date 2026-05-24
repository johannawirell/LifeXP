import { Body, Controller, Delete, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { PrismaClient, SkillCategory, XpSourceType } from '../../generated/client';

const prisma = new PrismaClient();

const defaultFocusAreas = [
  { key: 'TRAINING', icon: 'barbell-outline', title: 'Träning', color: '#73D86A' },
  { key: 'HEALTH', icon: 'heart-outline', title: 'Hälsa', color: '#F5C13C' },
  { key: 'CAREER', icon: 'briefcase-outline', title: 'Jobb', color: '#6DA6FF' },
  { key: 'PRODUCTIVITY', icon: 'school-outline', title: 'Lärande', color: '#67AFFF' },
  { key: 'SOCIAL', icon: 'people-outline', title: 'Relationer', color: '#FF7EA8' },
  { key: 'FINANCE', icon: 'wallet-outline', title: 'Ekonomi', color: '#56D2C5' },
] as const;

const goalAchievementCodeByTitle: Record<string, string[]> = {
  'springa 5 km': ['five-k-runner'],
  'springa 10 km': ['distance-runner'],
  'springa halvmaraton': ['half-marathoner'],
  'springa maraton': ['marathoner'],
  'börja gymma regelbundet': ['gym-routine'],
  'klara 10 armhävningar': ['pushup-starter'],
};

type AwardXpInput = {
  userId: string;
  amount: number;
  sourceType: XpSourceType;
  sourceId?: string;
  title: string;
  description?: string;
  category?: SkillCategory;
};

@Controller('profile-gamification')
export class ProfileGamificationController {
  @Post('provision')
  async provisionGamification(@Body() body: { userId: string }) {
    return this.ensureProfile(body.userId);
  }

  @Post('xp')
  async awardXp(@Body() body: AwardXpInput) {
    const profile = await this.ensureProfile(body.userId);
    const streakMultiplier = profile.currentStreak >= 7 ? 1.1 : 1;
    const finalAmount = Math.round(body.amount * streakMultiplier);
    const totalXp = profile.totalXp + finalAmount;
    const currentLevel = this.getLevelForXp(totalXp);
    const nextLevelXp = this.getXpForLevel(currentLevel + 1);
    const updatedStreak = this.getUpdatedStreak(profile.lastActivityAt, profile.currentStreak);
    const unlockedAchievements = await this.resolveAchievements({
      userGamificationId: profile.id,
      totalXp,
      currentLevel,
      currentStreak: updatedStreak.currentStreak,
      bestStreak: Math.max(profile.bestStreak, updatedStreak.currentStreak),
    });

    await prisma.userGamification.update({
      where: { id: profile.id },
      data: {
        totalXp,
        currentLevel,
        nextLevelXp,
        currentStreak: updatedStreak.currentStreak,
        bestStreak: Math.max(profile.bestStreak, updatedStreak.currentStreak),
        lastActivityAt: updatedStreak.lastActivityAt,
        xpEntries: {
          create: {
            amount: finalAmount,
            sourceType: body.sourceType,
            sourceId: body.sourceId,
            title: body.title,
            description: body.description,
            category: body.category,
            multiplier: streakMultiplier,
          },
        },
      },
    });

    if (body.category) {
      await this.updateFocusArea(profile.id, body.category, finalAmount);
    }

    for (const achievement of unlockedAchievements) {
      await prisma.userAchievement.create({
        data: {
          userGamificationId: profile.id,
          achievementDefinitionId: achievement.id,
          subtitle: achievement.description ?? '',
          color: achievement.color ?? '#A866FF',
          icon: achievement.icon ?? 'trophy-outline',
          position: await prisma.userAchievement.count({
            where: {
              userGamificationId: profile.id,
            },
          }),
        },
      });
    }

    return this.getGamification(body.userId);
  }

  @Post('goal-achievements')
  async awardGoalAchievements(@Body() body: { userId: string; goalTitle: string }) {
    const profile = await this.ensureProfile(body.userId);
    const normalizedTitle = body.goalTitle.trim().toLowerCase();
    const definitionCodes = goalAchievementCodeByTitle[normalizedTitle] ?? [];

    if (definitionCodes.length === 0) {
      return this.getGamification(body.userId);
    }

    const definitions = await prisma.achievementDefinition.findMany({
      where: {
        code: {
          in: definitionCodes,
        },
      },
    });
    const existingAwards = await prisma.userAchievement.findMany({
      where: {
        userGamificationId: profile.id,
        achievementDefinitionId: {
          in: definitions.map((definition) => definition.id),
        },
      },
      select: {
        achievementDefinitionId: true,
      },
    });
    const existingDefinitionIds = new Set(existingAwards.map((award) => award.achievementDefinitionId));

    for (const definition of definitions) {
      if (existingDefinitionIds.has(definition.id)) {
        continue;
      }

      await prisma.userAchievement.create({
        data: {
          userGamificationId: profile.id,
          achievementDefinitionId: definition.id,
          subtitle: definition.description ?? '',
          color: definition.color ?? '#A866FF',
          icon: definition.icon ?? 'trophy-outline',
          position: await prisma.userAchievement.count({
            where: {
              userGamificationId: profile.id,
            },
          }),
        },
      });
    }

    return this.getGamification(body.userId);
  }

  @Post(':userId/focus-areas')
  async updateFocusAreas(
    @Param('userId') userId: string,
    @Body() body: { selectedKeys?: string[] }
  ) {
    const record = await this.ensureProfile(userId);
    const selectedKeys = this.normalizeSelectedFocusKeys(body.selectedKeys);

    await prisma.focusArea.updateMany({
      where: {
        userGamificationId: record.id,
      },
      data: {
        isSelected: false,
      },
    });

    await prisma.focusArea.updateMany({
      where: {
        userGamificationId: record.id,
        key: {
          in: selectedKeys,
        },
      },
      data: {
        isSelected: true,
      },
    });

    return this.getGamification(userId);
  }

  @Get(':userId')
  async getGamification(@Param('userId') userId: string) {
    let record = await prisma.userGamification.findUnique({
      where: { userId },
      include: {
        focusAreas: {
          orderBy: { position: 'asc' },
        },
        achievements: {
          orderBy: { position: 'asc' },
          include: {
            achievementDefinition: true,
          },
        },
        xpEntries: {
          orderBy: { createdAt: 'desc' },
          take: 6,
        },
      },
    });

    if (!record) {
      throw new NotFoundException('No gamification profile found');
    }

    const managedKeys = new Set<SkillCategory>(defaultFocusAreas.map((area) => area.key));
    if (record.focusAreas.filter((area) => managedKeys.has(area.key)).length < defaultFocusAreas.length) {
      await this.backfillDefaultFocusAreas(record.id, record.focusAreas);
      record = await prisma.userGamification.findUnique({
        where: { userId },
        include: {
          focusAreas: {
            orderBy: { position: 'asc' },
          },
          achievements: {
            orderBy: { position: 'asc' },
            include: {
              achievementDefinition: true,
            },
          },
          xpEntries: {
            orderBy: { createdAt: 'desc' },
            take: 6,
          },
        },
      });
    }

    if (!record) {
      throw new NotFoundException('No gamification profile found');
    }

    const managedFocusAreas = defaultFocusAreas
      .map((definition) => record.focusAreas.find((area) => area.key === definition.key))
      .filter(
        (
          area
        ): area is (typeof record.focusAreas)[number] => Boolean(area)
      );
    const selectedFocusAreas = managedFocusAreas.filter((area) => area.isSelected);
    const activeFocusAreas = selectedFocusAreas.length > 0 ? selectedFocusAreas : managedFocusAreas;
    const derivedTotalXp = activeFocusAreas.reduce((sum, area) => sum + area.currentXp, 0);
    const derivedLevel = this.getLevelForXp(derivedTotalXp);
    const derivedNextLevelXp = this.getXpForLevel(derivedLevel + 1);
    const currentLevelFloor = this.getXpForLevel(derivedLevel);
    const levelSpan = Math.max(derivedNextLevelXp - currentLevelFloor, 1);
    const levelProgress = Math.min(
      Math.max((derivedTotalXp - currentLevelFloor) / levelSpan, 0),
      1
    );

    return {
      currentLevel: derivedLevel,
      totalXp: derivedTotalXp,
      nextLevelXp: derivedNextLevelXp,
      xpToNextLevel: Math.max(derivedNextLevelXp - derivedTotalXp, 0),
      levelProgress,
      currentStreak: record.currentStreak,
      bestStreak: record.bestStreak,
      headline: record.headline,
      currentLevelReward: await prisma.levelReward.findUnique({
        where: {
          level: derivedLevel,
        },
      }),
      focusAreas: managedFocusAreas.map((area) => ({
        id: area.id,
        key: area.key,
        icon: area.icon,
        title: area.title,
        isSelected: area.isSelected,
        level: area.level,
        currentXp: area.currentXp,
        maxXp: area.maxXp,
        color: area.color,
      })),
      achievements: record.achievements.map((achievement) => ({
        id: achievement.id,
        icon: achievement.icon ?? achievement.achievementDefinition.icon ?? 'trophy-outline',
        title: achievement.achievementDefinition.title,
        subtitle: achievement.subtitle ?? achievement.achievementDefinition.description ?? '',
        color: achievement.color ?? achievement.achievementDefinition.color ?? '#A866FF',
        rarity: achievement.achievementDefinition.rarity,
      })),
      recentXp: record.xpEntries.map((entry) => ({
        id: entry.id,
        amount: entry.amount,
        title: entry.title,
        description: entry.description ?? '',
        category: entry.category,
        multiplier: entry.multiplier,
        createdAt: entry.createdAt,
      })),
    };
  }

  @Delete(':userId')
  async deleteGamification(@Param('userId') userId: string) {
    await prisma.userGamification.deleteMany({
      where: {
        userId,
      },
    });

    return { success: true };
  }

  private async ensureProfile(userId: string) {
    const existing = await prisma.userGamification.findUnique({
      where: {
        userId,
      },
    });

    if (existing) {
      return existing;
    }

    return prisma.userGamification.create({
      data: {
        userId,
        totalXp: 0,
        currentLevel: 1,
        currentStreak: 0,
        bestStreak: 0,
        nextLevelXp: this.getXpForLevel(2),
        lastActivityAt: null,
        headline: 'Ny i appen • Din karaktär börjar på level 1',
        focusAreas: {
          create: defaultFocusAreas.map((area, index) => ({
            ...area,
            isSelected: true,
            level: 1,
            currentXp: 0,
            maxXp: 100,
            position: index,
          })),
        },
      },
    });
  }

  private async backfillDefaultFocusAreas(
    userGamificationId: string,
    existingAreas: { key: SkillCategory; isSelected?: boolean }[]
  ) {
    const existingKeys = new Set(existingAreas.map((area) => area.key));
    const missingAreas = defaultFocusAreas.filter((area) => !existingKeys.has(area.key));

    if (missingAreas.length === 0) {
      return;
    }

    await prisma.focusArea.createMany({
      data: missingAreas.map((area, index) => ({
        userGamificationId,
        key: area.key,
        icon: area.icon,
        title: area.title,
        isSelected: true,
        level: 1,
        currentXp: 0,
        maxXp: 100,
        color: area.color,
        position: existingAreas.length + index,
      })),
    });
  }

  private normalizeSelectedFocusKeys(selectedKeys: string[] | undefined) {
    const fallback = defaultFocusAreas.map((area) => area.key);
    if (!selectedKeys || selectedKeys.length === 0) {
      return fallback;
    }

    const keyMap: Record<string, SkillCategory> = {
      training: 'TRAINING',
      health: 'HEALTH',
      job: 'CAREER',
      learning: 'PRODUCTIVITY',
      social: 'SOCIAL',
      finance: 'FINANCE',
    };

    const mapped = selectedKeys
      .map((key) => keyMap[key.toLowerCase()])
      .filter(Boolean);

    return mapped.length > 0 ? mapped : fallback;
  }

  private getXpForLevel(level: number) {
    if (level <= 1) {
      return 0;
    }

    return Math.round(75 * Math.pow(level, 1.45));
  }

  private getLevelForXp(totalXp: number) {
    let level = 1;

    while (this.getXpForLevel(level + 1) <= totalXp) {
      level += 1;
    }

    return level;
  }

  private getUpdatedStreak(lastActivityAt: Date | null, currentStreak: number) {
    const now = new Date();

    if (!lastActivityAt) {
      return {
        currentStreak: 1,
        lastActivityAt: now,
      };
    }

    const previous = new Date(lastActivityAt);
    previous.setHours(0, 0, 0, 0);
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const diffInDays = Math.round((today.getTime() - previous.getTime()) / 86400000);

    if (diffInDays <= 0) {
      return {
        currentStreak,
        lastActivityAt: lastActivityAt,
      };
    }

    if (diffInDays === 1) {
      return {
        currentStreak: currentStreak + 1,
        lastActivityAt: now,
      };
    }

    return {
      currentStreak: 1,
      lastActivityAt: now,
    };
  }

  private async updateFocusArea(userGamificationId: string, category: SkillCategory, amount: number) {
    const focusArea = await prisma.focusArea.findFirst({
      where: {
        userGamificationId,
        key: category,
      },
    });

    if (!focusArea) {
      return;
    }

    const currentXp = focusArea.currentXp + amount;
    const level = Math.max(1, Math.floor(currentXp / 100) + 1);
    const maxXp = level * 100;

    await prisma.focusArea.update({
      where: { id: focusArea.id },
      data: {
        currentXp,
        level,
        maxXp,
      },
    });
  }

  private async resolveAchievements(input: {
    userGamificationId: string;
    totalXp: number;
    currentLevel: number;
    currentStreak: number;
    bestStreak: number;
  }) {
    const definitions = await prisma.achievementDefinition.findMany();
    const existingAwards = await prisma.userAchievement.findMany({
      where: {
        userGamificationId: input.userGamificationId,
      },
      select: {
        achievementDefinitionId: true,
      },
    });
    const awardedIds = new Set(existingAwards.map((award) => award.achievementDefinitionId));

    return definitions.filter((definition) => {
      if (awardedIds.has(definition.id)) {
        return false;
      }

      if (definition.code === 'seven-day-streak') {
        return input.currentStreak >= 7 || input.bestStreak >= 7;
      }

      if (definition.code === 'disciplined') {
        return input.bestStreak >= 30;
      }

      if (definition.code === 'main-quest-energy') {
        return input.totalXp >= 3000;
      }

      if (definition.code === 'focus-master') {
        return input.currentLevel >= 10;
      }

      if (definition.code === 'goal-hunter') {
        return input.totalXp >= 2000;
      }

      return false;
    });
  }
}
