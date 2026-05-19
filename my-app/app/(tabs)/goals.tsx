import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GoalCompletionModal } from '@/components/goals/goal-completion-modal';
import { GoalDetailModal } from '@/components/goals/goal-detail-modal';
import { goalsScreenStyles as styles } from '@/components/goals/goals-screen-styles';
import type {
  GoalCard,
  GoalCategoryFilter,
  GoalsMutationResponse,
  GoalsMutationReward,
  GoalsPageResponse,
  GoalTab,
  QuestCard,
} from '@/components/goals/types';
import { useSession } from '@/context/session-context';
import { useLiveUpdates } from '@/hooks/use-live-updates';
import { deleteJson, fetchJson, patchJson } from '@/lib/api';

const goalFilters: { key: GoalCategoryFilter; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'latest', label: 'Senaste', icon: 'time-outline' },
  { key: 'job', label: 'Jobb', icon: 'briefcase-outline' },
  { key: 'study', label: 'Plugg', icon: 'school-outline' },
  { key: 'training', label: 'Träning', icon: 'barbell-outline' },
  { key: 'health', label: 'Hälsa', icon: 'heart-outline' },
  { key: 'finance', label: 'Ekonomi', icon: 'wallet-outline' },
  { key: 'relationship', label: 'Relationer', icon: 'people-outline' },
];

const overviewItems = [
  { key: 'activeGoals', label: 'Aktiva mål', icon: 'flag-outline', color: '#A866FF' },
  { key: 'completedMilestones', label: 'Milestones klara', icon: 'checkmark-circle-outline', color: '#F5C13C' },
] as const;

function filterGoals(goals: GoalCard[], filter: GoalCategoryFilter) {
  if (filter === 'latest') {
    return [...goals]
      .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
      .slice(0, 5);
  }

  return goals.filter((goal) => {
    const normalizedCategory = goal.category.trim().toLowerCase();

    switch (filter) {
      case 'job':
        return normalizedCategory === 'jobb';
      case 'study':
        return normalizedCategory === 'plugg';
      case 'training':
        return normalizedCategory === 'träning';
      case 'health':
        return normalizedCategory === 'hälsa';
      case 'finance':
        return normalizedCategory === 'ekonomi';
      case 'relationship':
        return normalizedCategory === 'relationer';
      default:
        return true;
    }
  });
}

