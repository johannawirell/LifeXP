import Ionicons from '@expo/vector-icons/Ionicons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSession } from '@/context/session-context';
import { useLiveUpdates } from '@/hooks/use-live-updates';
import { fetchJson } from '@/lib/api';

type StatisticsResponse = {
  weeklyCards: {
    id: string;
    icon: keyof typeof Ionicons.glyphMap;
    value: string;
    label: string;
    detail: string;
    color: string;
  }[];
  statisticsCards: {
    id: string;
    icon: keyof typeof Ionicons.glyphMap;
    value: string;
    label: string;
    detail: string;
    color: string;
  }[];
  periods: {
    id: string;
    key: 'daily' | 'weekly' | 'monthly';
    label: string;
    totalXp: number;
    completedQuests: number;
    completedGoals: number;
    streakDays: number;
    activityScore: number;
  }[];
  activity: {
    id: string;
    period: 'daily' | 'weekly' | 'monthly';
    label: string;
    value: number;
  }[];
  categoryProgress: {
    id: string;
    key: string;
    label: string;
    level: number;
    currentXp: number;
    nextLevelXp: number;
    color: string;
  }[];
  liveSummary: {
    totalXp: number;
    level: number;
    xpToNextLevel: number;
    completedQuests: number;
    completedGoals: number;
    currentStreak: number;
  };
};

type PeriodKey = 'daily' | 'weekly' | 'monthly';

const tabs: { key: PeriodKey; label: string }[] = [
  { key: 'daily', label: 'Dag' },
  { key: 'weekly', label: 'Vecka' },
  { key: 'monthly', label: 'Månad' },
];

