import { PrismaClient } from '../generated/client';
import { goalTemplateSeeds } from './seeds';

const prisma = new PrismaClient();
const demoUserId = 'demo-auth-user-1';

function buildDefaultSubtasks(title: string) {
  return [`Förbered: ${title}`, `Genomför: ${title}`, `Följ upp: ${title}`];
}

function buildDefaultTips(title: string) {
  return [
    `Boka in tid i kalendern för "${title}".`,
    `Bryt ner "${title}" i små steg om det känns stort.`,
  ];
}

async function main() {
  await prisma.goalTemplateMilestoneSubtask.deleteMany();
  await prisma.goalTemplateMilestoneTip.deleteMany();
  await prisma.goalTemplateDetail.deleteMany();
  await prisma.goalTemplateMilestone.deleteMany();
  await prisma.goalTemplate.deleteMany();
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

  await prisma.goal.createMany({
    data: [
      {
        userId: demoUserId,
        title: 'Springa 5 km',
        subtitle: 'Träning',
        icon: 'walk-outline',
        status: 'ACTIVE',
        targetValue: 5,
        currentValue: 3,
        percentLabel: '60 %',
        cardColor: '#73D86A',
      },
      {
        userId: demoUserId,
        title: 'Klara kursen i Matematik 2',
        subtitle: 'Plugg',
        icon: 'school-outline',
        status: 'ACTIVE',
        targetValue: 5,
        currentValue: 2,
        percentLabel: '40 %',
        cardColor: '#B269FF',
      },
      {
        userId: demoUserId,
        title: 'Sluta med alkohol',
        subtitle: 'Hälsa',
        icon: 'ban-outline',
        status: 'ACTIVE',
        targetValue: 10,
        currentValue: 8,
        unit: 'days',
        percentLabel: '80 %',
        cardColor: '#F08A45',
        streakDays: 7,
      },
      {
        userId: demoUserId,
        title: 'Meditera varje dag',
        subtitle: 'Balans',
        icon: 'leaf-outline',
        status: 'COMPLETED',
        targetValue: 7,
        currentValue: 7,
        percentLabel: '100 %',
        cardColor: '#5E8BFF',
      },
    ],
  });

  const runGoal = await prisma.goal.findFirstOrThrow({
    where: { userId: demoUserId, title: 'Springa 5 km' },
  });
  const mathGoal = await prisma.goal.findFirstOrThrow({
    where: { userId: demoUserId, title: 'Klara kursen i Matematik 2' },
  });
  const alcoholGoal = await prisma.goal.findFirstOrThrow({
    where: { userId: demoUserId, title: 'Sluta med alkohol' },
  });
  const meditationGoal = await prisma.goal.findFirstOrThrow({
    where: { userId: demoUserId, title: 'Meditera varje dag' },
  });

  await prisma.milestone.createMany({
    data: [
      {
        goalId: runGoal.id,
        title: 'Springa 1 km',
        completedAt: new Date('2026-05-12'),
        position: 0,
      },
      {
        goalId: runGoal.id,
        title: 'Springa 2 km',
        completedAt: new Date('2026-05-18'),
        position: 1,
      },
      {
        goalId: runGoal.id,
        title: 'Springa 3 km',
        completedAt: new Date('2026-05-24'),
        position: 2,
      },
      {
        goalId: runGoal.id,
        title: 'Springa 4 km',
        position: 3,
      },
      {
        goalId: runGoal.id,
        title: 'Springa 5 km',
        position: 4,
      },
      {
        goalId: mathGoal.id,
        title: 'Skapa studieplan',
        completedAt: new Date('2026-05-10'),
        position: 0,
      },
      {
        goalId: mathGoal.id,
        title: 'Gå igenom kapitel 1–2',
        completedAt: new Date('2026-05-16'),
        position: 1,
      },
      {
        goalId: mathGoal.id,
        title: 'Göra uppgifter',
        position: 2,
      },
      {
        goalId: mathGoal.id,
        title: 'Repetera inför tenta',
        position: 3,
      },
      {
        goalId: mathGoal.id,
        title: 'Klara tentan',
        position: 4,
      },
      {
        goalId: alcoholGoal.id,
        title: 'Dag 1',
        completedAt: new Date('2026-05-01'),
        position: 0,
      },
      {
        goalId: alcoholGoal.id,
        title: 'Dag 3',
        completedAt: new Date('2026-05-03'),
        position: 1,
      },
      {
        goalId: alcoholGoal.id,
        title: 'Dag 7',
        completedAt: new Date('2026-05-07'),
        position: 2,
      },
      {
        goalId: alcoholGoal.id,
        title: 'Dag 10',
        completedAt: new Date('2026-05-10'),
        position: 3,
      },
      {
        goalId: alcoholGoal.id,
        title: 'Dag 14',
        position: 4,
      },
      {
        goalId: meditationGoal.id,
        title: 'Dag 1',
        completedAt: new Date('2026-04-01'),
        position: 0,
      },
      {
        goalId: meditationGoal.id,
        title: 'Dag 2',
        completedAt: new Date('2026-04-02'),
        position: 1,
      },
      {
        goalId: meditationGoal.id,
        title: 'Dag 3',
        completedAt: new Date('2026-04-03'),
        position: 2,
      },
      {
        goalId: meditationGoal.id,
        title: 'Dag 4',
        completedAt: new Date('2026-04-04'),
        position: 3,
      },
      {
        goalId: meditationGoal.id,
        title: 'Dag 5',
        completedAt: new Date('2026-04-05'),
        position: 4,
      },
      {
        goalId: meditationGoal.id,
        title: 'Dag 6',
        completedAt: new Date('2026-04-06'),
        position: 5,
      },
      {
        goalId: meditationGoal.id,
        title: 'Dag 7',
        completedAt: new Date('2026-04-07'),
        position: 6,
      },
    ],
  });

  const demoMilestones = await prisma.milestone.findMany({
    where: {
      goal: {
        userId: demoUserId,
      },
    },
    orderBy: [{ goalId: 'asc' }, { position: 'asc' }],
  });

  await prisma.milestoneSubtask.createMany({
    data: demoMilestones.flatMap((milestone) =>
      buildDefaultSubtasks(milestone.title).map((title, index) => ({
        milestoneId: milestone.id,
        title,
        completed: Boolean(milestone.completedAt) && index === 0,
        position: index,
      }))
    ),
  });

  await prisma.milestoneTip.createMany({
    data: demoMilestones.flatMap((milestone) =>
      buildDefaultTips(milestone.title).map((text, index) => ({
        milestoneId: milestone.id,
        text,
        position: index,
      }))
    ),
  });

  await prisma.goalTemplate.createMany({
    data: goalTemplateSeeds.map((template, index) => ({
      title: template.title,
      icon: template.icon,
      subtitle: template.subtitle,
      summaryDescription: template.summaryDescription,
      detailDescription: template.detailDescription,
      category: template.category,
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
        position: index,
      }))
    ),
  });

  await prisma.goalTemplateDetail.createMany({
    data: goalTemplateSeeds.flatMap((template) =>
      template.details.map((detail, index) => ({
        goalTemplateId: byTitle[template.title],
        label: detail.label,
        value: detail.value,
        visibility: detail.visibility,
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
      template.milestones.map((milestone) => [
        `${template.title}::${milestone.title}`,
        milestone,
      ])
    )
  );

  await prisma.goalTemplateMilestoneSubtask.createMany({
    data: templateMilestones.flatMap((milestone) => {
      const seedMilestone = templateMilestoneSeedMap.get(`${milestone.goalTemplate.title}::${milestone.title}`);
      const subtasks = seedMilestone?.subtasks ?? buildDefaultSubtasks(milestone.title);

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
      const tips = seedMilestone?.tips ?? buildDefaultTips(milestone.title);

      return tips.map((text, index) => ({
        goalTemplateMilestoneId: milestone.id,
        text,
        position: index,
      }));
    }),
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
