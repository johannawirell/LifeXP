import Ionicons from '@expo/vector-icons/Ionicons';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSession } from '@/context/session-context';
import { fetchJson, patchJson } from '@/lib/api';

type GoalsPageResponse = {
  overview: {
    activeGoals: number;
    averageProgress: string;
    completedMilestones: number;
    streakDays: number;
  };
  activeGoals: GoalCard[];
  completedGoals: GoalCard[];
};

type GoalCard = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
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

type GoalTab = 'active' | 'completed';

const overviewItems = [
  { key: 'activeGoals', label: 'Aktiva mål', icon: 'flag-outline', color: '#A866FF' },
  { key: 'averageProgress', label: 'Snitt. framsteg', icon: 'stats-chart-outline', color: '#67D86F' },
  { key: 'completedMilestones', label: 'Delmål klara', icon: 'checkmark-circle-outline', color: '#F5C13C' },
  { key: 'streakDays', label: 'Dagar i rad', icon: 'flame-outline', color: '#F08A45' },
] as const;

export default function GoalsScreen() {
  const { userId, resetSession } = useSession();
  const [goalsPage, setGoalsPage] = useState<GoalsPageResponse | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<GoalCard | null>(null);
  const [expandedMilestoneId, setExpandedMilestoneId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGoalDetailLoading, setIsGoalDetailLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<GoalTab>('active');

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

  const loadGoalDetail = async (goalId: string) => {
    if (!userId) {
      return;
    }

    try {
      setIsGoalDetailLoading(true);
      const data = await fetchJson<GoalCard>(`/goals/${userId}/detail/${goalId}`);
      setSelectedGoal(data);
      setExpandedMilestoneId(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unknown error');
    } finally {
      setIsGoalDetailLoading(false);
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

  useEffect(() => {
    void loadGoals();
  }, [loadGoals]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.feedbackState}>
          <ActivityIndicator size="large" color="#A866FF" />
          <Text style={styles.feedbackText}>Hämtar mål från backend...</Text>
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
          <View style={styles.addButton}>
            <Ionicons name="add" size={28} color="#F7F3FF" />
          </View>
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

        <Text style={styles.sectionTitle}>Översikt</Text>
        <View style={styles.overviewCard}>
          {overviewItems.map((item) => (
            <View key={item.key} style={styles.overviewItem}>
              <Ionicons name={item.icon} size={24} color={item.color} />
              <Text style={styles.overviewValue}>{String(goalsPage.overview[item.key])}</Text>
              <Text style={styles.overviewLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {goalCards.length === 0 ? (
          <View style={styles.emptyGoalsCard}>
            <Ionicons name="flag-outline" size={32} color="#A866FF" />
            <Text style={styles.emptyGoalsTitle}>Inga mål ännu</Text>
            <Text style={styles.emptyGoalsText}>
              Du börjar från början. Använd `+`-fliken för att skapa ditt första mål.
            </Text>
            <Pressable onPress={resetSession} style={styles.emptyGoalsButton}>
              <Text style={styles.emptyGoalsButtonText}>Byt läge</Text>
            </Pressable>
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

            <View style={styles.goalFooter}>
              <Text style={styles.goalFooterText}>Öppna mål</Text>
              <Ionicons name="chevron-forward" size={18} color="#D8DEE7" />
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <Modal visible={Boolean(selectedGoal) || isGoalDetailLoading} animationType="slide" transparent onRequestClose={() => setSelectedGoal(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedGoal?.title ?? 'Mål'}</Text>
              <Pressable onPress={() => setSelectedGoal(null)}>
                <Ionicons name="close" size={22} color="#F5F7FB" />
              </Pressable>
            </View>

            {isGoalDetailLoading || !selectedGoal ? (
              <View style={styles.feedbackState}>
                <ActivityIndicator size="large" color="#A866FF" />
                <Text style={styles.feedbackText}>Hämtar målinfo...</Text>
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.goalDetailHero}>
                  <Text style={styles.goalDetailSubtitle}>{selectedGoal.subtitle}</Text>
                  <Text style={styles.goalDetailPercent}>{selectedGoal.percentLabel}</Text>
                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        { backgroundColor: selectedGoal.color, width: `${Math.min(selectedGoal.progress * 100, 100)}%` },
                      ]}
                    />
                  </View>
                </View>

                {selectedGoal.milestones.map((milestone) => (
                  <View key={milestone.id} style={styles.detailMilestoneCard}>
                    <Pressable
                      style={styles.detailMilestoneHeader}
                      onPress={() =>
                        setExpandedMilestoneId((current) => (current === milestone.id ? null : milestone.id))
                      }>
                      <View style={styles.detailMilestoneTitleWrap}>
                        <Ionicons
                          name={milestone.completed ? 'checkmark-circle' : 'ellipse-outline'}
                          size={22}
                          color={milestone.completed ? '#7BDE72' : '#8A93A2'}
                        />
                        <Text style={styles.detailMilestoneTitle}>{milestone.title}</Text>
                      </View>
                      <Ionicons
                        name={expandedMilestoneId === milestone.id ? 'chevron-up' : 'chevron-down'}
                        size={18}
                        color="#D8DEE7"
                      />
                    </Pressable>

                    {expandedMilestoneId === milestone.id ? (
                      <View style={styles.detailMilestoneBody}>
                        {milestone.description ? (
                          <Text style={styles.detailMilestoneDescription}>{milestone.description}</Text>
                        ) : null}

                        <Text style={styles.detailSectionTitle}>Delmål</Text>
                        {milestone.subtasks.map((subtask) => (
                          <Pressable
                            key={subtask.id}
                            style={styles.subtaskRow}
                            onPress={() => void toggleSubtask(subtask.id, !subtask.completed)}>
                            <Ionicons
                              name={subtask.completed ? 'checkbox' : 'square-outline'}
                              size={22}
                              color={subtask.completed ? '#7BDE72' : '#A866FF'}
                            />
                            <Text style={[styles.subtaskText, subtask.completed ? styles.subtaskTextCompleted : null]}>
                              {subtask.title}
                            </Text>
                          </Pressable>
                        ))}

                        <Text style={styles.detailSectionTitle}>Tips</Text>
                        {milestone.tips.map((tip) => (
                          <View key={tip.id} style={styles.tipRow}>
                            <Ionicons name="bulb-outline" size={18} color="#F5C13C" />
                            <Text style={styles.tipText}>{tip.text}</Text>
                          </View>
                        ))}
                      </View>
                    ) : null}
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#090E16',
  },
  container: {
    flex: 1,
    backgroundColor: '#090E16',
  },
  content: {
    paddingBottom: 120,
  },
  feedbackState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  feedbackTitle: {
    color: '#F5F7FB',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 18,
  },
  feedbackText: {
    color: '#97A0AE',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12,
    textAlign: 'center',
  },
  feedbackError: {
    color: '#C9A9FF',
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#8B4EF4',
    borderRadius: 12,
    marginTop: 20,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  retryButtonText: {
    color: '#F7F3FF',
    fontSize: 14,
    fontWeight: '700',
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 6,
  },
  screenTitle: {
    color: '#F5F7FB',
    fontSize: 24,
    fontWeight: '700',
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: '#8B4EF4',
    borderRadius: 16,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  tabRow: {
    borderBottomColor: '#242B36',
    borderBottomWidth: 1,
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 22,
  },
  tabButton: {
    alignItems: 'center',
    flex: 1,
  },
  tabText: {
    color: '#8891A0',
    fontSize: 15,
    fontWeight: '600',
    paddingBottom: 16,
  },
  tabTextActive: {
    color: '#A866FF',
  },
  tabIndicator: {
    backgroundColor: 'transparent',
    borderRadius: 999,
    height: 3,
    width: '100%',
  },
  tabIndicatorActive: {
    backgroundColor: '#A866FF',
  },
  sectionTitle: {
    color: '#F5F7FB',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 20,
    marginTop: 20,
  },
  overviewCard: {
    backgroundColor: '#151B24',
    borderColor: '#1F2632',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 18,
  },
  overviewItem: {
    alignItems: 'center',
    flex: 1,
  },
  overviewValue: {
    color: '#F5F7FB',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
  },
  overviewLabel: {
    color: '#C3CAD6',
    fontSize: 8,
    marginTop: 6,
    textAlign: 'center',
  },
  emptyGoalsCard: {
    alignItems: 'center',
    backgroundColor: '#151B24',
    borderColor: '#1F2632',
    borderRadius: 20,
    borderWidth: 1,
    marginHorizontal: 20,
    marginTop: 18,
    paddingHorizontal: 20,
    paddingVertical: 28,
  },
  emptyGoalsTitle: {
    color: '#F5F7FB',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 14,
  },
  emptyGoalsText: {
    color: '#9AA3B2',
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10,
    textAlign: 'center',
  },
  emptyGoalsButton: {
    backgroundColor: '#8B4EF4',
    borderRadius: 12,
    marginTop: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  emptyGoalsButtonText: {
    color: '#F7F3FF',
    fontSize: 14,
    fontWeight: '700',
  },
  goalCard: {
    backgroundColor: '#151B24',
    borderColor: '#1F2632',
    borderRadius: 20,
    borderWidth: 1,
    marginHorizontal: 20,
    marginTop: 18,
    overflow: 'hidden',
  },
  goalHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  goalIconWrap: {
    alignItems: 'center',
    borderRadius: 14,
    height: 50,
    justifyContent: 'center',
    width: 50,
  },
  goalHeaderText: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
  },
  goalTitle: {
    color: '#F5F7FB',
    fontSize: 16,
    fontWeight: '700',
  },
  goalSubtitle: {
    color: '#8A93A2',
    fontSize: 13,
    marginTop: 4,
  },
  goalPercent: {
    color: '#F5F7FB',
    fontSize: 18,
    fontWeight: '700',
  },
  progressTrack: {
    backgroundColor: '#2B313E',
    borderRadius: 999,
    height: 8,
    marginTop: 18,
    overflow: 'hidden',
  },
  progressFill: {
    borderRadius: 999,
    height: '100%',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 14,
  },
  metaText: {
    color: '#D5DBE5',
    fontSize: 13,
    fontWeight: '500',
  },
  goalFooter: {
    alignItems: 'center',
    borderTopColor: '#1F2632',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  goalFooterText: {
    color: '#F5F7FB',
    fontSize: 15,
    fontWeight: '600',
  },
  modalBackdrop: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  modalCard: {
    backgroundColor: '#111722',
    borderRadius: 24,
    maxHeight: '78%',
    paddingBottom: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  modalTitle: {
    color: '#F5F7FB',
    fontSize: 18,
    fontWeight: '700',
  },
  goalDetailHero: {
    marginBottom: 12,
  },
  goalDetailSubtitle: {
    color: '#9AA3B2',
    fontSize: 14,
  },
  goalDetailPercent: {
    color: '#F5F7FB',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 10,
  },
  detailMilestoneCard: {
    backgroundColor: '#151B24',
    borderColor: '#1F2632',
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 14,
    overflow: 'hidden',
  },
  detailMilestoneHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  detailMilestoneTitleWrap: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  detailMilestoneTitle: {
    color: '#F5F7FB',
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 10,
  },
  detailMilestoneBody: {
    borderTopColor: '#1F2632',
    borderTopWidth: 1,
    padding: 14,
  },
  detailMilestoneDescription: {
    color: '#C8CFDA',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },
  detailSectionTitle: {
    color: '#C9A9FF',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 6,
  },
  subtaskRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  subtaskText: {
    color: '#F5F7FB',
    flex: 1,
    fontSize: 13,
  },
  subtaskTextCompleted: {
    color: '#8FA38F',
    textDecorationLine: 'line-through',
  },
  tipRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  tipText: {
    color: '#AEB6C3',
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
  },
});