export default function StatisticsScreen() {
  const { mode, userId } = useSession();
  const [stats, setStats] = useState<StatisticsResponse | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodKey>('weekly');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadStats = useCallback(async () => {
    if (mode === 'empty') {
      setStats(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    if (!userId) {
      setStats(null);
      setError('Ingen användare vald.');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchJson<StatisticsResponse>(`/statistics/${userId}`);
      setStats(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [mode, userId]);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  useLiveUpdates(
    userId,
    useCallback(
      async (event) => {
        if (!event.resources.includes('statistics') || mode === 'empty' || !userId) {
          return;
        }

        try {
          const data = await fetchJson<StatisticsResponse>(`/statistics/${userId}`);
          setStats(data);
        } catch {
          // Keep current stats visible if a pushed refresh fails.
        }
      },
      [mode, userId]
    ),
    { enabled: mode !== 'empty' && Boolean(userId) }
  );

  const selectedSummary = useMemo(
    () => stats?.periods.find((period) => period.key === selectedPeriod) ?? stats?.periods[0] ?? null,
    [selectedPeriod, stats?.periods]
  );

  const selectedActivity = useMemo(
    () => stats?.activity.filter((point) => point.period === selectedPeriod) ?? [],
    [selectedPeriod, stats?.activity]
  );

  if (mode === 'empty') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.feedbackState}>
          <Ionicons name="stats-chart-outline" size={44} color="#A866FF" />
          <Text style={styles.title}>Statistik</Text>
          <Text style={styles.text}>
            Ingen statistik finns ännu eftersom den här användaren precis skapats. Bygg upp quests, XP och streaks först.
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
          <Text style={styles.text}>Laddar statistik...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !stats || !selectedSummary) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.feedbackState}>
          <Ionicons name="cloud-offline-outline" size={42} color="#A866FF" />
          <Text style={styles.title}>Statistik kunde inte hämtas</Text>
          <Text style={styles.text}>{error ?? 'Ingen statistikdata hittades.'}</Text>
          <Pressable onPress={() => void loadStats()} style={styles.button}>
            <Text style={styles.buttonText}>Försök igen</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const maxActivity = Math.max(...selectedActivity.map((point) => point.value), 1);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>Statistik</Text>

        <View style={styles.heroCard}>
          <View style={styles.heroGlowPrimary} />
          <View style={styles.heroGlowSecondary} />
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroLabel}>Total XP</Text>
              <Text style={styles.heroValue}>{stats.liveSummary.totalXp.toLocaleString('sv-SE')}</Text>
            </View>
            <View>
              <Text style={styles.heroLabel}>Level</Text>
              <Text style={styles.heroValue}>{stats.liveSummary.level}</Text>
            </View>
            <View>
              <Text style={styles.heroLabel}>Streak</Text>
              <Text style={styles.heroValue}>{stats.liveSummary.currentStreak}</Text>
            </View>
          </View>
          <Text style={styles.heroHint}>
            {stats.liveSummary.xpToNextLevel.toLocaleString('sv-SE')} XP kvar till nästa level
          </Text>
        </View>

        <View style={styles.metricsGrid}>
          {stats.statisticsCards.map((card) => (
            <View key={card.id} style={styles.metricCard}>
              <View style={[styles.metricIconWrap, { backgroundColor: `${card.color}18` }]}>
                <Ionicons name={card.icon} size={18} color={card.color} />
              </View>
              <Text style={styles.metricValue}>{card.value}</Text>
              <Text style={styles.metricLabel}>{card.label}</Text>
              <Text style={styles.metricDetail}>{card.detail}</Text>
            </View>
          ))}
        </View>

        <View style={styles.weeklyStatsRow}>
          {stats.weeklyCards.map((card) => (
            <View key={card.id} style={styles.weeklyCard}>
              <Ionicons name={card.icon} size={18} color={card.color} />
              <Text style={styles.weeklyValue}>{card.value}</Text>
              <Text style={styles.weeklyLabel}>{card.label}</Text>
              <Text style={styles.weeklyDetail}>{card.detail}</Text>
            </View>
          ))}
        </View>

        <View style={styles.tabRow}>
          {tabs.map((tab) => (
            <Pressable
              key={tab.key}
              onPress={() => setSelectedPeriod(tab.key)}
              style={[styles.tabButton, selectedPeriod === tab.key ? styles.tabButtonActive : null]}>
              <Text style={[styles.tabText, selectedPeriod === tab.key ? styles.tabTextActive : null]}>{tab.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>{selectedSummary.label}</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryMetric}>
              <Text style={styles.summaryMetricValue}>{selectedSummary.totalXp}</Text>
              <Text style={styles.summaryMetricLabel}>XP</Text>
            </View>
            <View style={styles.summaryMetric}>
              <Text style={styles.summaryMetricValue}>{selectedSummary.completedQuests}</Text>
              <Text style={styles.summaryMetricLabel}>Quests klara</Text>
            </View>
            <View style={styles.summaryMetric}>
              <Text style={styles.summaryMetricValue}>{selectedSummary.completedGoals}</Text>
              <Text style={styles.summaryMetricLabel}>Goals klara</Text>
            </View>
            <View style={styles.summaryMetric}>
              <Text style={styles.summaryMetricValue}>{selectedSummary.activityScore}%</Text>
              <Text style={styles.summaryMetricLabel}>Aktivitet</Text>
            </View>
          </View>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Aktivitet</Text>
          <View style={styles.chartRow}>
            {selectedActivity.map((point) => (
              <View key={point.id} style={styles.chartBarWrap}>
                <View style={styles.chartTrack}>
                  <View style={[styles.chartFill, { height: `${Math.max((point.value / maxActivity) * 100, 12)}%` }]} />
                </View>
                <Text style={styles.chartValue}>{point.value}</Text>
                <Text style={styles.chartLabel}>{point.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.categoryCard}>
          <Text style={styles.sectionTitle}>Category progress</Text>
          {stats.categoryProgress.map((item, index) => (
            <View key={item.id} style={[styles.categoryRow, index < stats.categoryProgress.length - 1 ? styles.categoryBorder : null]}>
              <View style={styles.categoryText}>
                <Text style={styles.categoryTitle}>{item.label}</Text>
                <Text style={styles.categoryLevel}>Level {item.level}</Text>
                <View style={styles.categoryTrack}>
                  <View
                    style={[
                      styles.categoryFill,
                      {
                        backgroundColor: item.color,
                        width: `${Math.min((item.currentXp / item.nextLevelXp) * 100, 100)}%`,
                      },
                    ]}
                  />
                </View>
              </View>
              <Text style={styles.categoryXp}>
                {item.currentXp} / {item.nextLevelXp}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#090E16' },
  container: { flex: 1, backgroundColor: '#090E16' },
  content: { paddingBottom: 120, paddingHorizontal: 16 },
  feedbackState: { alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  screenTitle: { color: '#F5F7FB', fontSize: 30, fontWeight: '800', marginBottom: 18, marginTop: 8 },
  title: { color: '#F5F7FB', fontSize: 28, fontWeight: '700', marginTop: 18 },
  text: { color: '#9AA3B2', fontSize: 15, lineHeight: 24, marginTop: 12, textAlign: 'center' },
  button: {
    backgroundColor: '#8B4EF4',
    borderRadius: 12,
    marginTop: 20,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  buttonText: { color: '#F7F3FF', fontSize: 14, fontWeight: '700' },
  heroCard: {
    backgroundColor: '#141B26',
    borderColor: '#202938',
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 18,
    position: 'relative',
  },
  heroGlowPrimary: {
    backgroundColor: '#8B4EF4',
    borderRadius: 160,
    height: 220,
    opacity: 0.16,
    position: 'absolute',
    right: -80,
    top: -100,
    width: 220,
  },
  heroGlowSecondary: {
    backgroundColor: '#5E8BFF',
    borderRadius: 120,
    height: 160,
    left: -70,
    opacity: 0.12,
    position: 'absolute',
    top: 40,
    width: 160,
  },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between' },
  heroLabel: { color: '#98A2B3', fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  heroValue: { color: '#F5F7FB', fontSize: 28, fontWeight: '800', marginTop: 8 },
  heroHint: { color: '#B7C0CF', fontSize: 13, marginTop: 12 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 },
  metricCard: {
    backgroundColor: '#141B26',
    borderColor: '#202938',
    borderRadius: 22,
    borderWidth: 1,
    minHeight: 138,
    minWidth: '47%',
    overflow: 'hidden',
    padding: 16,
    position: 'relative',
    width: '47%',
  },
  metricIconWrap: {
    alignItems: 'center',
    borderRadius: 14,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  metricValue: { color: '#F5F7FB', fontSize: 28, fontWeight: '800', marginTop: 14 },
  metricLabel: { color: '#D7DEE7', fontSize: 14, fontWeight: '700', marginTop: 8 },
  metricDetail: { color: '#97A0AE', fontSize: 12, lineHeight: 18, marginTop: 8 },
  weeklyStatsRow: {
    backgroundColor: '#141B26',
    borderColor: '#202938',
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 14,
    padding: 16,
  },
  weeklyCard: {
    backgroundColor: '#0F1520',
    borderColor: '#202938',
    borderRadius: 18,
    borderWidth: 1,
    minWidth: '47%',
    padding: 14,
    width: '47%',
  },
  weeklyValue: { color: '#F5F7FB', fontSize: 22, fontWeight: '800', marginTop: 8 },
  weeklyLabel: { color: '#D7DEE7', fontSize: 12, fontWeight: '700', marginTop: 6 },
  weeklyDetail: { color: '#97A0AE', fontSize: 11, lineHeight: 16, marginTop: 6 },
  tabRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  tabButton: {
    backgroundColor: '#141B26',
    borderColor: '#202938',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tabButtonActive: { backgroundColor: '#24183B', borderColor: '#8B4EF4' },
  tabText: { color: '#97A0AE', fontSize: 13, fontWeight: '700' },
  tabTextActive: { color: '#F7F3FF' },
  summaryCard: {
    backgroundColor: '#141B26',
    borderColor: '#202938',
    borderRadius: 24,
    borderWidth: 1,
    marginTop: 14,
    padding: 18,
  },
  sectionTitle: { color: '#F5F7FB', fontSize: 18, fontWeight: '800', marginBottom: 14 },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  summaryMetric: {
    backgroundColor: '#0F1520',
    borderColor: '#202938',
    borderRadius: 16,
    borderWidth: 1,
    minWidth: '47%',
    padding: 14,
    width: '47%',
  },
  summaryMetricValue: { color: '#F5F7FB', fontSize: 24, fontWeight: '800' },
  summaryMetricLabel: { color: '#9AA3B2', fontSize: 12, fontWeight: '700', marginTop: 6 },
  chartCard: {
    backgroundColor: '#141B26',
    borderColor: '#202938',
    borderRadius: 24,
    borderWidth: 1,
    marginTop: 14,
    padding: 18,
  },
  chartRow: { alignItems: 'flex-end', flexDirection: 'row', gap: 12, height: 220 },
  chartBarWrap: { alignItems: 'center', flex: 1, justifyContent: 'flex-end' },
  chartTrack: {
    alignItems: 'center',
    backgroundColor: '#111924',
    borderRadius: 999,
    height: 140,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    width: 18,
  },
  chartFill: { backgroundColor: '#A866FF', borderRadius: 999, width: '100%' },
  chartValue: { color: '#F5F7FB', fontSize: 12, fontWeight: '700', marginTop: 8 },
  chartLabel: { color: '#97A0AE', fontSize: 11, marginTop: 4 },
  categoryCard: {
    backgroundColor: '#141B26',
    borderColor: '#202938',
    borderRadius: 24,
    borderWidth: 1,
    marginTop: 14,
    padding: 18,
  },
  categoryRow: { flexDirection: 'row', gap: 12, paddingVertical: 12 },
  categoryBorder: { borderBottomColor: '#1F2837', borderBottomWidth: 1 },
  categoryText: { flex: 1 },
  categoryTitle: { color: '#F5F7FB', fontSize: 15, fontWeight: '700' },
  categoryLevel: { color: '#97A0AE', fontSize: 12, marginTop: 4 },
  categoryTrack: { backgroundColor: '#2A3342', borderRadius: 999, height: 7, marginTop: 10, overflow: 'hidden' },
  categoryFill: { borderRadius: 999, height: '100%' },
  categoryXp: { color: '#D7DEE7', fontSize: 12, fontWeight: '700' },
});
