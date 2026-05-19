import { GoalDifficulty, PrismaClient, QuestCategory, QuestType } from '../generated/client';
import { goalTemplateSeeds } from './seeds';

const prisma = new PrismaClient();
const demoUserId = 'demo-auth-user-1';

const dailyQuests = [
  {
    title: 'Drick 2L vatten',
    description: 'Håll vätskebalansen och bygg en enkel hälsovana.',
    category: 'HEALTH',
    difficulty: 'EASY',
    xpReward: 25,
    currentCount: 1,
    targetCount: 1,
    completed: true,
    streakCount: 5,
  },
  {
    title: 'Ta 8000 steg',
    description: 'Rör dig mer under dagen och håll kroppen igång.',
    category: 'TRAINING',
    difficulty: 'EASY',
    xpReward: 25,
    currentCount: 1,
    targetCount: 1,
    completed: true,
    streakCount: 3,
  },
  {
    title: 'Läs 10 minuter',
    description: 'Bygg en låg tröskel för fokus och lärande varje dag.',
    category: 'PRODUCTIVITY',
    difficulty: 'EASY',
    xpReward: 25,
    currentCount: 0,
    targetCount: 1,
    completed: false,
    streakCount: 0,
  },
  {
    title: 'Meditera 5 minuter',
    description: 'Skapa ett kort återhämtningsmoment och träna närvaro.',
    category: 'MINDFULNESS',
    difficulty: 'EASY',
    xpReward: 25,
    currentCount: 0,
    targetCount: 1,
    completed: false,
    streakCount: 2,
  },
] as const satisfies readonly {
  title: string;
  description: string;
  category: QuestCategory;
  difficulty: GoalDifficulty;
  xpReward: number;
  currentCount: number;
  targetCount: number;
  completed: boolean;
  streakCount: number;
}[];

const weeklyQuests = [
  {
    title: 'Träna 3 gånger denna vecka',
    description: 'Skapa kontinuitet i träningen med tre tydliga pass.',
    category: 'TRAINING',
    difficulty: 'MEDIUM',
    xpReward: 100,
    currentCount: 2,
    targetCount: 3,
    completed: false,
  },
  {
    title: 'Läs totalt 100 sidor',
    description: 'Bygg veckovolym i läsningen i stället för att bara tänka dag för dag.',
    category: 'PRODUCTIVITY',
    difficulty: 'MEDIUM',
    xpReward: 100,
    currentCount: 72,
    targetCount: 100,
    completed: false,
  },
  {
    title: 'Jobba 5 timmar på sidoprojekt',
    description: 'Gör långsiktig progression på något som betyder mycket för dig.',
    category: 'CAREER',
    difficulty: 'HARD',
    xpReward: 150,
    currentCount: 5,
    targetCount: 5,
    completed: true,
  },
] as const satisfies readonly {
  title: string;
  description: string;
  category: QuestCategory;
  difficulty: GoalDifficulty;
  xpReward: number;
  currentCount: number;
  targetCount: number;
  completed: boolean;
}[];

