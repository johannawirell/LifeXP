import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, Animated, Easing, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LevelUpModal } from '@/components/profile/level-up-modal';
import { SectionHeader } from '@/components/profile/section-header';
import { profileStyles as styles } from '@/components/profile/styles';
import type { ProfileResponse } from '@/components/profile/types';
import { useSession } from '@/context/session-context';
import { useLiveUpdates } from '@/hooks/use-live-updates';
import { fetchJson } from '@/lib/api';

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
    router.push('/(tabs)/goals');
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

  const openQuestFromProfile = (quest: { goalId?: string }, focus: 'daily' | 'weekly') => {
    if (quest.goalId) {
      router.push({
        pathname: '/(tabs)/goals',
        params: {
          goalId: quest.goalId,
          tab: 'active',
          focus,
        },
      });
      return;
    }

    router.push({
      pathname: '/(tabs)/goals',
      params: {
        tab: 'active',
        focus,
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
            <Pressable
              key={quest.id}
              onPress={() => openQuestFromProfile(quest, 'daily')}
              style={[styles.questRow, index < Math.min(profile.dailyQuests.length, 3) - 1 ? styles.rowBorder : null]}>
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
            </Pressable>
          ))}
          {profile.weeklyQuests.slice(0, 2).map((quest) => (
            <Pressable key={quest.id} onPress={() => openQuestFromProfile(quest, 'weekly')} style={styles.questRow}>
              <Ionicons
                name={quest.completed ? 'checkmark-circle' : 'timer-outline'}
                size={20}
                color={quest.color}
              />
              <View style={styles.questTextWrap}>
                <Text style={styles.questTitle}>{quest.title}</Text>
                <Text style={styles.questSubtitle}>Weekly • {quest.progressLabel}</Text>
              </View>
              <Text style={styles.questXp}>+{quest.xpReward}</Text>
            </Pressable>
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
      <LevelUpModal
        visible={Boolean(levelUpState)}
        level={levelUpState?.level}
        opacity={levelUpOpacity}
        scale={levelUpScale}
        onClose={() => setLevelUpState(null)}
      />
    </SafeAreaView>
  );
}
