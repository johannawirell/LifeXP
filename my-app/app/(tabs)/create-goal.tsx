import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
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

  const selectedMilestone =
    draft?.milestones.find((milestone) => milestone.id === expandedMilestoneId) ?? null;

  const getDynamicDetailValue = (label: string, value: string) => {
    if (!draft) {
      return value;
    }

    if (label !== 'Upplägg') {
      return value;
    }

    const milestoneCount = draft.milestones.length;
    const match = value.match(/^\d+\s+(.+)$/);

    if (match) {
      return `${milestoneCount} ${match[1]}`;
    }

    return `${milestoneCount} milestones`;
  };

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

  const addMilestone = () => {
    setDraft((current) =>
      current
        ? {
            ...current,
            milestones: [
              ...current.milestones,
              {
                id: `new-milestone-${Date.now()}`,
                title: 'Ny milestone',
                description: '',
                subtasks: [{ id: `new-subtask-${Date.now()}`, title: 'Nytt delmål' }],
                tips: [{ id: `new-tip-${Date.now()}`, text: 'Nytt tips' }],
              },
            ],
          }
        : current
    );
  };

  const removeMilestone = (milestoneId: string) => {
    setDraft((current) =>
      current
        ? {
            ...current,
            milestones: current.milestones.filter((milestone) => milestone.id !== milestoneId),
          }
        : current
    );
    setExpandedMilestoneId((current) => (current === milestoneId ? null : current));
  };

  const addSubtask = (milestoneId: string) => {
    setDraft((current) =>
      current
        ? {
            ...current,
            milestones: current.milestones.map((milestone) =>
              milestone.id === milestoneId
                ? {
                    ...milestone,
                    subtasks: [
                      ...milestone.subtasks,
                      { id: `new-subtask-${Date.now()}`, title: 'Nytt delmål' },
                    ],
                  }
                : milestone
            ),
          }
        : current
    );
  };

  const removeSubtask = (milestoneId: string, subtaskId: string) => {
    setDraft((current) =>
      current
        ? {
            ...current,
            milestones: current.milestones.map((milestone) =>
              milestone.id === milestoneId
                ? {
                    ...milestone,
                    subtasks: milestone.subtasks.filter((subtask) => subtask.id !== subtaskId),
                  }
                : milestone
            ),
          }
        : current
    );
  };

  const addTip = (milestoneId: string) => {
    setDraft((current) =>
      current
        ? {
            ...current,
            milestones: current.milestones.map((milestone) =>
              milestone.id === milestoneId
                ? {
                    ...milestone,
                    tips: [...milestone.tips, { id: `new-tip-${Date.now()}`, text: 'Nytt tips' }],
                  }
                : milestone
            ),
          }
        : current
    );
  };

  const removeTip = (milestoneId: string, tipId: string) => {
    setDraft((current) =>
      current
        ? {
            ...current,
            milestones: current.milestones.map((milestone) =>
              milestone.id === milestoneId
                ? {
                    ...milestone,
                    tips: milestone.tips.filter((tip) => tip.id !== tipId),
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
                  <Text style={styles.detailValue}>{getDynamicDetailValue(detail.label, detail.value)}</Text>
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
              <View style={styles.milestonesHeaderRow}>
                <Text style={styles.detailCardTitle}>Milestones</Text>
                <Pressable style={styles.addIconButton} onPress={addMilestone}>
                  <Ionicons name="add" size={18} color="#F7F3FF" />
                </Pressable>
              </View>
              {draft.milestones.map((milestone) => (
                <View key={milestone.id} style={styles.milestoneEditorCard}>
                  <View style={styles.milestoneEditorRow}>
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
                    <Pressable style={styles.trashButton} onPress={() => removeMilestone(milestone.id)} hitSlop={8}>
                      <Ionicons name="trash-outline" size={18} color="#A866FF" />
                    </Pressable>
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
      <Modal visible={Boolean(selectedMilestone)} animationType="slide" transparent onRequestClose={() => setExpandedMilestoneId(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Redigera milestone</Text>
              <Pressable onPress={() => setExpandedMilestoneId(null)}>
                <Ionicons name="close" size={22} color="#F5F7FB" />
              </Pressable>
            </View>
            {selectedMilestone ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                <TextInput
                  value={selectedMilestone.title}
                  onChangeText={(text) => updateMilestoneTitle(selectedMilestone.id, text)}
                  style={styles.input}
                  placeholder="Milestone"
                  placeholderTextColor="#6F7887"
                />

                <View style={styles.modalSectionHeader}>
                  <Text style={styles.editorSectionTitle}>Delmål</Text>
                  <Pressable onPress={() => addSubtask(selectedMilestone.id)}>
                    <Text style={styles.inlineActionText}>Lägg till</Text>
                  </Pressable>
                </View>
                {selectedMilestone.subtasks.map((subtask) => (
                  <View key={subtask.id} style={styles.inlineEditorRow}>
                    <TextInput
                      value={subtask.title}
                      onChangeText={(text) => updateSubtaskTitle(selectedMilestone.id, subtask.id, text)}
                      style={[styles.input, styles.inlineInput]}
                      placeholder="Delmål"
                      placeholderTextColor="#6F7887"
                    />
                    <Pressable onPress={() => removeSubtask(selectedMilestone.id, subtask.id)} hitSlop={8}>
                      <Ionicons name="remove-circle-outline" size={20} color="#F08A45" />
                    </Pressable>
                  </View>
                ))}

                <View style={styles.modalSectionHeader}>
                  <Text style={styles.editorSectionTitle}>Tips</Text>
                  <Pressable onPress={() => addTip(selectedMilestone.id)}>
                    <Text style={styles.inlineActionText}>Lägg till</Text>
                  </Pressable>
                </View>
                {selectedMilestone.tips.map((tip) => (
                  <View key={tip.id} style={styles.inlineEditorRow}>
                    <TextInput
                      value={tip.text}
                      onChangeText={(text) => updateTipText(selectedMilestone.id, tip.id, text)}
                      style={[styles.input, styles.inlineInput]}
                      placeholder="Tips"
                      placeholderTextColor="#6F7887"
                    />
                    <Pressable onPress={() => removeTip(selectedMilestone.id, tip.id)} hitSlop={8}>
                      <Ionicons name="remove-circle-outline" size={20} color="#F08A45" />
                    </Pressable>
                  </View>
                ))}
              </ScrollView>
            ) : null}
          </View>
        </View>
      </Modal>
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
  milestonesHeaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  addIconButton: {
    alignItems: 'center',
    backgroundColor: '#8B4EF4',
    borderRadius: 999,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  detailCardTitle: {
    color: '#F5F7FB',
    fontSize: 18,
    fontWeight: '700',
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
  milestoneEditorRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  milestoneEditorHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  milestoneEditorHeaderText: {
    color: '#F5F7FB',
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  trashButton: {
    alignItems: 'center',
    backgroundColor: '#251A38',
    borderRadius: 999,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  editorSectionTitle: {
    color: '#C9A9FF',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 14,
  },
  modalBackdrop: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  modalCard: {
    backgroundColor: '#111722',
    borderRadius: 24,
    maxHeight: '72%',
    paddingBottom: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  modalTitle: {
    color: '#F5F7FB',
    fontSize: 18,
    fontWeight: '700',
  },
  modalSectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inlineEditorRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  inlineInput: {
    flex: 1,
  },
  inlineActionText: {
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