async function main() {
  await prisma.goalTemplateMilestoneSubtask.deleteMany();
  await prisma.goalTemplateMilestoneTip.deleteMany();
  await prisma.goalTemplateQuest.deleteMany();
  await prisma.goalTemplateMilestone.deleteMany();
  await prisma.goalTemplate.deleteMany();
  await prisma.quest.deleteMany({
    where: { userId: demoUserId },
  });
  await prisma.milestoneSubtask.deleteMany({
    where: {
      milestone: {
        goal: {
          userId: demoUserId,
        },
      },
    },
  });
  await prisma.milestoneTip.deleteMany({
    where: {
      milestone: {
        goal: {
          userId: demoUserId,
        },
      },
    },
  });
  await prisma.milestone.deleteMany({
    where: {
      goal: {
        userId: demoUserId,
      },
    },
  });
  await prisma.goal.deleteMany({
    where: { userId: demoUserId },
  });

  const seededGoals = [
    {
      title: 'Springa 5 km',
      subtitle: ['training'],
      icon: 'walk-outline',
      cardColor: '#73D86A',
      difficulty: 'MEDIUM' as GoalDifficulty,
      totalXpReward: 450,
      milestones: [
        { title: 'Spring 1 km utan paus', xpReward: 50, completedAt: new Date('2026-05-12') },
        { title: 'Spring 2 km i lugnt tempo', xpReward: 60, completedAt: new Date('2026-05-18') },
        { title: 'Spring 3 km sammanhängande', xpReward: 70, completedAt: new Date('2026-05-24') },
        { title: 'Spring 4 km med jämnt tempo', xpReward: 80 },
        { title: 'Spring 5 km utan att stanna', xpReward: 90 },
      ],
    },
    {
      title: 'Klara kursen i Matematik 2',
      subtitle: ['study'],
      icon: 'school-outline',
      cardColor: '#B269FF',
      difficulty: 'HARD' as GoalDifficulty,
      milestones: [
        { title: 'Skapa studieplan', xpReward: 40, completedAt: new Date('2026-05-10') },
        { title: 'Gå igenom kapitel 1–2', xpReward: 50, completedAt: new Date('2026-05-16') },
        { title: 'Göra uppgifter', xpReward: 70 },
        { title: 'Repetera inför tenta', xpReward: 80 },
        { title: 'Klara tentan', xpReward: 120 },
      ],
    },
    {
      title: 'Sluta med alkohol',
      subtitle: ['health'],
      icon: 'ban-outline',
      cardColor: '#F08A45',
      difficulty: 'HARD' as GoalDifficulty,
      milestones: [
        { title: 'Dag 1', xpReward: 40, completedAt: new Date('2026-05-01') },
        { title: 'Dag 3', xpReward: 60, completedAt: new Date('2026-05-03') },
        { title: 'Dag 7', xpReward: 80, completedAt: new Date('2026-05-07') },
        { title: 'Dag 10', xpReward: 90, completedAt: new Date('2026-05-10') },
        { title: 'Dag 14', xpReward: 120 },
      ],
      unit: 'days',
      streakDays: 12,
    },
    {
      title: 'Meditera varje dag',
      subtitle: ['mindfulness'],
      icon: 'leaf-outline',
      cardColor: '#5E8BFF',
      difficulty: 'MEDIUM' as GoalDifficulty,
      milestones: [
        { title: 'Dag 1', xpReward: 25, completedAt: new Date('2026-04-01') },
        { title: 'Dag 2', xpReward: 25, completedAt: new Date('2026-04-02') },
        { title: 'Dag 3', xpReward: 30, completedAt: new Date('2026-04-03') },
        { title: 'Dag 4', xpReward: 30, completedAt: new Date('2026-04-04') },
        { title: 'Dag 5', xpReward: 35, completedAt: new Date('2026-04-05') },
        { title: 'Dag 6', xpReward: 35, completedAt: new Date('2026-04-06') },
        { title: 'Dag 7', xpReward: 40, completedAt: new Date('2026-04-07') },
      ],
      completed: true,
    },
  ];

  for (const goalSeed of seededGoals) {
    const currentValue = goalSeed.milestones.filter((milestone) => milestone.completedAt).length;
    const targetValue = goalSeed.milestones.length;
    const milestoneXpRewards = goalSeed.milestones.map((milestone) => milestone.xpReward);
    const totalXpReward = goalSeed.totalXpReward ?? milestoneXpRewards.reduce((sum, value) => sum + value, 0);
    const goal = await prisma.goal.create({
      data: {
        userId: demoUserId,
        title: goalSeed.title,
        subtitle: goalSeed.subtitle,
        icon: goalSeed.icon,
        difficulty: goalSeed.difficulty,
        totalXpReward,
        status: goalSeed.completed ? 'COMPLETED' : 'ACTIVE',
        targetValue,
        currentValue,
        unit: goalSeed.unit,
        percentLabel: `${Math.round((currentValue / Math.max(targetValue, 1)) * 100)} %`,
        cardColor: goalSeed.cardColor,
        streakDays: goalSeed.streakDays,
        completedAt: goalSeed.completed ? new Date('2026-04-07') : null,
        completedXpGrantedAt: goalSeed.completed ? new Date('2026-04-07') : null,
      },
    });

    for (const [index, milestoneSeed] of goalSeed.milestones.entries()) {
      const milestone = await prisma.milestone.create({
        data: {
          goalId: goal.id,
          title: milestoneSeed.title,
          xpReward: milestoneSeed.xpReward,
          completedAt: milestoneSeed.completedAt,
          xpGrantedAt: milestoneSeed.completedAt ? milestoneSeed.completedAt : null,
          position: index,
        },
      });

      await prisma.milestoneSubtask.createMany({
        data: [`Steg för ${milestoneSeed.title}`].map((title, subtaskIndex) => ({
          milestoneId: milestone.id,
          title,
          completed: Boolean(milestoneSeed.completedAt),
          position: subtaskIndex,
        })),
      });

      await prisma.milestoneTip.createMany({
        data: [`Fokusera på ett tydligt steg i taget för ${milestoneSeed.title}.`].map((text, tipIndex) => ({
          milestoneId: milestone.id,
          text,
          position: tipIndex,
        })),
      });
    }
  }

  await prisma.quest.createMany({
    data: [
      ...dailyQuests.map((quest, index) => ({
        userId: demoUserId,
        type: 'DAILY' as QuestType,
        title: quest.title,
        description: quest.description,
        category: quest.category,
        difficulty: quest.difficulty,
        xpReward: quest.xpReward,
        currentCount: quest.currentCount,
        targetCount: quest.targetCount,
        streakCount: quest.streakCount,
        isCustom: false,
        completed: quest.completed,
        completedAt: quest.completed ? new Date('2026-05-18') : null,
        periodStart: new Date('2026-05-18'),
        resetsAt: new Date('2026-05-19'),
        position: index,
      })),
      ...weeklyQuests.map((quest, index) => ({
        userId: demoUserId,
        type: 'WEEKLY' as QuestType,
        title: quest.title,
        description: quest.description,
        category: quest.category,
        difficulty: quest.difficulty,
        xpReward: quest.xpReward,
        currentCount: quest.currentCount,
        targetCount: quest.targetCount,
        streakCount: 0,
        isCustom: false,
        completed: quest.completed,
        completedAt: quest.completed ? new Date('2026-05-18') : null,
        periodStart: new Date('2026-05-12'),
        resetsAt: new Date('2026-05-19'),
        position: index,
      })),
    ],
  });

  await prisma.goalTemplate.createMany({
    data: goalTemplateSeeds.map((template, index) => ({
      title: template.title,
      icon: template.icon,
      subtitle: template.subtitle,
      summaryDescription: template.summaryDescription,
      category: template.category,
      difficulty: template.difficulty,
      focusLabel: template.focusLabel ?? template.subtitle[0] ?? template.category.toLowerCase(),
      structureType:
        template.structureType ??
        (template.milestones.length <= 1 ? 'SINGLE' : 'MILESTONE_PATH'),
      totalXpReward: template.totalXpReward,
      color: template.color,
      isPopular: template.isPopular,
      position: index,
    })),
  });

  const templates = await prisma.goalTemplate.findMany();
  const byTitle = Object.fromEntries(templates.map((template) => [template.title, template.id]));

  await prisma.goalTemplateMilestone.createMany({
    data: goalTemplateSeeds.flatMap((template) =>
      template.milestones.map((milestone, index) => ({
        goalTemplateId: byTitle[template.title],
        title: milestone.title,
        description: milestone.description,
        xpReward: milestone.xpReward ?? 0,
        position: index,
      }))
    ),
  });

  const templateMilestones = await prisma.goalTemplateMilestone.findMany({
    include: {
      goalTemplate: true,
    },
    orderBy: [{ goalTemplateId: 'asc' }, { position: 'asc' }],
  });

  const templateMilestoneSeedMap = new Map(
    goalTemplateSeeds.flatMap((template) =>
      template.milestones.map((milestone) => [`${template.title}::${milestone.title}`, milestone] as const)
    )
  );

  await prisma.goalTemplateMilestoneSubtask.createMany({
    data: templateMilestones.flatMap((milestone) => {
      const seedMilestone = templateMilestoneSeedMap.get(`${milestone.goalTemplate.title}::${milestone.title}`);
      const subtasks = seedMilestone?.subtasks ?? [];

      return subtasks.map((title, index) => ({
        goalTemplateMilestoneId: milestone.id,
        title,
        position: index,
      }));
    }),
  });

  await prisma.goalTemplateMilestoneTip.createMany({
    data: templateMilestones.flatMap((milestone) => {
      const seedMilestone = templateMilestoneSeedMap.get(`${milestone.goalTemplate.title}::${milestone.title}`);
      const tips = seedMilestone?.tips ?? [];

      return tips.map((text, index) => ({
        goalTemplateMilestoneId: milestone.id,
        text,
        position: index,
      }));
    }),
  });

  await prisma.goalTemplateQuest.createMany({
    data: goalTemplateSeeds.flatMap((template) =>
      (template.quests ?? []).map((quest, index) => ({
        goalTemplateId: byTitle[template.title],
        title: quest.title,
        description: quest.description,
        xpReward: quest.xpReward ?? 0,
        type: quest.frequency,
        position: index,
      }))
    ),
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
