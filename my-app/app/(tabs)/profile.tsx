import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, Animated, Easing, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSession } from '@/context/session-context';
import { useLiveUpdates } from '@/hooks/use-live-updates';
import { fetchJson } from '@/lib/api';

type ProfileResponse = {
  id: string;
  displayName: string;
  headline: string | null;
  currentLevel: number;
  totalXp: number;
  nextLevelXp: number;
  xpToNextLevel: number;
  levelProgress: number;
  currentStreak: number;
  bestStreak: number;
  focusAreas: {
    id: string;
    key: string;
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    level: number;
    currentXp: number;
    maxXp: number;
    color: string;
  }[];
  activeGoals: {
    id: string;
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle: string;
    progress: number;
    color: string;
    percentLabel: string;
  }[];
  dailyQuests: {
    id: string;
    title: string;
    xpReward: number;
    progressLabel: string;
    completed: boolean;
    color: string;
  }[];
  weeklyQuests: {
    id: string;
    title: string;
    xpReward: number;
    progressLabel: string;
    completed: boolean;
    color: string;
  }[];
  recentXp: {
    id: string;
    amount: number;
    title: string;
    description: string;
    multiplier: number;
  }[];
  achievements: {
    id: string;
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle: string;
    color: string;
    rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  }[];
  weeklyStats: {
    id: string;
    icon: keyof typeof Ionicons.glyphMap;
    value: string;
    label: string;
    detail: string;
    color: string;
  }[];
  statisticsSummary: {
    totalXp: number;
    level: number;
    xpToNextLevel: number;
    completedQuests: number;
    completedGoals: number;
    currentStreak: number;
  };
};

