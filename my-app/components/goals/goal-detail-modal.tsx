import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { GoalCard, QuestCard } from './types';

export function GoalDetailModal({
  visible,
  goal,
  isLoading,
  expandedMilestoneId,
  questFocus,
  onToggleMilestone,
  onToggleSubtask,
  onToggleQuest,
  onDelete,
  onClose,
}: {
  visible: boolean;
  goal: GoalCard | null;
  isLoading: boolean;
  expandedMilestoneId: string | null;
  questFocus?: 'daily' | 'weekly' | null;
  onToggleMilestone: (milestoneId: string) => void;
  onToggleSubtask: (subtaskId: string, completed: boolean) => void;
  onToggleQuest: (quest: QuestCard) => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const [showQuests, setShowQuests] = useState(false);

  useEffect(() => {
    if (!visible) {
      setShowQuests(false);
      return;
    }

    if (questFocus) {
      setShowQuests(true);
    }
  }, [questFocus, visible]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>{goal?.title ?? 'Mål'}</Text>
            <View style={styles.actions}>
              {goal ? (
                <Pressable onPress={onDelete} style={styles.iconButton}>
                  <Ionicons name="trash-outline" size={20} color="#C9A9FF" />
                </Pressable>
              ) : null}
              <Pressable onPress={onClose} style={styles.iconButton}>
                <Ionicons name="close" size={22} color="#F5F7FB" />
              </Pressable>
            </View>
          </View>

          {isLoading || !goal ? (
            <View style={styles.feedbackState}>
              <ActivityIndicator size="large" color="#A866FF" />
              <Text style={styles.feedbackText}>Hämtar målinfo...</Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.hero}>
                <Text style={styles.subtitle}>
                  {goal.subtitle} • {goal.difficulty}
                </Text>
                <Text style={styles.percent}>{goal.percentLabel}</Text>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      { backgroundColor: goal.color, width: `${Math.min(goal.progress * 100, 100)}%` },
                    ]}
                  />
                </View>
                <View style={styles.statsRow}>
                  <Text style={styles.stat}>{goal.totalXpReward} XP totalt</Text>
                  <Text style={styles.stat}>{goal.milestones.length} milestones</Text>
                </View>
                {goal.quests.length > 0 ? (
                  <Pressable onPress={() => setShowQuests((current) => !current)} style={styles.questToggleButton}>
                    <Ionicons name={showQuests ? 'eye-off-outline' : 'sparkles-outline'} size={18} color="#F7F3FF" />
                    <Text style={styles.questToggleText}>
                      {showQuests ? 'Dölj quests' : `Visa quests (${goal.quests.length})`}
                    </Text>
                  </Pressable>
                ) : null}
              </View>

              {showQuests ? (
                <View style={styles.questSection}>
                  <Text style={styles.questSectionTitle}>Quests kopplade till målet</Text>
                  {goal.quests.map((quest) => (
                    <Pressable
                      key={quest.id}
                      style={[styles.questCard, quest.completed ? styles.questCardCompleted : null]}
                      onPress={() => onToggleQuest(quest)}>
                      <View style={styles.questHeader}>
                        <View style={[styles.questIconWrap, { backgroundColor: `${quest.color}22` }]}>
                          <Ionicons
                            name={quest.completed ? 'checkmark-circle' : quest.type === 'WEEKLY' ? 'timer-outline' : 'ellipse-outline'}
                            size={22}
                            color={quest.color}
                          />
                        </View>
                        <View style={styles.questInfo}>
                          <Text style={styles.questTitle}>{quest.title}</Text>
                          <Text style={styles.questDescription}>{quest.description}</Text>
                          {quest.type === 'WEEKLY' ? (
                            <View style={styles.progressTrack}>
                              <View
                                style={[
                                  styles.progressFill,
                                  { backgroundColor: quest.color, width: `${Math.min(quest.progress * 100, 100)}%` },
                                ]}
                              />
                            </View>
                          ) : null}
                          <View style={styles.questMetaRow}>
                            <Text style={styles.questMeta}>{quest.progressLabel}</Text>
                            <Text style={styles.questMeta}>+{quest.xpReward} XP</Text>
                            {quest.streakCount > 0 ? <Text style={styles.questMeta}>{quest.streakCount} streak</Text> : null}
                          </View>
                        </View>
                      </View>
                    </Pressable>
                  ))}
                </View>
              ) : null}

              {goal.milestones.map((milestone) => {
                const isExpanded = expandedMilestoneId === milestone.id;
                const activeMilestone =
                  goal.milestones.find((item) => !item.completed)?.id ?? goal.milestones[0]?.id;
                const isActiveMilestone = milestone.id === activeMilestone && !milestone.completed;
                const statusLabel = milestone.completed
                  ? 'Avklarat steg'
                  : isActiveMilestone
                    ? 'Nästa steg'
                    : null;

                return (
                  <View
                    key={milestone.id}
                    style={[
                      styles.milestoneCard,
                      isActiveMilestone ? styles.milestoneCardActive : null,
                      milestone.completed ? styles.milestoneCardCompleted : null,
                    ]}>
                    <Pressable onPress={() => onToggleMilestone(milestone.id)} style={styles.milestoneHeader}>
                      <View style={styles.milestoneHeaderLeft}>
                        <Ionicons
                          name={milestone.completed ? 'checkmark-circle' : 'ellipse-outline'}
                          size={24}
                          color={milestone.completed ? '#73D86A' : '#A8B0BC'}
                        />
                        <View style={styles.milestoneTextWrap}>
                          <Text style={styles.milestoneTitle}>{milestone.title}</Text>
                          {statusLabel ? (
                            <Text
                              style={[
                                styles.statusPill,
                                milestone.completed ? styles.completedMilestonePill : styles.activeMilestonePill,
                              ]}>
                              {statusLabel}
                            </Text>
                          ) : null}
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
                            onPress={() => onToggleSubtask(subtask.id, !subtask.completed)}
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
  );
}

const styles = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(5, 8, 14, 0.72)', flex: 1, justifyContent: 'flex-end' },
  card: {
    backgroundColor: '#0F1520',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '88%',
    paddingBottom: 32,
    paddingHorizontal: 18,
    paddingTop: 20,
  },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  title: { color: '#F5F7FB', fontSize: 24, fontWeight: '800' },
  actions: { flexDirection: 'row', gap: 8 },
  iconButton: {
    alignItems: 'center',
    backgroundColor: '#171F2B',
    borderRadius: 14,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  feedbackState: { alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  feedbackText: { color: '#97A0AE', fontSize: 14, lineHeight: 22, marginTop: 12, textAlign: 'center' },
  hero: {
    backgroundColor: '#141B26',
    borderColor: '#202938',
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 18,
    padding: 18,
  },
  subtitle: { color: '#B9C1CF', fontSize: 14 },
  percent: { color: '#F5F7FB', fontSize: 18, fontWeight: '800', marginTop: 8 },
  progressTrack: {
    backgroundColor: '#2A3342',
    borderRadius: 999,
    height: 8,
    marginTop: 16,
    overflow: 'hidden',
  },
  progressFill: { borderRadius: 999, height: '100%' },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  stat: {
    backgroundColor: '#1D2633',
    borderRadius: 999,
    color: '#DCE2EA',
    fontSize: 12,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  questToggleButton: {
    alignItems: 'center',
    backgroundColor: '#8B4EF4',
    borderRadius: 14,
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignSelf: 'flex-start',
  },
  questToggleText: { color: '#F7F3FF', fontSize: 13, fontWeight: '800' },
  questSection: { marginBottom: 18 },
  questSectionTitle: { color: '#F5F7FB', fontSize: 18, fontWeight: '800', marginBottom: 12 },
  questCard: {
    backgroundColor: '#141B26',
    borderColor: '#202938',
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 14,
    padding: 16,
  },
  questCardCompleted: { borderColor: '#31563A' },
  questHeader: { alignItems: 'flex-start', flexDirection: 'row', gap: 12 },
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
  milestoneCard: {
    backgroundColor: '#141B26',
    borderColor: '#202938',
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 14,
    padding: 16,
  },
  milestoneCardActive: {
    borderColor: '#8B4EF4',
    shadowColor: '#8B4EF4',
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },
  milestoneCardCompleted: {
    borderColor: '#2F5B38',
  },
  milestoneHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  milestoneHeaderLeft: { alignItems: 'center', flexDirection: 'row', flex: 1, gap: 12 },
  milestoneTextWrap: { flex: 1 },
  milestoneTitle: { color: '#F5F7FB', fontSize: 16, fontWeight: '700' },
  statusPill: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 6,
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  activeMilestonePill: {
    backgroundColor: '#24183B',
    color: '#D6B9FF',
  },
  completedMilestonePill: {
    backgroundColor: '#183123',
    color: '#93E09F',
  },
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
});
