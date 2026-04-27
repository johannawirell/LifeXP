import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { fetchJson } from '@/lib/api';

const PROTOTYPE_USER_ID = 'demo-auth-user-1';

type ProfileResponse = {
  id: string;
  displayName: string;
  headline: string | null;
  currentLevel: number;
  totalXp: number;
  nextLevelXp: number;
  focusAreas: {
    id: string;
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
  achievements: {
    id: string;
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle: string;
    color: string;
  }[];
  weeklyStats: {
    id: string;
    icon: keyof typeof Ionicons.glyphMap;
    value: string;
    label: string;
    detail: string;
    color: string;
  }[];
};

function SectionHeader({ title, action }: { title: string; action?: string }) {
  return (
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
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchJson<ProfileResponse>(`/profile/${PROTOTYPE_USER_ID}`);
      setProfile(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadProfile();
  }, []);

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
            Starta `api-gateway` och `user-service`, och kontrollera att PostgreSQL är igång.
          </Text>
          <Text style={styles.feedbackError}>{error ?? 'Ingen profil hittades.'}</Text>
          <Pressable onPress={() => void loadProfile()} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Försök igen</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const xpLeft = Math.max(profile.nextLevelXp - profile.totalXp, 0);
  const levelProgress = profile.nextLevelXp > 0 ? (profile.totalXp / profile.nextLevelXp) * 100 : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Text style={styles.screenTitle}>Profil</Text>
          <Ionicons name="settings-outline" size={22} color="#F5F7FB" />
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
              <View style={styles.nameRow}>
                <Text style={styles.name}>{profile.displayName}</Text>
                <Ionicons name="pencil" size={15} color="#A866FF" />
              </View>
              <Text style={styles.tagline}>{profile.headline ?? ''}</Text>

              <View style={styles.levelRow}>
                <Text style={styles.levelText}>Level {profile.currentLevel}</Text>
                <Text style={styles.xpText}>
                  {profile.totalXp.toLocaleString('sv-SE')} / {profile.nextLevelXp.toLocaleString('sv-SE')} XP
                </Text>
              </View>
              <View style={styles.largeProgressTrack}>
                <View style={[styles.largeProgressFill, { width: `${Math.min(levelProgress, 100)}%` }]} />
              </View>
              <Text style={styles.levelHint}>
                {`${xpLeft.toLocaleString('sv-SE')} XP kvar till Level ${profile.currentLevel + 1}`}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.statsGrid}>
          {profile.focusAreas.map((item) => (
            <View key={item.title} style={styles.statCard}>
              <Ionicons name={item.icon} size={28} color={item.color} />
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
          <SectionHeader title="Aktiva mål" action="Visa alla" />
          {profile.activeGoals.map((goal, index) => (
            <View
              key={goal.id}
              style={[styles.goalRow, index < profile.activeGoals.length - 1 ? styles.goalRowBorder : null]}>
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
            </View>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <SectionHeader title="Prestationer" action="Visa alla" />
          <View style={styles.achievementRow}>
            {profile.achievements.map((item) => (
              <View key={item.id} style={styles.achievementCard}>
                <View style={[styles.achievementIconWrap, { borderColor: item.color }]}>
                  <Ionicons name={item.icon} size={26} color={item.color} />
                </View>
                <Text style={styles.achievementTitle}>{item.title}</Text>
                <Text style={styles.achievementSubtitle}>{item.subtitle}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <SectionHeader title="Statistik" action="Denna vecka" />
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
    paddingHorizontal: 8,
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
    paddingHorizontal: 8,
    paddingTop: 4,
  },
  screenTitle: {
    color: '#F5F7FB',
    fontSize: 34,
    fontWeight: '700',
  },
  heroCard: {
    backgroundColor: '#090E16',
    marginTop: 16,
    paddingHorizontal: 8,
  },
  heroTop: {
    flexDirection: 'row',
  },
  avatarWrap: {
    marginRight: 16,
    position: 'relative',
  },
  avatarOuter: {
    alignItems: 'center',
    backgroundColor: '#6F3FD7',
    borderRadius: 38,
    height: 76,
    justifyContent: 'center',
    shadowColor: '#8B4EF4',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    width: 76,
  },
  avatarInner: {
    alignItems: 'center',
    backgroundColor: '#B992FF',
    borderColor: '#D2BBFF',
    borderRadius: 34,
    borderWidth: 2,
    height: 68,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 68,
  },
  levelBadge: {
    alignItems: 'center',
    backgroundColor: '#23192D',
    borderColor: '#A866FF',
    borderRadius: 12,
    borderWidth: 1,
    bottom: -4,
    height: 24,
    justifyContent: 'center',
    position: 'absolute',
    right: -6,
    width: 24,
  },
  levelBadgeText: {
    color: '#F5F7FB',
    fontSize: 12,
    fontWeight: '700',
  },
  heroInfo: {
    flex: 1,
    paddingTop: 4,
  },
  nameRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  name: {
    color: '#F4F6FB',
    fontSize: 20,
    fontWeight: '700',
  },
  tagline: {
    color: '#6F7784',
    fontSize: 12,
    marginTop: 4,
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  levelText: {
    color: '#A866FF',
    fontSize: 18,
    fontWeight: '700',
  },
  xpText: {
    color: '#B5BCC8',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  largeProgressTrack: {
    backgroundColor: '#2A2F3A',
    borderRadius: 999,
    height: 8,
    marginTop: 8,
    overflow: 'hidden',
  },
  largeProgressFill: {
    backgroundColor: '#A866FF',
    borderRadius: 999,
    height: '100%',
    width: '82%',
  },
  levelHint: {
    color: '#97A0AE',
    fontSize: 12,
    marginTop: 8,
  },
  statsGrid: {
    backgroundColor: '#151B24',
    borderColor: '#1F2632',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 18,
    overflow: 'hidden',
  },
  statCard: {
    borderColor: '#1F2632',
    borderRightWidth: 1,
    borderTopWidth: 1,
    minHeight: 114,
    paddingHorizontal: 14,
    paddingTop: 14,
    width: '50%',
  },
  statTitle: {
    color: '#F5F7FB',
    fontSize: 17,
    fontWeight: '700',
    marginTop: 8,
  },
  statLevel: {
    color: '#8A93A2',
    fontSize: 12,
    marginTop: 3,
  },
  smallProgressTrack: {
    backgroundColor: '#2B313E',
    borderRadius: 999,
    height: 6,
    marginTop: 10,
    overflow: 'hidden',
  },
  smallProgressFill: {
    borderRadius: 999,
    height: '100%',
  },
  statProgress: {
    color: '#808A99',
    fontSize: 12,
    marginTop: 8,
  },
  sectionCard: {
    backgroundColor: '#151B24',
    borderColor: '#1F2632',
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#798191',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  sectionAction: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 2,
  },
  sectionActionText: {
    color: '#8D56F7',
    fontSize: 13,
    fontWeight: '600',
  },
  goalRow: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  goalRowBorder: {
    borderBottomColor: '#1F2632',
    borderBottomWidth: 1,
  },
  goalIconWrap: {
    alignItems: 'center',
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
    marginRight: 12,
    width: 40,
  },
  goalContent: {
    flex: 1,
  },
  goalTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalTitle: {
    color: '#F5F7FB',
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    marginRight: 8,
  },
  goalSubtitle: {
    color: '#8B93A0',
    fontSize: 12,
    marginTop: 4,
  },
  goalProgressRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  goalProgressTrack: {
    backgroundColor: '#2B313E',
    borderRadius: 999,
    flex: 1,
    height: 6,
    overflow: 'hidden',
  },
  goalProgressFill: {
    borderRadius: 999,
    height: '100%',
  },
  goalPercent: {
    color: '#7E8898',
    fontSize: 12,
    fontWeight: '700',
    width: 34,
  },
  achievementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: '18%',
  },
  achievementIconWrap: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1.5,
    height: 46,
    justifyContent: 'center',
    marginBottom: 8,
    width: 46,
  },
  achievementTitle: {
    color: '#DCE1EA',
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 13,
  },
  achievementSubtitle: {
    color: '#7E8898',
    fontSize: 8,
    lineHeight: 11,
    marginTop: 4,
  },
  weeklyStatsRow: {
    flexDirection: 'row',
  },
  weeklyStatCard: {
    flex: 1,
    minHeight: 122,
    paddingHorizontal: 10,
    paddingTop: 6,
  },
  weeklyStatDivider: {
    borderRightColor: '#1F2632',
    borderRightWidth: 1,
  },
  weeklyValue: {
    color: '#F4F6FB',
    fontSize: 28,
    fontWeight: '700',
    marginTop: 10,
  },
  weeklyLabel: {
    color: '#D8DEE7',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  weeklyDetail: {
    color: '#8A93A2',
    fontSize: 9,
    marginTop: 6,
  },
});
