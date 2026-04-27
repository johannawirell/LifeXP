import Ionicons from '@expo/vector-icons/Ionicons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const focusStats = [
  {
    icon: 'locate-outline' as const,
    title: 'Fokus',
    level: 'Level 14',
    progress: '1 250 / 2 000',
    color: '#5E8BFF',
  },
  {
    icon: 'flash-outline' as const,
    title: 'Energi',
    level: 'Level 11',
    progress: '980 / 1 800',
    color: '#F5B333',
  },
  {
    icon: 'shield-checkmark-outline' as const,
    title: 'Disciplin',
    level: 'Level 13',
    progress: '1 600 / 2 200',
    color: '#67D86F',
  },
  {
    icon: 'leaf-outline' as const,
    title: 'Balans',
    level: 'Level 10',
    progress: '700 / 1 600',
    color: '#A866FF',
  },
];

const activeGoals = [
  {
    icon: 'walk-outline' as const,
    title: 'Springa 5 km',
    subtitle: 'steg 3 av 4',
    progress: 0.6,
    color: '#73D86A',
    percent: '60 %',
  },
  {
    icon: 'school-outline' as const,
    title: 'Klara kursen i Matematik 2',
    subtitle: 'steg 2 av 5',
    progress: 0.4,
    color: '#B269FF',
    percent: '40 %',
  },
  {
    icon: 'ban-outline' as const,
    title: 'Sluta med alkohol',
    subtitle: '12 dagar i rad',
    progress: 0.8,
    color: '#F08A45',
    percent: '80 %',
  },
];

const achievements = [
  {
    icon: 'flame-outline' as const,
    title: '7 dagars streak',
    subtitle: '2+ gånger',
    color: '#FF8A3C',
  },
  {
    icon: 'trophy-outline' as const,
    title: 'Fokusmästare',
    subtitle: 'Uppnått Level 10 i Fokus',
    color: '#F5C13C',
  },
  {
    icon: 'locate-outline' as const,
    title: 'Måljägare',
    subtitle: 'Slutfört 5 mål',
    color: '#67D86F',
  },
  {
    icon: 'fitness-outline' as const,
    title: 'Disciplinerad',
    subtitle: '30 dagars streak',
    color: '#62A5FF',
  },
  {
    icon: 'person-outline' as const,
    title: 'Lugn i sinnet',
    subtitle: '10 dagar meditation',
    color: '#A866FF',
  },
];

const weeklyStats = [
  {
    icon: 'checkmark-circle-outline' as const,
    value: '24',
    label: 'Tasks klara',
    detail: '+12 % från förra veckan',
    color: '#A866FF',
  },
  {
    icon: 'star-outline' as const,
    value: '3 240',
    label: 'XP denna vecka',
    detail: '+18 % från förra veckan',
    color: '#F5C13C',
  },
  {
    icon: 'radio-button-on-outline' as const,
    value: '88 %',
    label: 'Måluppfyllelse',
    detail: '+9 % från förra veckan',
    color: '#67D86F',
  },
  {
    icon: 'flame-outline' as const,
    value: '12',
    label: 'Dagar i streak',
    detail: 'Bästa: 12 dagar',
    color: '#FF8A3C',
  },
];

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
                <Text style={styles.levelBadgeText}>12</Text>
              </View>
            </View>

            <View style={styles.heroInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>Alex</Text>
                <Ionicons name="pencil" size={15} color="#A866FF" />
              </View>
              <Text style={styles.tagline}>Fokuserad • Disciplinerad • På väg upp</Text>

              <View style={styles.levelRow}>
                <Text style={styles.levelText}>Level 12</Text>
                <Text style={styles.xpText}>2 450 / 3 000 XP</Text>
              </View>
              <View style={styles.largeProgressTrack}>
                <View style={styles.largeProgressFill} />
              </View>
              <Text style={styles.levelHint}>550 XP kvar till Level 13</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsGrid}>
          {focusStats.map((item) => (
            <View key={item.title} style={styles.statCard}>
              <Ionicons name={item.icon} size={28} color={item.color} />
              <Text style={styles.statTitle}>{item.title}</Text>
              <Text style={styles.statLevel}>{item.level}</Text>
              <View style={styles.smallProgressTrack}>
                <View style={[styles.smallProgressFill, { backgroundColor: item.color, width: '58%' }]} />
              </View>
              <Text style={styles.statProgress}>{item.progress}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <SectionHeader title="Aktiva mål" action="Visa alla" />
          {activeGoals.map((goal, index) => (
            <View
              key={goal.title}
              style={[styles.goalRow, index < activeGoals.length - 1 ? styles.goalRowBorder : null]}>
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
                        { backgroundColor: goal.color, width: `${goal.progress * 100}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.goalPercent}>{goal.percent}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <SectionHeader title="Prestationer" action="Visa alla" />
          <View style={styles.achievementRow}>
            {achievements.map((item) => (
              <View key={item.title} style={styles.achievementCard}>
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
            {weeklyStats.map((item, index) => (
              <View
                key={item.label}
                style={[styles.weeklyStatCard, index < weeklyStats.length - 1 ? styles.weeklyStatDivider : null]}>
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
