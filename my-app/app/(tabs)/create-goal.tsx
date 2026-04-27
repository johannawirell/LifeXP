import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
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
    subtasks: { id: string; title: string }[];
    tips: { id: string; text: string }[];
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
  summaryDetails: { id: string; label: string; value: string }[];
  detailDetails: { id: string; label: string; value: string }[];
  milestones: {
    id: string;
    title: string;
    description?: string;
    subtasks: { id: string; title: string }[];
    tips: { id: string; text: string }[];
  }[];
};

type EditableTemplateDraft = {
  id: string;
  title: string;
  milestones: {
    id: string;
    title: string;
    description?: string;
    subtasks: { id: string; title: string }[];
    tips: { id: string; text: string }[];
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
  const [draft, setDraft] = useState<EditableTemplateDraft | null>(null);
  const [expandedMilestoneId, setExpandedMilestoneId] = useState<string | null>(null);
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
      setDraft({
        id: data.id,
        title: data.title,
        milestones: data.milestones.map((milestone) => ({
          id: milestone.id,
          title: milestone.title,
          description: milestone.description,
          subtasks: milestone.subtasks.map((subtask) => ({ ...subtask })),
          tips: milestone.tips.map((tip) => ({ ...tip })),
        })),
      });
      setExpandedMilestoneId(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unknown error');
    } finally {
      setIsDetailLoading(false);
    }
  };

  const updateMilestoneTitle = (milestoneId: string, title: string) => {
    setDraft((current) =>
      current
        ? {
            ...current,
            milestones: current.milestones.map((milestone) =>
              milestone.id === milestoneId ? { ...milestone, title } : milestone
            ),
          }
        : current
    );
  };

  const updateSubtaskTitle = (milestoneId: string, subtaskId: string, title: string) => {
    setDraft((current) =>
      current
        ? {
            ...current,
            milestones: current.milestones.map((milestone) =>
              milestone.id === milestoneId
                ? {
                    ...milestone,
                    subtasks: milestone.subtasks.map((subtask) =>
                      subtask.id === subtaskId ? { ...subtask, title } : subtask
                    ),
                  }
                : milestone
            ),
          }
        : current
    );
  };

  const updateTipText = (milestoneId: string, tipId: string, text: string) => {
    setDraft((current) =>
      current
        ? {
            ...current,
            milestones: current.milestones.map((milestone) =>
              milestone.id === milestoneId
                ? {
                    ...milestone,
                    tips: milestone.tips.map((tip) => (tip.id === tipId ? { ...tip, text } : tip)),
                  }
                : milestone
            ),
          }
        : current
    );
  };

  const handleCreateGoal = async () => {
    if (!userId || !selectedTemplate || !draft) {
      return;
    }

    try {
      setIsCreatingGoal(true);
      await postJson<CreateGoalResponse>(`/goals/${userId}/from-template/${selectedTemplate.id}`, {
        title: draft.title,
        milestones: draft.milestones.map((milestone) => ({
          title: milestone.title,
          description: milestone.description,
          subtasks: milestone.subtasks.map((subtask) => subtask.title),
          tips: milestone.tips.map((tip) => tip.text),
        })),
      });
      Alert.alert('Mål tillagt', 'Målet har lagts till i din lista.');
      setSelectedTemplate(null);
      setDraft(null);
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
          <Pressable
            onPress={() => {
              if (selectedTemplate) {
                setSelectedTemplate(null);
                setDraft(null);
                setExpandedMilestoneId(null);
                return;
              }

              router.back();
            }}>
            <Ionicons name="arrow-back" size={24} color="#F5F7FB" />
          </Pressable>
          <Text style={styles.screenTitle}>{selectedTemplate ? 'Redigera mål' : 'Lägg till mål'}</Text>
          <View style={styles.topBarSpacer} />
        </View>

        {mode === 'empty' ? (
          <View style={styles.modeBadge}>
            <Text style={styles.modeBadgeText}>Ny användare</Text>
          </View>
        ) : null}

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
                  <Text style={styles.templateMetaText}>{template.milestones.length} milestones</Text>
                </View>
                <Ionicons name="chevron-forward" size={22} color="#D8DEE7" />
              </Pressable>
            ))}
          </>
        ) : isDetailLoading || !selectedTemplate || !draft ? (
          <View style={styles.feedbackState}>
            <ActivityIndicator size="large" color="#A866FF" />
            <Text style={styles.feedbackText}>Hämtar måldetaljer...</Text>
          </View>
        ) : (
          <>
            <View style={styles.detailCard}>
              <Text style={styles.detailCardTitle}>Måltitel</Text>
              <TextInput
                value={draft.title}
                onChangeText={(text) => setDraft((current) => (current ? { ...current, title: text } : current))}
                style={styles.input}
                placeholder="Måltitel"
                placeholderTextColor="#6F7887"
              />
            </View>

            <View style={styles.detailCard}>
              <Text style={styles.detailCardTitle}>Översikt</Text>
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
              <Text style={styles.detailCardTitle}>Milestones</Text>
              {draft.milestones.map((milestone) => (
                <View key={milestone.id} style={styles.milestoneEditorCard}>
                  <Pressable
                    style={styles.milestoneEditorHeader}
                    onPress={() =>
                      setExpandedMilestoneId((current) => (current === milestone.id ? null : milestone.id))
                    }>
                    <Text style={styles.milestoneEditorHeaderText}>{milestone.title}</Text>
                    <Ionicons
                      name={expandedMilestoneId === milestone.id ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color="#D8DEE7"
                    />
                  </Pressable>

                  {expandedMilestoneId === milestone.id ? (
                    <View>
                      <TextInput
                        value={milestone.title}
                        onChangeText={(text) => updateMilestoneTitle(milestone.id, text)}
                        style={styles.input}
                        placeholder="Milestone"
                        placeholderTextColor="#6F7887"
                      />

                      <Text style={styles.editorSectionTitle}>Delmål</Text>
                      {milestone.subtasks.map((subtask) => (
                        <TextInput
                          key={subtask.id}
                          value={subtask.title}
                          onChangeText={(text) => updateSubtaskTitle(milestone.id, subtask.id, text)}
                          style={styles.input}
                          placeholder="Delmål"
                          placeholderTextColor="#6F7887"
                        />
                      ))}

                      <Text style={styles.editorSectionTitle}>Tips</Text>
                      {milestone.tips.map((tip) => (
                        <TextInput
                          key={tip.id}
                          value={tip.text}
                          onChangeText={(text) => updateTipText(milestone.id, tip.id, text)}
                          style={styles.input}
                          placeholder="Tips"
                          placeholderTextColor="#6F7887"
                        />
                      ))}
                    </View>
                  ) : null}
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
  templateMetaText: {
    color: '#9AA3B2',
    fontSize: 12,
    marginTop: 10,
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
    marginBottom: 10,
  },
  detailDescription: {
    color: '#CBD2DD',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
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
  input: {
    backgroundColor: '#0F141D',
    borderColor: '#2A3040',
    borderRadius: 12,
    borderWidth: 1,
    color: '#F5F7FB',
    fontSize: 14,
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  milestoneEditorCard: {
    borderTopColor: '#252B38',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  milestoneEditorHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  milestoneEditorHeaderText: {
    color: '#F5F7FB',
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  editorSectionTitle: {
    color: '#C9A9FF',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 14,
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