function SectionHeader({
  title,
  action,
  onPress,
}: {
  title: string;
  action?: string;
  onPress?: () => void;
}) {
  const content = (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <View style={styles.sectionAction}>
          <Text style={styles.sectionActionText}>{action}</Text>
          <Ionicons name="chevron-forward" size={14} color="#8D56F7" />
        </View>
      ) : null}
    </View>
  );

  if (!action || !onPress) {
    return content;
  }

  return <Pressable onPress={onPress}>{content}</Pressable>;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { mode, userId, resetSession } = useSession();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [levelUpState, setLevelUpState] = useState<{ level: number } | null>(null);
  const [achievementState, setAchievementState] = useState<{ title: string; rarity: string } | null>(null);
  const previousProfileRef = useRef<ProfileResponse | null>(null);
  const levelUpScale = useRef(new Animated.Value(0.88)).current;
  const levelUpOpacity = useRef(new Animated.Value(0)).current;
  const achievementTranslateY = useRef(new Animated.Value(-20)).current;
  const achievementOpacity = useRef(new Animated.Value(0)).current;

  const animateLevelUp = useCallback((level: number) => {
    setLevelUpState({ level });
    levelUpScale.setValue(0.88);
    levelUpOpacity.setValue(0);
    Animated.parallel([
      Animated.spring(levelUpScale, {
        toValue: 1,
        useNativeDriver: true,
        damping: 10,
        stiffness: 120,
      }),
      Animated.timing(levelUpOpacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [levelUpOpacity, levelUpScale]);

  const animateAchievement = useCallback((title: string, rarity: string) => {
    setAchievementState({ title, rarity });
    achievementTranslateY.setValue(-20);
    achievementOpacity.setValue(0);
    Animated.parallel([
      Animated.timing(achievementTranslateY, {
        toValue: 0,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(achievementOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(achievementTranslateY, {
            toValue: -16,
            duration: 240,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(achievementOpacity, {
            toValue: 0,
            duration: 220,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setAchievementState(null);
        });
      }, 2200);
    });
  }, [achievementOpacity, achievementTranslateY]);

  const loadProfile = useCallback(async () => {
    if (mode === 'empty') {
      setProfile(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    if (!userId) {
      setProfile(null);
      setError('Ingen användare vald.');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchJson<ProfileResponse>(`/profile/${userId}`);
      const previousProfile = previousProfileRef.current;
      if (previousProfile) {
        if (data.currentLevel > previousProfile.currentLevel) {
          animateLevelUp(data.currentLevel);
        }

        if (data.achievements.length > previousProfile.achievements.length) {
          const newestAchievement = data.achievements[data.achievements.length - 1];
          if (newestAchievement) {
            animateAchievement(newestAchievement.title, newestAchievement.rarity);
          }
        }
      }
      previousProfileRef.current = data;
      setProfile(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [animateAchievement, animateLevelUp, mode, userId]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  useFocusEffect(
    useCallback(() => {
      void loadProfile();
    }, [loadProfile])
  );

  useLiveUpdates(
    userId,
    useCallback(
      async (event) => {
        if (!event.resources.includes('profile') || mode === 'empty' || !userId) {
          return;
        }

        try {
          const data = await fetchJson<ProfileResponse>(`/profile/${userId}`);
          setProfile(data);
        } catch {
          // Keep latest known state if a pushed refresh fails.
        }
      },
      [mode, userId]
    ),
    { enabled: mode !== 'empty' && Boolean(userId) }
  );

  if (mode === 'empty') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.feedbackState}>
          <Ionicons name="person-outline" size={46} color="#A866FF" />
          <Text style={styles.feedbackTitle}>Ny användare</Text>
          <Text style={styles.feedbackText}>
            Profilen är tom just nu. Skapa dina första mål och quests för att börja bygga level, streak och achievements.
          </Text>
          <Pressable onPress={resetSession} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Byt läge</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.feedbackState}>
          <ActivityIndicator size="large" color="#A866FF" />
          <Text style={styles.feedbackText}>Hämtar profil från backend...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !profile) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.feedbackState}>
          <Ionicons name="cloud-offline-outline" size={42} color="#A866FF" />
          <Text style={styles.feedbackTitle}>Backend svarar inte</Text>
          <Text style={styles.feedbackText}>
            Starta `api-gateway`, `goals-service`, `gamification-service` och databasen.
          </Text>
          <Text style={styles.feedbackError}>{error ?? 'Ingen profil hittades.'}</Text>
          <Pressable onPress={() => void loadProfile()} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Försök igen</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const openGoalsPage = () => {
    router.push('/goals');
  };

  const openGoalFromProfile = (goalId: string) => {
    router.push({
      pathname: '/(tabs)/goals',
      params: {
        goalId,
        tab: 'active',
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={() => setIsSettingsOpen(false)}>
        {achievementState ? (
          <Animated.View
            style={[
              styles.achievementToast,
              {
                opacity: achievementOpacity,
                transform: [{ translateY: achievementTranslateY }],
              },
            ]}>
            <Ionicons name="ribbon-outline" size={18} color="#F7F3FF" />
            <View style={styles.achievementToastText}>
              <Text style={styles.achievementToastTitle}>Ny prestation upplåst</Text>
              <Text style={styles.achievementToastSubtitle}>
                {achievementState.title} • {achievementState.rarity}
              </Text>
            </View>
          </Animated.View>
        ) : null}
        <View style={styles.topBar}>
          <Text style={styles.screenTitle}>Profil</Text>
          <View style={styles.settingsWrap}>
            <Pressable onPress={() => setIsSettingsOpen((current) => !current)} style={styles.settingsButton}>
              <Ionicons name="settings-outline" size={22} color="#F5F7FB" />
            </Pressable>
            {isSettingsOpen ? (
              <View style={styles.settingsMenu}>
                <Pressable
                  onPress={() => {
                    setIsSettingsOpen(false);
                    resetSession();
                  }}
                  style={styles.settingsMenuItem}>
                  <Ionicons name="log-out-outline" size={18} color="#F7F3FF" />
                  <Text style={styles.settingsMenuText}>Logga ut</Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.avatarWrap}>
              <View style={styles.avatarOuter}>
                <View style={styles.avatarInner}>
                  <Ionicons name="person" size={68} color="#120E19" />
                </View>
              </View>
              <View style={styles.levelBadge}>
                <Text style={styles.levelBadgeText}>{profile.currentLevel}</Text>
              </View>
            </View>

            <View style={styles.heroInfo}>
              <Text style={styles.name}>{profile.displayName}</Text>
              <Text style={styles.tagline}>{profile.headline ?? ''}</Text>

              <View style={styles.levelRow}>
                <Text style={styles.levelText}>Level {profile.currentLevel}</Text>
                <Text style={styles.xpText}>
                  {profile.totalXp.toLocaleString('sv-SE')} / {profile.nextLevelXp.toLocaleString('sv-SE')} XP
                </Text>
              </View>
              <View style={styles.largeProgressTrack}>
                <View style={[styles.largeProgressFill, { width: `${Math.min(profile.levelProgress * 100, 100)}%` }]} />
              </View>
              <Text style={styles.levelHint}>
                {`${profile.xpToNextLevel.toLocaleString('sv-SE')} XP kvar till Level ${profile.currentLevel + 1}`}
              </Text>

              <View style={styles.streakRow}>
                <View style={styles.streakPill}>
                  <Ionicons name="flame-outline" size={16} color="#FF9E4A" />
                  <Text style={styles.streakPillText}>{profile.currentStreak} dagars streak</Text>
                </View>
                <View style={styles.streakPill}>
                  <Ionicons name="trophy-outline" size={16} color="#F5C13C" />
                  <Text style={styles.streakPillText}>Bäst: {profile.bestStreak}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.statsGrid}>
          {profile.focusAreas.map((item) => (
            <View key={item.id} style={styles.statCard}>
              <Ionicons name={item.icon} size={24} color={item.color} />
              <Text style={styles.statTitle}>{item.title}</Text>
              <Text style={styles.statLevel}>Level {item.level}</Text>
              <View style={styles.smallProgressTrack}>
                <View
                  style={[
                    styles.smallProgressFill,
                    {
                      backgroundColor: item.color,
                      width: `${Math.min((item.currentXp / item.maxXp) * 100, 100)}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.statProgress}>
                {item.currentXp.toLocaleString('sv-SE')} / {item.maxXp.toLocaleString('sv-SE')}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <SectionHeader title="Senaste XP" />
          {profile.recentXp.map((entry, index) => (
            <View key={entry.id} style={[styles.xpEntryRow, index < profile.recentXp.length - 1 ? styles.rowBorder : null]}>
              <View style={styles.xpEntryText}>
                <Text style={styles.xpEntryTitle}>{entry.title}</Text>
                <Text style={styles.xpEntryDescription}>{entry.description}</Text>
              </View>
              <Text style={styles.xpEntryValue}>+{entry.amount} XP</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <SectionHeader title="Aktiva mål" action="Visa alla" onPress={openGoalsPage} />
          {profile.activeGoals.map((goal, index) => (
            <Pressable
              key={goal.id}
              onPress={() => openGoalFromProfile(goal.id)}
              style={[styles.goalRow, index < profile.activeGoals.length - 1 ? styles.rowBorder : null]}>
              <View style={[styles.goalIconWrap, { backgroundColor: `${goal.color}22` }]}>
                <Ionicons name={goal.icon} size={24} color={goal.color} />
              </View>
              <View style={styles.goalContent}>
                <View style={styles.goalTitleRow}>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#C7CDD7" />
                </View>
                <Text style={styles.goalSubtitle}>{goal.subtitle}</Text>
                <View style={styles.goalProgressRow}>
                  <View style={styles.goalProgressTrack}>
                    <View
                      style={[
                        styles.goalProgressFill,
                        { backgroundColor: goal.color, width: `${Math.min(goal.progress * 100, 100)}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.goalPercent}>{goal.percentLabel}</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <SectionHeader title="Quests idag" />
          {profile.dailyQuests.slice(0, 3).map((quest, index) => (
            <View key={quest.id} style={[styles.questRow, index < Math.min(profile.dailyQuests.length, 3) - 1 ? styles.rowBorder : null]}>
              <Ionicons
                name={quest.completed ? 'checkmark-circle' : 'ellipse-outline'}
                size={20}
                color={quest.color}
              />
              <View style={styles.questTextWrap}>
                <Text style={styles.questTitle}>{quest.title}</Text>
                <Text style={styles.questSubtitle}>{quest.progressLabel}</Text>
              </View>
              <Text style={styles.questXp}>+{quest.xpReward}</Text>
            </View>
          ))}
          <View style={styles.questSummaryRow}>
            <View style={styles.summaryPill}>
              <Text style={styles.summaryPillText}>{profile.statisticsSummary.completedQuests} quests klara</Text>
            </View>
            <View style={styles.summaryPill}>
              <Text style={styles.summaryPillText}>{profile.weeklyQuests.filter((quest) => quest.completed).length} weekly klara</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <SectionHeader title="Prestationer" />
          <View style={styles.achievementRow}>
            {profile.achievements.map((item) => (
              <View key={item.id} style={styles.achievementCard}>
                <View style={[styles.achievementIconWrap, { borderColor: item.color }]}>
                  <Ionicons name={item.icon} size={24} color={item.color} />
                </View>
                <Text style={styles.achievementTitle}>{item.title}</Text>
                <Text style={styles.achievementSubtitle}>{item.subtitle}</Text>
                <Text style={styles.achievementRarity}>{item.rarity}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <SectionHeader title="Statistik" action="Öppna" onPress={() => router.push('/statistics')} />
          <View style={styles.weeklyStatsRow}>
            {profile.weeklyStats.map((item, index) => (
              <View
                key={item.id}
                style={[styles.weeklyStatCard, index < profile.weeklyStats.length - 1 ? styles.weeklyStatDivider : null]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
                <Text style={styles.weeklyValue}>{item.value}</Text>
                <Text style={styles.weeklyLabel}>{item.label}</Text>
                <Text style={styles.weeklyDetail}>{item.detail}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <Modal transparent visible={Boolean(levelUpState)} animationType="fade" onRequestClose={() => setLevelUpState(null)}>
        <View style={styles.levelUpBackdrop}>
          <Animated.View
            style={[
              styles.levelUpCard,
              {
                opacity: levelUpOpacity,
                transform: [{ scale: levelUpScale }],
              },
            ]}>
            <View style={styles.levelUpGlow} />
            <Ionicons name="sparkles-outline" size={34} color="#F7F3FF" />
            <Text style={styles.levelUpEyebrow}>LEVEL UP</Text>
            <Text style={styles.levelUpTitle}>Level {levelUpState?.level}</Text>
            <Text style={styles.levelUpText}>Din karaktär har blivit starkare. Fortsätt bygga momentum.</Text>
            <Pressable onPress={() => setLevelUpState(null)} style={styles.levelUpButton}>
              <Text style={styles.levelUpButtonText}>Fortsätt</Text>
            </Pressable>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#090E16' },
  container: { flex: 1, backgroundColor: '#090E16' },
  content: { paddingBottom: 120, paddingHorizontal: 8 },
  achievementToast: {
    alignItems: 'center',
    backgroundColor: '#8B4EF4',
    borderRadius: 16,
    flexDirection: 'row',
    left: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    position: 'absolute',
    right: 16,
    top: 10,
    zIndex: 400,
  },
  achievementToastText: {
    marginLeft: 10,
  },
  achievementToastTitle: {
    color: '#F7F3FF',
    fontSize: 13,
    fontWeight: '800',
  },
  achievementToastSubtitle: {
    color: '#EFE4FF',
    fontSize: 12,
    marginTop: 3,
  },
  feedbackState: { alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  feedbackTitle: { color: '#F5F7FB', fontSize: 24, fontWeight: '700', marginTop: 18 },
  feedbackText: { color: '#97A0AE', fontSize: 14, lineHeight: 22, marginTop: 12, textAlign: 'center' },
  feedbackError: { color: '#C7CDD7', fontSize: 13, marginTop: 14, textAlign: 'center' },
  retryButton: {
    backgroundColor: '#8B4EF4',
    borderRadius: 12,
    marginTop: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  retryButtonText: { color: '#F7F3FF', fontSize: 14, fontWeight: '700' },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    marginTop: 8,
    paddingHorizontal: 8,
    zIndex: 200,
    elevation: 20,
  },
  screenTitle: { color: '#F5F7FB', fontSize: 30, fontWeight: '800' },
  settingsWrap: { position: 'relative', zIndex: 250, elevation: 24 },
  settingsButton: {
    alignItems: 'center',
    backgroundColor: '#141B26',
    borderColor: '#202938',
    borderRadius: 16,
    borderWidth: 1,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  settingsMenu: {
    backgroundColor: '#141B26',
    borderColor: '#202938',
    borderRadius: 16,
    borderWidth: 1,
    padding: 8,
    position: 'absolute',
    right: 0,
    top: 54,
    width: 150,
    zIndex: 300,
    elevation: 30,
  },
  settingsMenuItem: { alignItems: 'center', flexDirection: 'row', gap: 10, paddingHorizontal: 10, paddingVertical: 10 },
  settingsMenuText: { color: '#F7F3FF', fontSize: 14, fontWeight: '700' },
  levelUpBackdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(7, 10, 16, 0.7)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  levelUpCard: {
    alignItems: 'center',
    backgroundColor: '#141B26',
    borderColor: '#8B4EF4',
    borderRadius: 28,
    borderWidth: 1,
    overflow: 'hidden',
    paddingHorizontal: 24,
    paddingVertical: 28,
    width: '100%',
  },
  levelUpGlow: {
    backgroundColor: '#A866FF',
    borderRadius: 120,
    height: 120,
    opacity: 0.18,
    position: 'absolute',
    top: -20,
    width: 120,
  },
  levelUpEyebrow: {
    color: '#C9A9FF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.6,
    marginTop: 14,
  },
  levelUpTitle: {
    color: '#F7F3FF',
    fontSize: 34,
    fontWeight: '900',
    marginTop: 10,
  },
  levelUpText: {
    color: '#C7D0DB',
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10,
    textAlign: 'center',
  },
  levelUpButton: {
    backgroundColor: '#8B4EF4',
    borderRadius: 14,
    marginTop: 22,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  levelUpButtonText: {
    color: '#F7F3FF',
    fontSize: 14,
    fontWeight: '800',
  },
  heroCard: {
    backgroundColor: '#141B26',
    borderColor: '#202938',
    borderRadius: 26,
    borderWidth: 1,
    marginHorizontal: 8,
    marginTop: 4,
    padding: 18,
  },
  heroTop: { flexDirection: 'row', gap: 16 },
  avatarWrap: { alignItems: 'center', justifyContent: 'center' },
  avatarOuter: {
    alignItems: 'center',
    backgroundColor: '#8B4EF4',
    borderRadius: 42,
    height: 84,
    justifyContent: 'center',
    padding: 3,
    width: 84,
  },
  avatarInner: { alignItems: 'center', backgroundColor: '#D4B5FF', borderRadius: 39, flex: 1, justifyContent: 'center', width: '100%' },
  levelBadge: {
    backgroundColor: '#131A25',
    borderColor: '#8B4EF4',
    borderRadius: 14,
    borderWidth: 2,
    paddingHorizontal: 8,
    paddingVertical: 4,
    position: 'absolute',
    right: -4,
    top: 58,
  },
  levelBadgeText: { color: '#F7F3FF', fontSize: 13, fontWeight: '800' },
  heroInfo: { flex: 1 },
  name: { color: '#F5F7FB', fontSize: 24, fontWeight: '800' },
  tagline: { color: '#97A0AE', fontSize: 13, lineHeight: 20, marginTop: 6 },
  levelRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  levelText: { color: '#B77BFF', fontSize: 13, fontWeight: '700' },
  xpText: { color: '#C8D0DA', fontSize: 12, fontWeight: '700' },
  largeProgressTrack: { backgroundColor: '#2A3342', borderRadius: 999, height: 9, marginTop: 8, overflow: 'hidden' },
  largeProgressFill: { backgroundColor: '#A866FF', borderRadius: 999, height: '100%' },
  levelHint: { color: '#9AA3B2', fontSize: 12, marginTop: 8 },
  streakRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  streakPill: {
    alignItems: 'center',
    backgroundColor: '#1A2230',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  streakPillText: { color: '#F5F7FB', fontSize: 12, fontWeight: '700' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14, paddingHorizontal: 8 },
  statCard: {
    backgroundColor: '#141B26',
    borderColor: '#202938',
    borderRadius: 18,
    borderWidth: 1,
    minWidth: '47%',
    padding: 14,
    width: '47%',
  },
  statTitle: { color: '#F5F7FB', fontSize: 15, fontWeight: '700', marginTop: 10 },
  statLevel: { color: '#B1BAC9', fontSize: 12, marginTop: 4 },
  smallProgressTrack: { backgroundColor: '#2A3342', borderRadius: 999, height: 6, marginTop: 10, overflow: 'hidden' },
  smallProgressFill: { borderRadius: 999, height: '100%' },
  statProgress: { color: '#9AA3B2', fontSize: 11, marginTop: 8 },
  sectionCard: {
    backgroundColor: '#141B26',
    borderColor: '#202938',
    borderRadius: 22,
    borderWidth: 1,
    marginHorizontal: 8,
    marginTop: 14,
    padding: 16,
  },
  sectionHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { color: '#F5F7FB', fontSize: 19, fontWeight: '800' },
  sectionAction: { alignItems: 'center', flexDirection: 'row', gap: 4 },
  sectionActionText: { color: '#8D56F7', fontSize: 13, fontWeight: '700' },
  xpEntryRow: { alignItems: 'center', flexDirection: 'row', gap: 12, paddingVertical: 12 },
  xpEntryText: { flex: 1 },
  xpEntryTitle: { color: '#F5F7FB', fontSize: 15, fontWeight: '700' },
  xpEntryDescription: { color: '#97A0AE', fontSize: 12, lineHeight: 18, marginTop: 4 },
  xpEntryValue: { color: '#A866FF', fontSize: 14, fontWeight: '800' },
  rowBorder: { borderBottomColor: '#1F2837', borderBottomWidth: 1 },
  goalRow: { flexDirection: 'row', gap: 12, paddingVertical: 12 },
  goalIconWrap: { alignItems: 'center', borderRadius: 14, height: 44, justifyContent: 'center', width: 44 },
  goalContent: { flex: 1 },
  goalTitleRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  goalTitle: { color: '#F5F7FB', fontSize: 16, fontWeight: '700' },
  goalSubtitle: { color: '#97A0AE', fontSize: 13, marginTop: 4 },
  goalProgressRow: { alignItems: 'center', flexDirection: 'row', gap: 10, marginTop: 10 },
  goalProgressTrack: { backgroundColor: '#2A3342', borderRadius: 999, flex: 1, height: 6, overflow: 'hidden' },
  goalProgressFill: { borderRadius: 999, height: '100%' },
  goalPercent: { color: '#C9D1DA', fontSize: 12, fontWeight: '700' },
  questRow: { alignItems: 'center', flexDirection: 'row', gap: 12, paddingVertical: 12 },
  questTextWrap: { flex: 1 },
  questTitle: { color: '#F5F7FB', fontSize: 15, fontWeight: '700' },
  questSubtitle: { color: '#97A0AE', fontSize: 12, marginTop: 4 },
  questXp: { color: '#D7BCFF', fontSize: 13, fontWeight: '800' },
  questSummaryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  summaryPill: { backgroundColor: '#1A2230', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  summaryPillText: { color: '#DCE2EA', fontSize: 12, fontWeight: '700' },
  achievementRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  achievementCard: { minWidth: '31%', width: '31%' },
  achievementIconWrap: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 2,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  achievementTitle: { color: '#F5F7FB', fontSize: 14, fontWeight: '700', marginTop: 10 },
  achievementSubtitle: { color: '#97A0AE', fontSize: 12, lineHeight: 18, marginTop: 6 },
  achievementRarity: { color: '#B77BFF', fontSize: 11, fontWeight: '800', marginTop: 6 },
  weeklyStatsRow: { flexDirection: 'row', flexWrap: 'wrap' },
  weeklyStatCard: { minWidth: '25%', paddingHorizontal: 8, width: '25%' },
  weeklyStatDivider: { borderRightColor: '#1F2837', borderRightWidth: 1 },
  weeklyValue: { color: '#F5F7FB', fontSize: 28, fontWeight: '800', marginTop: 10 },
  weeklyLabel: { color: '#D7DEE7', fontSize: 13, fontWeight: '700', marginTop: 8 },
  weeklyDetail: { color: '#97A0AE', fontSize: 11, lineHeight: 16, marginTop: 8 },
});
