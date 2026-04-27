import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSession } from '@/context/session-context';
import { fetchJson, postJson } from '@/lib/api';

type GoalTemplateSummary = {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  subtitle: string;
  summaryDescription: string;
  category: string;
  color: string;
  summaryDetails: {
    id: string;
    label: string;
    value: string;
  }[];
  milestones: {
    id: string;
    title: string;
  }[];
};

type GoalTemplatePageResponse = {
  steps: { id: number; label: string; complete: boolean }[];
  categories: { key: string; label: string; icon: keyof typeof Ionicons.glyphMap; active: boolean }[];
  selectedCategory: string;
  templates: GoalTemplateSummary[];
};

type GoalTemplateDetailResponse = {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  subtitle: string;
  summaryDescription: string;
  detailDescription: string;
  category: string;
  color: string;
  summaryDetails: {
    id: string;
    label: string;
    value: string;
  }[];
  detailDetails: {
    id: string;
    label: string;
    value: string;
  }[];
  milestones: {
    id: string;
    title: string;
    description?: string;
  }[];
};

type CreateGoalResponse = {
  goalId: string;
  userId: string;
  templateId: string;
  message: string;
};

export default function CreateGoalScreen() {
  const { mode, userId } = useSession();
  const [page, setPage] = useState<GoalTemplatePageResponse | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('popular');
  const [selectedTemplate, setSelectedTemplate] = useState<GoalTemplateDetailResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isCreatingGoal, setIsCreatingGoal] = useState(false);

  const loadTemplates = async (category: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchJson<GoalTemplatePageResponse>(`/goals/templates/list?category=${category}`);
      setPage(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTemplateDetail = async (templateId: string) => {
    try {
      setIsDetailLoading(true);
      setError(null);
      const data = await fetchJson<GoalTemplateDetailResponse>(`/goals/templates/${templateId}`);
      setSelectedTemplate(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unknown error');
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleCreateGoal = async () => {
    if (!userId || !selectedTemplate) {
      return;
    }

    try {
      setIsCreatingGoal(true);
      await postJson<CreateGoalResponse>(`/goals/${userId}/from-template/${selectedTemplate.id}`);
      Alert.alert('Mål tillagt', 'Målet har lagts till i din lista.');
      setSelectedTemplate(null);
      router.push('/(tabs)/goals');
    } catch (createError) {
      Alert.alert(
        'Målet kunde inte läggas till',
        createError instanceof Error ? createError.message : 'Unknown error'
      );
    } finally {
      setIsCreatingGoal(false);
    }
  };

  useEffect(() => {
    void loadTemplates(selectedCategory);
  }, [selectedCategory]);

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
          <Pressable onPress={() => void loadTemplates(selectedCategory)} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Försök igen</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const isDetailView = Boolean(selectedTemplate) || isDetailLoading;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Pressable onPress={() => (selectedTemplate ? setSelectedTemplate(null) : router.back())}>
            <Ionicons name="arrow-back" size={24} color="#F5F7FB" />
          </Pressable>
          <Text style={styles.screenTitle}>{selectedTemplate ? 'Måldetaljer' : 'Lägg till mål'}</Text>
          <View style={styles.topBarSpacer} />
        </View>

        {mode === 'empty' ? (
          <View style={styles.modeBadge}>
            <Text style={styles.modeBadgeText}>Ny användare</Text>
          </View>
        ) : null}

        <View style={styles.stepsRow}>
          {page.steps.map((step, index) => {
            const isActive = selectedTemplate ? step.id <= 2 : step.id === 1;

            return (
              <View key={step.id} style={styles.stepItem}>
                <View style={[styles.stepCircle, isActive ? styles.stepCircleActive : null]}>
                  <Text style={[styles.stepNumber, isActive ? styles.stepNumberActive : null]}>{step.id}</Text>
                </View>
                {index < page.steps.length - 1 ? <View style={styles.stepLine} /> : null}
                <Text style={[styles.stepLabel, isActive ? styles.stepLabelActive : null]}>{step.label}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.divider} />

        {!isDetailView ? (
          <>
            <Text style={styles.sectionTitle}>Välj ett mål</Text>
            <Text style={styles.sectionSubtitle}>Välj ett mål eller skapa ditt eget</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
              {page.categories.map((category) => (
                <Pressable key={category.key} style={styles.categoryItem} onPress={() => setSelectedCategory(category.key)}>
                  <View
                    style={[
                      styles.categoryIconWrap,
                      category.key === page.selectedCategory ? styles.categoryIconWrapActive : null,
                    ]}>
                    <Ionicons
                      name={category.icon}
                      size={24}
                      color={category.key === page.selectedCategory ? '#A866FF' : '#9AA3B2'}
                    />
                  </View>
                  <Text style={[styles.categoryText, category.key === page.selectedCategory ? styles.categoryTextActive : null]}>
                    {category.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {page.templates.map((template) => (
              <Pressable key={template.id} style={styles.templateCard} onPress={() => void loadTemplateDetail(template.id)}>
                <View style={[styles.templateIconWrap, { backgroundColor: `${template.color}22` }]}>
                  <Ionicons name={template.icon} size={28} color={template.color} />
                </View>
                <View style={styles.templateContent}>
                  <Text style={styles.templateTitle}>{template.title}</Text>
                  <Text style={styles.templateDescription}>{template.summaryDescription}</Text>
                  <View style={[styles.templateTag, { backgroundColor: `${template.color}22` }]}>
                    <Text style={[styles.templateTagText, { color: template.color }]}>{template.category}</Text>
                  </View>
                  <View style={styles.templateMilestonesList}>
                    {template.summaryDetails.map((detail) => (
                      <View key={detail.id} style={styles.templateMilestoneRow}>
                        <Ionicons name="ellipse" size={6} color="#9AA3B2" />
                        <Text style={styles.templateMilestoneText}>
                          {detail.label}: {detail.value}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={22} color="#D8DEE7" />
              </Pressable>
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
          </>
        ) : isDetailLoading || !selectedTemplate ? (
          <View style={styles.feedbackState}>
            <ActivityIndicator size="large" color="#A866FF" />
            <Text style={styles.feedbackText}>Hämtar måldetaljer...</Text>
          </View>
        ) : (
          <>
            <View style={styles.detailHeader}>
              <View style={[styles.detailIconWrap, { backgroundColor: `${selectedTemplate.color}22` }]}>
                <Ionicons name={selectedTemplate.icon} size={32} color={selectedTemplate.color} />
              </View>
              <Text style={styles.detailTitle}>{selectedTemplate.title}</Text>
              <Text style={styles.detailSubtitle}>{selectedTemplate.summaryDescription}</Text>
            </View>

            <View style={styles.detailCard}>
              <Text style={styles.detailCardTitle}>Översiktsläge</Text>
              {selectedTemplate.summaryDetails.map((detail) => (
                <View key={detail.id} style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{detail.label}</Text>
                  <Text style={styles.detailValue}>{detail.value}</Text>
                </View>
              ))}
            </View>

            <View style={styles.detailCard}>
              <Text style={styles.detailCardTitle}>Detaljläge</Text>
              <Text style={styles.detailDescription}>{selectedTemplate.detailDescription}</Text>
              {selectedTemplate.detailDetails.map((detail) => (
                <View key={detail.id} style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{detail.label}</Text>
                  <Text style={styles.detailValue}>{detail.value}</Text>
                </View>
              ))}
            </View>

            <View style={styles.detailCard}>
              <Text style={styles.detailCardTitle}>Delmål</Text>
              {selectedTemplate.milestones.map((milestone, index) => (
                <View key={milestone.id} style={styles.milestoneDetailRow}>
                  <View style={styles.milestoneIndex}>
                    <Text style={styles.milestoneIndexText}>{index + 1}</Text>
                  </View>
                  <View style={styles.milestoneDetailTextWrap}>
                    <Text style={styles.milestoneDetailTitle}>{milestone.title}</Text>
                    {milestone.description ? (
                      <Text style={styles.milestoneDetailDescription}>{milestone.description}</Text>
                    ) : null}
                  </View>
                </View>
              ))}
            </View>

            <Pressable
              onPress={() => void handleCreateGoal()}
              style={[styles.addGoalButton, isCreatingGoal ? styles.addGoalButtonDisabled : null]}
              disabled={isCreatingGoal}>
              <Text style={styles.addGoalButtonText}>{isCreatingGoal ? 'Lägger till...' : 'Lägg till mål'}</Text>
            </Pressable>
          </>
        )}
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
    fontWeight: '700',
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
  templateMilestonesList: {
    gap: 6,
    marginTop: 12,
  },
  templateMilestoneRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  templateMilestoneText: {
    color: '#9AA3B2',
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
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
  detailHeader: {
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 28,
  },
  detailIconWrap: {
    alignItems: 'center',
    borderRadius: 18,
    height: 68,
    justifyContent: 'center',
    width: 68,
  },
  detailTitle: {
    color: '#F5F7FB',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 16,
    textAlign: 'center',
  },
  detailSubtitle: {
    color: '#CBD2DD',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    textAlign: 'center',
  },
  detailCard: {
    backgroundColor: '#151B24',
    borderColor: '#1F2632',
    borderRadius: 20,
    borderWidth: 1,
    marginHorizontal: 20,
    marginTop: 18,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  detailCardTitle: {
    color: '#F5F7FB',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  detailDescription: {
    color: '#CBD2DD',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 10,
  },
  detailRow: {
    borderTopColor: '#252B38',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  detailLabel: {
    color: '#9AA3B2',
    flex: 1,
    fontSize: 12,
  },
  detailValue: {
    color: '#F5F7FB',
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
  },
  milestoneDetailRow: {
    borderTopColor: '#252B38',
    borderTopWidth: 1,
    flexDirection: 'row',
    paddingVertical: 12,
  },
  milestoneIndex: {
    alignItems: 'center',
    backgroundColor: '#2A1E45',
    borderRadius: 999,
    height: 24,
    justifyContent: 'center',
    marginRight: 12,
    width: 24,
  },
  milestoneIndexText: {
    color: '#C9A9FF',
    fontSize: 11,
    fontWeight: '700',
  },
  milestoneDetailTextWrap: {
    flex: 1,
  },
  milestoneDetailTitle: {
    color: '#F5F7FB',
    fontSize: 14,
    fontWeight: '600',
  },
  milestoneDetailDescription: {
    color: '#9AA3B2',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  addGoalButton: {
    alignItems: 'center',
    backgroundColor: '#8B4EF4',
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 18,
    paddingVertical: 16,
  },
  addGoalButtonDisabled: {
    opacity: 0.6,
  },
  addGoalButtonText: {
    color: '#F7F3FF',
    fontSize: 15,
    fontWeight: '700',
  },
});