export default function GoalsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    goalId?: string | string[];
    tab?: string | string[];
    focus?: string | string[];
    filter?: string | string[];
    notice?: string | string[];
  }>();
  const { userId } = useSession();
  const [goalsPage, setGoalsPage] = useState<GoalsPageResponse | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<GoalCard | null>(null);
  const [expandedMilestoneId, setExpandedMilestoneId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<GoalTab>('active');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<GoalCategoryFilter>('latest');
  const [rewardBanner, setRewardBanner] = useState<GoalsMutationReward | null>(null);
  const [goalCompletionReward, setGoalCompletionReward] = useState<GoalsMutationReward | null>(null);
  const [dismissedGoalId, setDismissedGoalId] = useState<string | null>(null);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isGoalDetailLoading, setIsGoalDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const routeGoalId = Array.isArray(params.goalId) ? params.goalId[0] : params.goalId;
  const routeTab = Array.isArray(params.tab) ? params.tab[0] : params.tab;
  const routeFocus = Array.isArray(params.focus) ? params.focus[0] : params.focus;
  const routeFilter = Array.isArray(params.filter) ? params.filter[0] : params.filter;
  const routeNotice = Array.isArray(params.notice) ? params.notice[0] : params.notice;

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
        setDismissedGoalId(null);
        const data = await fetchJson<GoalCard>(`/goals/${userId}/detail/${goalId}`);
        setSelectedGoal(data);
        setExpandedMilestoneId(
          data.milestones.find((milestone) => !milestone.completed)?.id ?? data.milestones[0]?.id ?? null
        );
      } catch (loadError) {
        setSelectedGoal(null);
        setExpandedMilestoneId(null);

        if (routeGoalId === goalId || routeTab) {
          router.replace('/(tabs)/goals');
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

  const closeGoalDetail = useCallback(() => {
    if (routeGoalId) {
      setDismissedGoalId(routeGoalId);
    }

    setSelectedGoal(null);
    setExpandedMilestoneId(null);

    if (routeGoalId || routeTab || routeFilter || routeNotice) {
      router.replace({
        pathname: '/(tabs)/goals',
        params: {
          ...(routeTab === 'completed' ? { tab: 'completed' } : {}),
          ...(routeFilter === 'latest' ? { filter: 'latest' } : {}),
        },
      });
    }
  }, [routeFilter, routeGoalId, routeNotice, routeTab, router]);

  const dismissAddedGoalNotice = useCallback(() => {
    if (!routeNotice) {
      return;
    }

    router.replace({
      pathname: '/(tabs)/goals',
      params: {
        ...(routeTab === 'completed' ? { tab: 'completed' } : {}),
        ...(routeFilter === 'latest' ? { filter: 'latest' } : {}),
      },
    });
  }, [routeFilter, routeNotice, routeTab, router]);

  const updateGoalState = useCallback((page: GoalsPageResponse, currentGoalId: string | null) => {
    setGoalsPage(page);

    if (!currentGoalId) {
      return;
    }

    const refreshedGoal =
      [...page.activeGoals, ...page.completedGoals].find((goal) => goal.id === currentGoalId) ?? null;
    setSelectedGoal(refreshedGoal);
  }, []);

  const updateQuest = useCallback(
    async (quest: QuestCard) => {
      if (!userId) {
        return;
      }

      try {
        const data = await patchJson<GoalsMutationResponse>(`/goals/${userId}/quests/${quest.id}`, {
          completed: quest.type === 'DAILY' ? !quest.completed : undefined,
          incrementBy: quest.type === 'WEEKLY' && !quest.completed ? 1 : undefined,
        });
        setRewardBanner(data.reward ?? null);
        updateGoalState(data.page, selectedGoal?.id ?? null);
      } catch (questError) {
        setError(questError instanceof Error ? questError.message : 'Unknown error');
      }
    },
    [selectedGoal?.id, updateGoalState, userId]
  );

  const toggleSubtask = useCallback(
    async (subtaskId: string, completed: boolean) => {
      if (!userId || !selectedGoal) {
        return;
      }

      try {
        const toggledSubtask = selectedGoal.milestones
          .flatMap((milestone) => milestone.subtasks)
          .find((subtask) => subtask.id === subtaskId);

        const data = await patchJson<GoalsMutationResponse>(`/goals/${userId}/subtasks/${subtaskId}`, {
          completed,
        });

        const nextReward =
          data.reward ??
          (completed
            ? {
                totalXp: 0,
                title: toggledSubtask?.title ?? selectedGoal.title,
              }
            : null);

        setRewardBanner(nextReward);

        if (data.reward?.goalBonusXp) {
          setGoalCompletionReward(data.reward);
        }

        updateGoalState(data.page, selectedGoal.id);
      } catch (toggleError) {
        setError(toggleError instanceof Error ? toggleError.message : 'Unknown error');
      }
    },
    [selectedGoal, updateGoalState, userId]
  );

  const deleteGoal = useCallback(
    async (goalId: string) => {
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
    },
    [closeGoalDetail, userId]
  );

  useLiveUpdates(
    userId,
    useCallback(
      async (event) => {
        if (!event.resources.includes('goals') || !userId) {
          return;
        }

        try {
          const data = await fetchJson<GoalsPageResponse>(`/goals/${userId}`);
          updateGoalState(data, selectedGoal?.id ?? null);

          if (event.reward) {
            setRewardBanner(event.reward);

            if (event.reward.goalBonusXp) {
              setGoalCompletionReward(event.reward);
            }
          }
        } catch {
          // Keep current state if a pushed refresh fails.
        }
      },
      [selectedGoal?.id, updateGoalState, userId]
    ),
    { enabled: Boolean(userId) }
  );

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
    if (routeFilter === 'latest') {
      setSelectedCategoryFilter('latest');
    }
  }, [routeFilter]);

  useEffect(() => {
    if (routeNotice === 'goal-added') {
      void loadGoals();
    }
  }, [loadGoals, routeNotice]);

  useEffect(() => {
    if (
      !goalsPage ||
      !routeGoalId ||
      isGoalDetailLoading ||
      selectedGoal?.id === routeGoalId ||
      dismissedGoalId === routeGoalId
    ) {
      return;
    }

    void loadGoalDetail(routeGoalId);
  }, [dismissedGoalId, goalsPage, isGoalDetailLoading, loadGoalDetail, routeGoalId, selectedGoal?.id]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.feedbackState}>
          <ActivityIndicator size="large" color="#A866FF" />
          <Text style={styles.feedbackText}>Hämtar mål...</Text>
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

  const sourceGoals = selectedTab === 'active' ? goalsPage.activeGoals : goalsPage.completedGoals;
  const goalCards = filterGoals(sourceGoals, selectedCategoryFilter);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Text style={styles.screenTitle}>Mina mål</Text>
          <Pressable style={styles.addButton} onPress={() => router.push('/(tabs)/create-goal')}>
            <Ionicons name="add" size={28} color="#F7F3FF" />
          </Pressable>
        </View>

        {routeNotice === 'goal-added' ? (
          <View style={styles.noticeCard}>
            <View style={styles.noticeCopy}>
              <Ionicons name="checkmark-circle" size={20} color="#8FE69C" />
              <View style={styles.noticeTextWrap}>
                <Text style={styles.noticeTitle}>Lagt till mål</Text>
                <Text style={styles.noticeText}>Målet ligger nu i din lista under Senaste.</Text>
              </View>
            </View>
            <Pressable onPress={dismissAddedGoalNotice} hitSlop={8}>
              <Ionicons name="close" size={18} color="#C8D0DB" />
            </Pressable>
          </View>
        ) : null}

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
          </>
        ) : null}

        <View style={styles.goalsSectionHeader}>
          <Text style={styles.sectionTitle}>Dina mål</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {goalFilters.map((filter) => (
            <Pressable key={filter.key} style={styles.filterItem} onPress={() => setSelectedCategoryFilter(filter.key)}>
              <View
                style={[
                  styles.filterIconWrap,
                  selectedCategoryFilter === filter.key ? styles.filterIconWrapActive : null,
                ]}>
                <Ionicons
                  name={filter.icon}
                  size={22}
                  color={selectedCategoryFilter === filter.key ? '#A866FF' : '#9AA3B2'}
                />
              </View>
              <Text style={[styles.filterText, selectedCategoryFilter === filter.key ? styles.filterTextActive : null]}>
                {filter.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {goalCards.length === 0 ? (
          <View style={styles.emptyGoalsCard}>
            <Ionicons name="flag-outline" size={32} color="#A866FF" />
            <Text style={styles.emptyGoalsTitle}>
              {selectedTab === 'active' ? 'Inga mål ännu' : 'Inga avslutade mål ännu'}
            </Text>
            <Text style={styles.emptyGoalsText}>
              {selectedTab === 'active'
                ? 'Börja din resa mot en roligare vardag genom att skapa ett mål och börja samla XP.'
                : 'Fortsätt jaga dina goals. När du slutför dem hamnar de här som troféer över vad du faktiskt byggt upp.'}
            </Text>
            {selectedTab === 'active' ? (
              <Pressable onPress={() => router.push('/(tabs)/create-goal')} style={styles.emptyGoalsButton}>
                <Text style={styles.emptyGoalsButtonText}>Lägg till ett nytt mål</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}

        {goalCards.map((goal) => (
          <Pressable key={goal.id} style={styles.goalCard} onPress={() => void loadGoalDetail(goal.id)}>
            <View style={styles.goalHeader}>
              <View style={[styles.goalIconWrap, { backgroundColor: `${goal.color}22` }]}>
                <Ionicons name={goal.icon as keyof typeof Ionicons.glyphMap} size={30} color={goal.color} />
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

      <GoalDetailModal
        visible={Boolean(selectedGoal) || isGoalDetailLoading}
        goal={selectedGoal}
        isLoading={isGoalDetailLoading}
        expandedMilestoneId={expandedMilestoneId}
        questFocus={routeFocus === 'daily' || routeFocus === 'weekly' ? routeFocus : null}
        onToggleMilestone={(milestoneId) =>
          setExpandedMilestoneId((current) => (current === milestoneId ? null : milestoneId))
        }
        onToggleSubtask={(subtaskId, completed) => void toggleSubtask(subtaskId, completed)}
        onToggleQuest={(quest) => void updateQuest(quest)}
        onDelete={() => setIsDeleteConfirmVisible(true)}
        onClose={closeGoalDetail}
      />

      <GoalCompletionModal reward={goalCompletionReward} onClose={() => setGoalCompletionReward(null)} />

      <GoalCompletionModal
        reward={rewardBanner?.goalBonusXp ? null : rewardBanner}
        onClose={() => setRewardBanner(null)}
        variant="xp"
      />

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
              <Pressable
                onPress={() => selectedGoal && void deleteGoal(selectedGoal.id)}
                style={styles.confirmButtonPrimary}>
                <Text style={styles.confirmButtonPrimaryText}>Ta bort</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
