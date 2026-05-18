import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSession } from '@/context/session-context';
import { deleteJson, fetchJson, patchJson, postJson } from '@/lib/api';

type QuestCard = {
  id: string;
  title: string;
  description?: string;
  type: 'DAILY' | 'WEEKLY';
  category: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EPIC';
  xpReward: number;
  progress: number;
  progressLabel: string;
  completed: boolean;
  streakCount: number;
  color: string;
};

type GoalCard = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EPIC';
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
  overview: {
    activeGoals: number;
    averageProgress: string;
    completedMilestones: number;
    streakDays: number;
    totalQuestXp: number;
  };
  dailyQuests: QuestCard[];
  weeklyQuests: QuestCard[];
  activeGoals: GoalCard[];
  completedGoals: GoalCard[];
};

type GoalTab = 'active' | 'completed';

const overviewItems = [
  { key: 'activeGoals', label: 'Aktiva mål', icon: 'flag-outline', color: '#A866FF' },
  { key: 'averageProgress', label: 'Snitt. framsteg', icon: 'stats-chart-outline', color: '#67D86F' },
  { key: 'completedMilestones', label: 'Milestones klara', icon: 'checkmark-circle-outline', color: '#F5C13C' },
  { key: 'streakDays', label: 'Dagar i streak', icon: 'flame-outline', color: '#F08A45' },
  { key: 'totalQuestXp', label: 'Quest XP', icon: 'sparkles-outline', color: '#5E8BFF' },
] as const;

