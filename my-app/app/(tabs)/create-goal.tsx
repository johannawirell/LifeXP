import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSession } from '@/context/session-context';
import { fetchJson } from '@/lib/api';

type GoalTemplatePageResponse = {
  steps: { id: number; label: string; complete: boolean }[];
  categories: { key: string; label: string; icon: keyof typeof Ionicons.glyphMap; active: boolean }[];
  templates: {
    id: string;
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    subtitle: string;
    description: string;
    category: string;
    color: string;
  }[];
};

export default function CreateGoalScreen() {
  const { mode } = useSession();
  const [page, setPage] = useState<GoalTemplatePageResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchJson<GoalTemplatePageResponse>('/goals/templates/list');
      setPage(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadTemplates();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.feedbackState}>
          <ActivityIndicator size="large" color="#A866FF" />
          <Text style={styles.feedbackText}>Hämtar målmallar...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !page) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.feedbackState}>
          <Ionicons name="cloud-offline-outline" size={42} color="#A866FF" />
          <Text style={styles.feedbackTitle}>Målmallar kunde inte hämtas</Text>
          <Text style={styles.feedbackText}>Kontrollera att `goals-service` och `api-gateway` kör.</Text>
          <Text style={styles.feedbackError}>{error ?? 'Ingen data hittades.'}</Text>
          <Pressable onPress={() => void loadTemplates()} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Försök igen</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Ionicons name="arrow-back" size={24} color="#F5F7FB" />
        <Text style={styles.screenTitle}>Lägg till mål</Text>
        <View style={styles.topBarSpacer} />
      </View>

        {mode === 'empty' ? (
          <View style={styles.modeBadge}>
            <Text style={styles.modeBadgeText}>Ny användare</Text>
          </View>
        ) : null}

        <View style={styles.stepsRow}>
          {page.steps.map((step, index) => (
            <View key={step.id} style={styles.stepItem}>
              <View style={[styles.stepCircle, step.complete ? styles.stepCircleActive : null]}>
                <Text style={[styles.stepNumber, step.complete ? styles.stepNumberActive : null]}>{step.id}</Text>
              </View>
              {index < page.steps.length - 1 ? <View style={styles.stepLine} /> : null}
              <Text style={[styles.stepLabel, step.complete ? styles.stepLabelActive : null]}>{step.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Välj ett mål</Text>
        <Text style={styles.sectionSubtitle}>Välj ett mål eller skapa ditt eget</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
          {page.categories.map((category) => (
            <View key={category.key} style={styles.categoryItem}>
              <View style={[styles.categoryIconWrap, category.active ? styles.categoryIconWrapActive : null]}>
                <Ionicons
                  name={category.icon}
                  size={24}
                  color={category.active ? '#A866FF' : '#9AA3B2'}
                />
              </View>
              <Text style={[styles.categoryText, category.active ? styles.categoryTextActive : null]}>
                {category.label}
              </Text>
            </View>
          ))}
        </ScrollView>

        {page.templates.map((template) => (
          <View key={template.id} style={styles.templateCard}>
            <View style={[styles.templateIconWrap, { backgroundColor: `${template.color}22` }]}>
              <Ionicons name={template.icon} size={28} color={template.color} />
            </View>
            <View style={styles.templateContent}>
              <Text style={styles.templateTitle}>{template.title}</Text>
              <Text style={styles.templateDescription}>{template.description}</Text>
              <View style={[styles.templateTag, { backgroundColor: `${template.color}22` }]}>
                <Text style={[styles.templateTagText, { color: template.color }]}>{template.category}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#D8DEE7" />
          </View>
        ))}

        <View style={styles.createOwnCard}>
          <Ionicons name="add" size={30} color="#A866FF" />
          <View style={styles.createOwnTextWrap}>
            <Text style={styles.createOwnTitle}>Skapa eget mål</Text>
            <Text style={styles.createOwnSubtitle}>Sätt ditt eget mål helt från början</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoIconWrap}>
            <Ionicons name="star-outline" size={22} color="#A866FF" />
          </View>
          <View style={styles.infoTextWrap}>
            <Text style={styles.infoTitle}>Alla mål bryts ner i delmål</Text>
            <Text style={styles.infoSubtitle}>
              Vi skapar en personlig plan som hjälper dig att nå ditt mål steg för steg.
            </Text>
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
  topBarSpacer: {
    width: 24,
  },
  modeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#1E1930',
    borderRadius: 999,
    marginLeft: 20,
    marginTop: 18,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  modeBadgeText: {
    color: '#C9A9FF',
    fontSize: 12,
    fontWeight: '700',
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 28,
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  stepCircle: {
    alignItems: 'center',
    backgroundColor: '#151B24',
    borderColor: '#3A4250',
    borderRadius: 22,
    borderWidth: 2,
    height: 44,
    justifyContent: 'center',
    width: 44,
    zIndex: 2,
  },
  stepCircleActive: {
    backgroundColor: '#8B4EF4',
    borderColor: '#8B4EF4',
  },
  stepNumber: {
    color: '#D6DCE7',
    fontSize: 18,
    fontWeight: '700',
  },
  stepNumberActive: {
    color: '#F7F3FF',
  },
  stepLine: {
    backgroundColor: '#343C49',
    height: 2,
    left: '50%',
    position: 'absolute',
    top: 22,
    width: '100%',
  },
  stepLabel: {
    color: '#8A93A2',
    fontSize: 12,
    marginTop: 12,
  },
  stepLabelActive: {
    color: '#F5F7FB',
    fontWeight: '600',
  },
  divider: {
    backgroundColor: '#1E2530',
    height: 1,
    marginTop: 26,
  },
  sectionTitle: {
    color: '#F5F7FB',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 20,
    marginTop: 26,
  },
  sectionSubtitle: {
    color: '#8A93A2',
    fontSize: 14,
    marginLeft: 20,
    marginTop: 8,
  },
  categoryRow: {
    gap: 22,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  categoryItem: {
    alignItems: 'center',
    width: 64,
  },
  categoryIconWrap: {
    alignItems: 'center',
    backgroundColor: '#121824',
    borderRadius: 16,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  categoryIconWrapActive: {
    backgroundColor: '#1E1930',
  },
  categoryText: {
    color: '#9AA3B2',
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
  },
  categoryTextActive: {
    color: '#F5F7FB',
  },
  templateCard: {
    alignItems: 'center',
    backgroundColor: '#151B24',
    borderColor: '#1F2632',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  templateIconWrap: {
    alignItems: 'center',
    borderRadius: 14,
    height: 50,
    justifyContent: 'center',
    width: 50,
  },
  templateContent: {
    flex: 1,
    marginHorizontal: 14,
  },
  templateTitle: {
    color: '#F5F7FB',
    fontSize: 18,
    fontWeight: '700',
  },
  templateDescription: {
    color: '#C5CCD8',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },
  templateTag: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  templateTagText: {
    fontSize: 12,
    fontWeight: '700',
  },
  createOwnCard: {
    alignItems: 'center',
    borderColor: '#8B4EF4',
    borderRadius: 18,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 18,
    paddingHorizontal: 22,
    paddingVertical: 22,
  },
  createOwnTextWrap: {
    marginLeft: 16,
  },
  createOwnTitle: {
    color: '#A866FF',
    fontSize: 18,
    fontWeight: '700',
  },
  createOwnSubtitle: {
    color: '#D2D8E2',
    fontSize: 13,
    marginTop: 6,
  },
  infoCard: {
    backgroundColor: '#171B2A',
    borderColor: '#252B3A',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  infoIconWrap: {
    alignItems: 'center',
    backgroundColor: '#2A1E45',
    borderRadius: 16,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  infoTextWrap: {
    flex: 1,
    marginLeft: 14,
  },
  infoTitle: {
    color: '#F5F7FB',
    fontSize: 16,
    fontWeight: '700',
  },
  infoSubtitle: {
    color: '#C8CFDA',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },
});