export default function GoalsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ goalId?: string | string[]; tab?: string | string[] }>();
  const { userId, resetSession } = useSession();
  const [goalsPage, setGoalsPage] = useState<GoalsPageResponse | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<GoalCard | null>(null);
  const [expandedMilestoneId, setExpandedMilestoneId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGoalDetailLoading, setIsGoalDetailLoading] = useState(false);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [isCreateQuestVisible, setIsCreateQuestVisible] = useState(false);
  const [questTitle, setQuestTitle] = useState('');
  const [questDescription, setQuestDescription] = useState('');
  const [selectedTab, setSelectedTab] = useState<GoalTab>('active');
  const routeGoalId = Array.isArray(params.goalId) ? params.goalId[0] : params.goalId;
  const routeTab = Array.isArray(params.tab) ? params.tab[0] : params.tab;

  const loadGoals = useCallback(async () => {
    if (!userId) {
      setGoalsPage(null);
      setError('Ingen användare vald.');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchJson<GoalsPageResponse>(`/goals/${userId}`);
      setGoalsPage(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const loadGoalDetail = useCallback(
    async (goalId: string) => {
      if (!userId) {
        return;
      }

      try {
        setIsGoalDetailLoading(true);
        const data = await fetchJson<GoalCard>(`/goals/${userId}/detail/${goalId}`);
        setSelectedGoal(data);
        setExpandedMilestoneId(null);
      } catch (loadError) {
        setSelectedGoal(null);
        setExpandedMilestoneId(null);

        if (routeGoalId === goalId || routeTab) {
          router.replace('/goals');
          void loadGoals();
          return;
        }

        setError(loadError instanceof Error ? loadError.message : 'Unknown error');
      } finally {
        setIsGoalDetailLoading(false);
      }
    },
    [loadGoals, routeGoalId, routeTab, router, userId]
  );

  const closeGoalDetail = () => {
    setSelectedGoal(null);
    setExpandedMilestoneId(null);

    if (routeGoalId || routeTab) {
      router.replace({
        pathname: '/goals',
        params: routeTab === 'completed' ? { tab: 'completed' } : {},
      });
    }
  };

  const toggleSubtask = async (subtaskId: string, completed: boolean) => {
    if (!userId || !selectedGoal) {
      return;
    }

    try {
      const data = await patchJson<GoalsPageResponse>(`/goals/${userId}/subtasks/${subtaskId}`, {
        completed,
      });
      setGoalsPage(data);
      const nextGoalList = [...data.activeGoals, ...data.completedGoals];
      const refreshedGoal = nextGoalList.find((goal) => goal.id === selectedGoal.id) ?? null;
      setSelectedGoal(refreshedGoal);
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : 'Unknown error');
    }
  };

  const updateQuest = async (quest: QuestCard) => {
    if (!userId) {
      return;
    }

    try {
      const data = await patchJson<GoalsPageResponse>(`/goals/${userId}/quests/${quest.id}`, {
        completed: quest.type === 'DAILY' ? !quest.completed : undefined,
        incrementBy: quest.type === 'WEEKLY' && !quest.completed ? 1 : undefined,
      });
      setGoalsPage(data);
    } catch (questError) {
      setError(questError instanceof Error ? questError.message : 'Unknown error');
    }
  };

  const createCustomQuest = async () => {
    if (!userId || !questTitle.trim()) {
      return;
    }

    try {
      const data = await postJson<GoalsPageResponse>(`/goals/${userId}/quests`, {
        title: questTitle,
        description: questDescription,
        type: 'DAILY',
        category: 'PRODUCTIVITY',
        difficulty: 'EASY',
        xpReward: 25,
        targetCount: 1,
      });
      setGoalsPage(data);
      setQuestTitle('');
      setQuestDescription('');
      setIsCreateQuestVisible(false);
    } catch (questError) {
      setError(questError instanceof Error ? questError.message : 'Unknown error');
    }
  };

  const confirmDeleteGoal = () => {
    if (!selectedGoal) {
      return;
    }

    setIsDeleteConfirmVisible(true);
  };

  const deleteGoal = async (goalId: string) => {
    if (!userId) {
      return;
    }

    try {
      setIsDeleteConfirmVisible(false);
      const data = await deleteJson<GoalsPageResponse>(`/goals/${userId}/${goalId}`);
      setGoalsPage(data);
      closeGoalDetail();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unknown error');
    }
  };

  useEffect(() => {
    void loadGoals();
  }, [loadGoals]);

  useEffect(() => {
    if (routeTab === 'completed') {
      setSelectedTab('completed');
      return;
    }

    if (routeTab === 'active') {
      setSelectedTab('active');
    }
  }, [routeTab]);

  useEffect(() => {
    if (!goalsPage || !routeGoalId || isGoalDetailLoading || selectedGoal?.id === routeGoalId) {
      return;
    }

    void loadGoalDetail(routeGoalId);
  }, [goalsPage, isGoalDetailLoading, loadGoalDetail, routeGoalId, selectedGoal?.id]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.feedbackState}>
          <ActivityIndicator size="large" color="#A866FF" />
          <Text style={styles.feedbackText}>Hämtar mål och quests...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !goalsPage) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.feedbackState}>
          <Ionicons name="cloud-offline-outline" size={42} color="#A866FF" />
          <Text style={styles.feedbackTitle}>Mål kunde inte hämtas</Text>
          <Text style={styles.feedbackText}>
            Kontrollera att `goals-service` och `api-gateway` kör och att databasen är seedad.
          </Text>
          <Text style={styles.feedbackError}>{error ?? 'Ingen måldata hittades.'}</Text>
          <Pressable onPress={() => void loadGoals()} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Försök igen</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const goalCards = selectedTab === 'active' ? goalsPage.activeGoals : goalsPage.completedGoals;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Text style={styles.screenTitle}>Mina mål</Text>
          <Pressable style={styles.addButton} onPress={() => router.push('/create-goal')}>
            <Ionicons name="add" size={28} color="#F7F3FF" />
          </Pressable>
        </View>

        <View style={styles.tabRow}>
          <Pressable style={styles.tabButton} onPress={() => setSelectedTab('active')}>
            <Text style={[styles.tabText, selectedTab === 'active' ? styles.tabTextActive : null]}>Aktiva</Text>
            <View style={[styles.tabIndicator, selectedTab === 'active' ? styles.tabIndicatorActive : null]} />
          </Pressable>
          <Pressable style={styles.tabButton} onPress={() => setSelectedTab('completed')}>
            <Text style={[styles.tabText, selectedTab === 'completed' ? styles.tabTextActive : null]}>Avslutade</Text>
            <View style={[styles.tabIndicator, selectedTab === 'completed' ? styles.tabIndicatorActive : null]} />
          </Pressable>
        </View>

        {selectedTab === 'active' ? (
          <>
            <Text style={styles.sectionTitle}>Översikt</Text>
            <View style={styles.overviewCard}>
              {overviewItems.map((item) => (
                <View key={item.key} style={styles.overviewItem}>
                  <Ionicons name={item.icon} size={22} color={item.color} />
                  <Text style={styles.overviewValue}>{String(goalsPage.overview[item.key])}</Text>
                  <Text style={styles.overviewLabel}>{item.label}</Text>
                </View>
              ))}
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Daily quests</Text>
              <Pressable onPress={() => setIsCreateQuestVisible(true)} style={styles.smallActionButton}>
                <Ionicons name="add" size={18} color="#F7F3FF" />
              </Pressable>
            </View>
            {goalsPage.dailyQuests.map((quest) => (
              <Pressable
                key={quest.id}
                style={[styles.questCard, quest.completed ? styles.questCardCompleted : null]}
                onPress={() => void updateQuest(quest)}>
                <View style={styles.questHeader}>
                  <View style={[styles.questIconWrap, { backgroundColor: `${quest.color}22` }]}>
                    <Ionicons
                      name={quest.completed ? 'checkmark-circle' : 'ellipse-outline'}
                      size={22}
                      color={quest.color}
                    />
                  </View>
                  <View style={styles.questInfo}>
                    <Text style={styles.questTitle}>{quest.title}</Text>
                    <Text style={styles.questDescription}>{quest.description}</Text>
                    <View style={styles.questMetaRow}>
                      <Text style={styles.questMeta}>{quest.category}</Text>
                      <Text style={styles.questMeta}>{quest.progressLabel}</Text>
                      <Text style={styles.questMeta}>+{quest.xpReward} XP</Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}

            <Text style={styles.sectionTitle}>Weekly quests</Text>
            {goalsPage.weeklyQuests.map((quest) => (
              <Pressable
                key={quest.id}
                style={[styles.questCard, quest.completed ? styles.questCardCompleted : null]}
                onPress={() => void updateQuest(quest)}>
                <View style={styles.questHeader}>
                  <View style={[styles.questIconWrap, { backgroundColor: `${quest.color}22` }]}>
                    <Ionicons
                      name={quest.completed ? 'checkmark-circle' : 'timer-outline'}
                      size={22}
                      color={quest.color}
                    />
                  </View>
                  <View style={styles.questInfo}>
                    <Text style={styles.questTitle}>{quest.title}</Text>
                    <Text style={styles.questDescription}>{quest.description}</Text>
                    <View style={styles.progressTrack}>
                      <View
                        style={[
                          styles.progressFill,
                          { backgroundColor: quest.color, width: `${Math.min(quest.progress * 100, 100)}%` },
                        ]}
                      />
                    </View>
                    <View style={styles.questMetaRow}>
                      <Text style={styles.questMeta}>{quest.progressLabel}</Text>
                      <Text style={styles.questMeta}>{quest.difficulty}</Text>
                      <Text style={styles.questMeta}>+{quest.xpReward} XP</Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </>
        ) : null}

        {goalCards.length === 0 ? (
          <View style={styles.emptyGoalsCard}>
            <Ionicons name="flag-outline" size={32} color="#A866FF" />
            <Text style={styles.emptyGoalsTitle}>
              {selectedTab === 'active' ? 'Inga mål ännu' : 'Inga avslutade mål ännu'}
            </Text>
            <Text style={styles.emptyGoalsText}>
              {selectedTab === 'active'
                ? 'Din karaktär har inte fått sina första main quests än. Skapa ett mål och börja samla XP.'
                : 'Fortsätt jaga dina goals. När du slutför dem hamnar de här som troféer över vad du faktiskt byggt upp.'}
            </Text>
            {selectedTab === 'active' ? (
              <Pressable onPress={resetSession} style={styles.emptyGoalsButton}>
                <Text style={styles.emptyGoalsButtonText}>Byt läge</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}

        {goalCards.map((goal) => (
          <Pressable key={goal.id} style={styles.goalCard} onPress={() => void loadGoalDetail(goal.id)}>
            <View style={styles.goalHeader}>
              <View style={[styles.goalIconWrap, { backgroundColor: `${goal.color}22` }]}>
                <Ionicons name={goal.icon} size={30} color={goal.color} />
              </View>
              <View style={styles.goalHeaderText}>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <Text style={styles.goalSubtitle}>{goal.subtitle}</Text>
                <Text style={styles.goalDifficulty}>{goal.difficulty} • {goal.totalXpReward} XP</Text>
              </View>
              <Text style={styles.goalPercent}>{goal.percentLabel}</Text>
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { backgroundColor: goal.color, width: `${Math.min(goal.progress * 100, 100)}%` },
                ]}
              />
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaText}>{goal.leftMeta}</Text>
              <Text style={styles.metaText}>{goal.rightMeta}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <Modal visible={Boolean(selectedGoal) || isGoalDetailLoading} animationType="slide" transparent onRequestClose={closeGoalDetail}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedGoal?.title ?? 'Mål'}</Text>
              <View style={styles.modalActions}>
                {selectedGoal ? (
                  <Pressable onPress={confirmDeleteGoal} style={styles.iconActionButton}>
                    <Ionicons name="trash-outline" size={20} color="#C9A9FF" />
                  </Pressable>
                ) : null}
                <Pressable onPress={closeGoalDetail} style={styles.iconActionButton}>
                  <Ionicons name="close" size={22} color="#F5F7FB" />
                </Pressable>
              </View>
            </View>

            {isGoalDetailLoading || !selectedGoal ? (
              <View style={styles.feedbackState}>
                <ActivityIndicator size="large" color="#A866FF" />
                <Text style={styles.feedbackText}>Hämtar målinfo...</Text>
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.goalDetailHero}>
                  <Text style={styles.goalDetailSubtitle}>
                    {selectedGoal.subtitle} • {selectedGoal.difficulty}
                  </Text>
                  <Text style={styles.goalDetailPercent}>{selectedGoal.percentLabel}</Text>
                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        { backgroundColor: selectedGoal.color, width: `${Math.min(selectedGoal.progress * 100, 100)}%` },
                      ]}
                    />
                  </View>
                  <View style={styles.detailStatsRow}>
                    <Text style={styles.detailStat}>{selectedGoal.totalXpReward} XP totalt</Text>
                    <Text style={styles.detailStat}>Bonus: {selectedGoal.goalXpReward} XP</Text>
                  </View>
                </View>

                {selectedGoal.milestones.map((milestone) => {
                  const isExpanded = expandedMilestoneId === milestone.id;

                  return (
                    <View key={milestone.id} style={styles.milestoneCard}>
                      <Pressable
                        onPress={() => setExpandedMilestoneId(isExpanded ? null : milestone.id)}
                        style={styles.milestoneHeader}>
                        <View style={styles.milestoneHeaderLeft}>
                          <Ionicons
                            name={milestone.completed ? 'checkmark-circle' : 'ellipse-outline'}
                            size={24}
                            color={milestone.completed ? '#73D86A' : '#A8B0BC'}
                          />
                          <View style={styles.milestoneTextWrap}>
                            <Text style={styles.milestoneTitle}>{milestone.title}</Text>
                            <Text style={styles.milestoneLabel}>
                              {milestone.completedLabel ?? `${milestone.xpReward} XP när du klarar den`}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.milestoneBadge}>
                          <Text style={styles.milestoneBadgeText}>+{milestone.xpReward}</Text>
                        </View>
                      </Pressable>

                      {isExpanded ? (
                        <View style={styles.milestoneDetail}>
                          {milestone.description ? <Text style={styles.milestoneDescription}>{milestone.description}</Text> : null}
                          {milestone.subtasks.map((subtask) => (
                            <Pressable
                              key={subtask.id}
                              onPress={() => void toggleSubtask(subtask.id, !subtask.completed)}
                              style={styles.subtaskRow}>
                              <Ionicons
                                name={subtask.completed ? 'checkmark-circle' : 'ellipse-outline'}
                                size={22}
                                color={subtask.completed ? '#73D86A' : '#A8B0BC'}
                              />
                              <Text style={[styles.subtaskText, subtask.completed ? styles.subtaskTextCompleted : null]}>
                                {subtask.title}
                              </Text>
                            </Pressable>
                          ))}
                          {milestone.tips.length > 0 ? (
                            <View style={styles.tipBox}>
                              <Text style={styles.tipTitle}>Tips</Text>
                              {milestone.tips.map((tip) => (
                                <Text key={tip.id} style={styles.tipText}>
                                  • {tip.text}
                                </Text>
                              ))}
                            </View>
                          ) : null}
                        </View>
                      ) : null}
                    </View>
                  );
                })}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      <Modal visible={isDeleteConfirmVisible} transparent animationType="fade" onRequestClose={() => setIsDeleteConfirmVisible(false)}>
        <View style={styles.confirmBackdrop}>
          <View style={styles.confirmCard}>
            <Text style={styles.confirmTitle}>Ta bort mål?</Text>
            <Text style={styles.confirmText}>
              Är du säker på att du vill ta bort målet? Progressionen försvinner från dina aktiva quests.
            </Text>
            <View style={styles.confirmActions}>
              <Pressable onPress={() => setIsDeleteConfirmVisible(false)} style={styles.confirmButtonSecondary}>
                <Text style={styles.confirmButtonSecondaryText}>Avbryt</Text>
              </Pressable>
              <Pressable onPress={() => selectedGoal && void deleteGoal(selectedGoal.id)} style={styles.confirmButtonPrimary}>
                <Text style={styles.confirmButtonPrimaryText}>Ta bort</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={isCreateQuestVisible} transparent animationType="fade" onRequestClose={() => setIsCreateQuestVisible(false)}>
        <View style={styles.confirmBackdrop}>
          <View style={styles.createQuestCard}>
            <Text style={styles.confirmTitle}>Skapa egen daily quest</Text>
            <Text style={styles.confirmText}>Lägg till en enkel återkommande quest som ger låg men stadig XP.</Text>
            <TextInput
              value={questTitle}
              onChangeText={setQuestTitle}
              placeholder="Titel"
              placeholderTextColor="#677385"
              style={styles.input}
            />
            <TextInput
              value={questDescription}
              onChangeText={setQuestDescription}
              placeholder="Beskrivning"
              placeholderTextColor="#677385"
              style={[styles.input, styles.textArea]}
              multiline
            />
            <View style={styles.confirmActions}>
              <Pressable onPress={() => setIsCreateQuestVisible(false)} style={styles.confirmButtonSecondary}>
                <Text style={styles.confirmButtonSecondaryText}>Stäng</Text>
              </Pressable>
              <Pressable onPress={() => void createCustomQuest()} style={styles.confirmButtonPrimary}>
                <Text style={styles.confirmButtonPrimaryText}>Skapa quest</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#090E16' },
  container: { flex: 1, backgroundColor: '#090E16' },
  content: { paddingBottom: 120, paddingHorizontal: 16 },
  feedbackState: { alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  feedbackTitle: { color: '#F5F7FB', fontSize: 24, fontWeight: '700', marginTop: 18 },
  feedbackText: { color: '#97A0AE', fontSize: 14, lineHeight: 22, marginTop: 12, textAlign: 'center' },
  feedbackError: { color: '#C7CDD7', fontSize: 13, marginTop: 16, textAlign: 'center' },
  retryButton: {
    backgroundColor: '#8B4EF4',
    borderRadius: 12,
    marginTop: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  retryButtonText: { color: '#F7F3FF', fontSize: 14, fontWeight: '700' },
  topBar: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, marginTop: 8 },
  screenTitle: { color: '#F5F7FB', fontSize: 30, fontWeight: '800' },
  addButton: {
    alignItems: 'center',
    backgroundColor: '#8B4EF4',
    borderRadius: 16,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  tabRow: { flexDirection: 'row', marginBottom: 18 },
  tabButton: { flex: 1, paddingBottom: 12 },
  tabText: { color: '#758093', fontSize: 16, fontWeight: '700', textAlign: 'center' },
  tabTextActive: { color: '#B77BFF' },
  tabIndicator: { backgroundColor: '#202938', borderRadius: 99, height: 2, marginTop: 12 },
  tabIndicatorActive: { backgroundColor: '#A866FF' },
  sectionHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, marginTop: 18 },
  sectionTitle: { color: '#F5F7FB', fontSize: 20, fontWeight: '800', marginBottom: 12, marginTop: 18 },
  smallActionButton: {
    alignItems: 'center',
    backgroundColor: '#1A2230',
    borderColor: '#7D4EF4',
    borderRadius: 12,
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  overviewCard: {
    backgroundColor: '#141B26',
    borderColor: '#202938',
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    padding: 18,
  },
  overviewItem: { minWidth: '30%', width: '30%' },
  overviewValue: { color: '#F5F7FB', fontSize: 24, fontWeight: '800', marginTop: 8 },
  overviewLabel: { color: '#97A0AE', fontSize: 13, lineHeight: 18, marginTop: 4 },
  questCard: {
    backgroundColor: '#141B26',
    borderColor: '#202938',
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 14,
    padding: 16,
  },
  questCardCompleted: { borderColor: '#31563A' },
  questHeader: { flexDirection: 'row', gap: 12 },
  questIconWrap: {
    alignItems: 'center',
    borderRadius: 16,
    height: 42,
    justifyContent: 'center',
    marginTop: 2,
    width: 42,
  },
  questInfo: { flex: 1 },
  questTitle: { color: '#F5F7FB', fontSize: 17, fontWeight: '700' },
  questDescription: { color: '#97A0AE', fontSize: 13, lineHeight: 20, marginTop: 4 },
  questMetaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 },
  questMeta: { color: '#B9C1CF', fontSize: 12, fontWeight: '600' },
  goalCard: {
    backgroundColor: '#141B26',
    borderColor: '#202938',
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 16,
    padding: 18,
  },
  goalHeader: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  goalIconWrap: {
    alignItems: 'center',
    borderRadius: 18,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  goalHeaderText: { flex: 1 },
  goalTitle: { color: '#F5F7FB', fontSize: 18, fontWeight: '800' },
  goalSubtitle: { color: '#B5BECC', fontSize: 14, marginTop: 4 },
  goalDifficulty: { color: '#97A0AE', fontSize: 12, marginTop: 6 },
  goalPercent: { color: '#F5F7FB', fontSize: 16, fontWeight: '800' },
  progressTrack: {
    backgroundColor: '#2A3342',
    borderRadius: 999,
    height: 8,
    marginTop: 16,
    overflow: 'hidden',
  },
  progressFill: { borderRadius: 999, height: '100%' },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  metaText: { color: '#A9B3C2', fontSize: 13, fontWeight: '600' },
  emptyGoalsCard: {
    alignItems: 'center',
    backgroundColor: '#141B26',
    borderColor: '#202938',
    borderRadius: 24,
    borderWidth: 1,
    marginTop: 8,
    padding: 24,
  },
  emptyGoalsTitle: { color: '#F5F7FB', fontSize: 22, fontWeight: '800', marginTop: 12 },
  emptyGoalsText: { color: '#97A0AE', fontSize: 14, lineHeight: 22, marginTop: 10, textAlign: 'center' },
  emptyGoalsButton: {
    backgroundColor: '#8B4EF4',
    borderRadius: 12,
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  emptyGoalsButtonText: { color: '#F7F3FF', fontSize: 14, fontWeight: '700' },
  modalBackdrop: { backgroundColor: 'rgba(5, 8, 14, 0.72)', flex: 1, justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: '#0F1520',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '88%',
    paddingBottom: 32,
    paddingHorizontal: 18,
    paddingTop: 20,
  },
  modalHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  modalTitle: { color: '#F5F7FB', fontSize: 24, fontWeight: '800' },
  modalActions: { flexDirection: 'row', gap: 8 },
  iconActionButton: {
    alignItems: 'center',
    backgroundColor: '#171F2B',
    borderRadius: 14,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  goalDetailHero: {
    backgroundColor: '#141B26',
    borderColor: '#202938',
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 18,
    padding: 18,
  },
  goalDetailSubtitle: { color: '#B9C1CF', fontSize: 14 },
  goalDetailPercent: { color: '#F5F7FB', fontSize: 18, fontWeight: '800', marginTop: 8 },
  detailStatsRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  detailStat: {
    backgroundColor: '#1D2633',
    borderRadius: 999,
    color: '#DCE2EA',
    fontSize: 12,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  milestoneCard: {
    backgroundColor: '#141B26',
    borderColor: '#202938',
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 14,
    padding: 16,
  },
  milestoneHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  milestoneHeaderLeft: { alignItems: 'center', flexDirection: 'row', flex: 1, gap: 12 },
  milestoneTextWrap: { flex: 1 },
  milestoneTitle: { color: '#F5F7FB', fontSize: 16, fontWeight: '700' },
  milestoneLabel: { color: '#97A0AE', fontSize: 12, marginTop: 4 },
  milestoneBadge: {
    backgroundColor: '#231A39',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  milestoneBadgeText: { color: '#D5B6FF', fontSize: 12, fontWeight: '800' },
  milestoneDetail: { marginTop: 14 },
  milestoneDescription: { color: '#AEB7C5', fontSize: 13, lineHeight: 20, marginBottom: 12 },
  subtaskRow: { alignItems: 'center', flexDirection: 'row', gap: 10, marginBottom: 12 },
  subtaskText: { color: '#E6EBF2', flex: 1, fontSize: 14, lineHeight: 20 },
  subtaskTextCompleted: { color: '#7ECF8B', textDecorationLine: 'line-through' },
  tipBox: {
    backgroundColor: '#111924',
    borderColor: '#243040',
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 6,
    padding: 14,
  },
  tipTitle: { color: '#D9E0EA', fontSize: 12, fontWeight: '800', marginBottom: 8, textTransform: 'uppercase' },
  tipText: { color: '#AAB4C3', fontSize: 13, lineHeight: 20 },
  confirmBackdrop: { backgroundColor: 'rgba(4, 8, 16, 0.78)', flex: 1, justifyContent: 'center', padding: 24 },
  confirmCard: {
    backgroundColor: '#121925',
    borderColor: '#242D3D',
    borderRadius: 24,
    borderWidth: 1,
    padding: 22,
  },
  createQuestCard: {
    backgroundColor: '#121925',
    borderColor: '#242D3D',
    borderRadius: 24,
    borderWidth: 1,
    padding: 22,
  },
  confirmTitle: { color: '#F5F7FB', fontSize: 22, fontWeight: '800' },
  confirmText: { color: '#9AA4B3', fontSize: 14, lineHeight: 22, marginTop: 10 },
  confirmActions: { flexDirection: 'row', gap: 12, justifyContent: 'flex-end', marginTop: 20 },
  confirmButtonSecondary: {
    backgroundColor: '#1B2432',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  confirmButtonSecondaryText: { color: '#D9E0EA', fontSize: 14, fontWeight: '700' },
  confirmButtonPrimary: {
    backgroundColor: '#8B4EF4',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  confirmButtonPrimaryText: { color: '#F7F3FF', fontSize: 14, fontWeight: '700' },
  input: {
    backgroundColor: '#0E141D',
    borderColor: '#273244',
    borderRadius: 14,
    borderWidth: 1,
    color: '#F5F7FB',
    fontSize: 14,
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  textArea: { minHeight: 92, textAlignVertical: 'top' },
});
