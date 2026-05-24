import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GoalEditView } from '@/components/create-goal/goal-edit-view';
import { MilestoneEditorModal } from '@/components/create-goal/milestone-editor-modal';
import { AppIcon } from '@/components/ui/app-icon';
import type {
  CreateGoalResponse,
  DifficultyFilter,
  EditableTemplateDraft,
  GoalTemplateDetailResponse,
  GoalTemplatePageResponse,
} from '@/components/create-goal/types';
import { useSession } from '@/context/session-context';
import { useLiveUpdates } from '@/hooks/use-live-updates';
import { fetchJson, postJson } from '@/lib/api';

export default function CreateGoalScreen() {
  const { width } = useWindowDimensions();
  const params = useLocalSearchParams<{ category?: string | string[] }>();
  const { mode, userId } = useSession();
  const [page, setPage] = useState<GoalTemplatePageResponse | null>(null);
  const routeCategory = Array.isArray(params.category) ? params.category[0] : params.category;
  const [selectedCategory, setSelectedCategory] = useState(routeCategory ?? 'popular');
  const [selectedTemplate, setSelectedTemplate] = useState<GoalTemplateDetailResponse | null>(null);
  const [draft, setDraft] = useState<EditableTemplateDraft | null>(null);
  const [expandedMilestoneId, setExpandedMilestoneId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isCreatingGoal, setIsCreatingGoal] = useState(false);
  const [showTemplateQuests, setShowTemplateQuests] = useState(false);
  const [isFilterPanelVisible, setIsFilterPanelVisible] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const isCustomGoal = !selectedTemplate && Boolean(draft);
  const categoryCount = page?.categories.length ?? 7;
  const categoryTrackWidth = Math.max(width - 40, 280);
  const categoryItemWidth = categoryTrackWidth / categoryCount;
  const categoryIconSize = width < 420 ? 18 : width < 640 ? 20 : 24;
  const categoryWrapSize = width < 420 ? 40 : width < 640 ? 44 : 48;
  const categoryLabelSize = width < 420 ? 9 : width < 640 ? 10 : 11;

  const selectedMilestone =
    draft?.milestones.find((milestone) => milestone.id === expandedMilestoneId) ?? null;
  const computedTotalXpReward = draft
    ? draft.milestones.reduce((sum, milestone) => sum + milestone.xpReward, 0)
    : 0;

  const parseSubtitleTokens = (subtitle: string | string[]) =>
    (Array.isArray(subtitle) ? subtitle : subtitle.split(','))
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);

  const mapSubtitleLabel = (subtitle: string) => {
    switch (subtitle) {
      case 'running':
        return 'Löpning';
      case 'strength':
        return 'Styrka';
      case 'health':
        return 'Hälsa';
      case 'training':
        return 'Träning';
      case 'study':
      case 'learning':
        return 'Plugg';
      case 'job':
        return 'Jobb';
      case 'finance':
        return 'Ekonomi';
      case 'social':
      case 'relationship':
        return 'Relationer';
      case 'football':
        return 'Fotboll';
      case 'riding':
        return 'Ridsport';
      default:
        return subtitle.charAt(0).toUpperCase() + subtitle.slice(1);
    }
  };

  const renderSubtitleIcon = (subtitle: string, color: string) => {
    switch (subtitle) {
      case 'running':
        return <Ionicons name="walk-outline" size={14} color={color} />;
      case 'strength':
        return <Ionicons name="barbell-outline" size={14} color={color} />;
      case 'health':
        return <Ionicons name="heart-outline" size={14} color={color} />;
      case 'football':
        return <Ionicons name="football-outline" size={14} color={color} />;
      case 'riding':
        return <MaterialCommunityIcons name="horse-variant-fast" size={14} color={color} />;
      default:
        return <Ionicons name="ellipse-outline" size={14} color={color} />;
    }
  };

  const buildCustomGoalDraft = (): EditableTemplateDraft => ({
    title: '',
    subtitle: page?.categories.find((category) => category.key === selectedCategory)?.label ?? 'Eget mål',
    category: selectedCategory,
    color: '#A866FF',
    icon: 'flag-outline',
    difficulty: 'MEDIUM',
    totalXpReward: 50,
    milestones: [
      {
        id: `custom-milestone-${Date.now()}`,
        title: 'Första milestone',
        description: '',
        xpReward: 50,
        subtasks: [{ id: `custom-subtask-${Date.now()}`, title: 'Första delmål' }],
        tips: [{ id: `custom-tip-${Date.now()}`, text: 'Första tips' }],
      },
    ],
  });

  const getDynamicDetailValue = (label: string, value: string) => {
    if (!draft) {
      return value;
    }

    if (label === 'Upplägg') {
      const milestoneCount = draft.milestones.length;
      const match = value.match(/^\d+\s+(.+)$/);

      if (match) {
        return `${milestoneCount} ${match[1]}`;
      }

      return `${milestoneCount} milestones`;
    }

    if (label === 'XP') {
      return `${computedTotalXpReward} XP`;
    }

    return value;
  };

  const closeFilters = () => {
    setIsFilterPanelVisible(false);
    setDifficultyFilter('ALL');
    setSearchQuery('');
  };

  const filteredTemplates = page?.templates.filter((template) => {
    const matchesDifficulty =
      difficultyFilter === 'ALL' || template.difficulty === difficultyFilter;

    if (!matchesDifficulty) {
      return false;
    }

    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return true;
    }

    const searchableParts = [
      template.title,
      template.summaryDescription,
      template.category,
      template.difficulty,
      ...template.subtitle,
      ...template.overviewItems.flatMap((detail) => [detail.label, detail.value]),
    ];

    return searchableParts.some((part) => part.toLowerCase().includes(query));
  }) ?? [];

  const loadTemplates = useCallback(async (category: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const query = new URLSearchParams({
        category,
        ...(userId ? { userId } : {}),
      });
      const data = await fetchJson<GoalTemplatePageResponse>(`/goals/templates/list?${query.toString()}`);
      setPage(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const loadTemplateDetail = async (templateId: string) => {
    try {
      setIsDetailLoading(true);
      setError(null);
      const data = await fetchJson<GoalTemplateDetailResponse>(`/goals/templates/${templateId}`);
      setSelectedTemplate(data);
      setShowTemplateQuests(false);
      setDraft({
        id: data.id,
        title: data.title,
        subtitle: data.subtitle.join(', '),
        category: data.category,
        color: data.color,
        icon: data.icon,
        difficulty: data.difficulty,
        totalXpReward: data.totalXpReward,
        milestones: data.milestones.map((milestone) => ({
          id: milestone.id,
          title: milestone.title,
          description: milestone.description,
          xpReward: milestone.xpReward,
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
                xpReward: 50,
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

  const updateMilestoneXp = (milestoneId: string, xpReward: number) => {
    setDraft((current) =>
      current
        ? {
            ...current,
            milestones: current.milestones.map((milestone) =>
              milestone.id === milestoneId ? { ...milestone, xpReward } : milestone
            ),
          }
        : current
    );
  };

  const handleCreateGoal = async () => {
    if (!userId || !draft) {
      return;
    }

    try {
      setIsCreatingGoal(true);
      setError(null);
      const endpoint =
        isCustomGoal || !selectedTemplate
          ? `/goals/${userId}/custom`
          : `/goals/${userId}/from-template/${selectedTemplate.id}`;
      const payload = {
        title: draft.title,
        subtitle: draft.subtitle,
        category: draft.category,
        color: draft.color,
        icon: draft.icon,
        difficulty: draft.difficulty,
        totalXpReward: computedTotalXpReward,
        milestones: draft.milestones.map((milestone) => ({
          title: milestone.title,
          description: milestone.description,
          xpReward: milestone.xpReward,
          subtasks: milestone.subtasks.map((subtask) => subtask.title),
          tips: milestone.tips.map((tip) => tip.text),
        })),
      };
      await postJson<CreateGoalResponse>(endpoint, payload);
      Alert.alert('Mål tillagt', 'Målet har lagts till i din lista.');
      setSelectedTemplate(null);
      setDraft(null);
      router.replace({
        pathname: '/(tabs)/goals',
        params: {
          tab: 'active',
          filter: 'latest',
          notice: 'goal-added',
        },
      });
    } catch (createError) {
      const message =
        createError instanceof Error ? createError.message : 'Unknown error';
      setError(message);
      Alert.alert(
        'Målet kunde inte läggas till',
        message
      );
    } finally {
      setIsCreatingGoal(false);
    }
  };

  useEffect(() => {
    void loadTemplates(selectedCategory);
  }, [loadTemplates, selectedCategory]);

  useFocusEffect(
    useCallback(() => {
      void loadTemplates(selectedCategory);
    }, [loadTemplates, selectedCategory])
  );

  useLiveUpdates(
    userId,
    useCallback(
      async (event) => {
        if ((!event.resources.includes('goals') && !event.resources.includes('goal-templates')) || !userId) {
          return;
        }

        try {
          const query = new URLSearchParams({
            category: selectedCategory,
            ...(userId ? { userId } : {}),
          });
          const data = await fetchJson<GoalTemplatePageResponse>(`/goals/templates/list?${query.toString()}`);
          setPage(data);
        } catch {
          // Keep current state if a live refresh fails.
        }
      },
      [selectedCategory, userId]
    ),
    { enabled: Boolean(userId) }
  );

  useEffect(() => {
    if (routeCategory && routeCategory !== selectedCategory) {
      setSelectedCategory(routeCategory);
    }
  }, [routeCategory, selectedCategory]);

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

  const isDetailView = Boolean(selectedTemplate) || Boolean(draft) || isDetailLoading;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <Pressable
          style={styles.topBarButton}
          onPress={() => {
            if (selectedTemplate || draft) {
              setSelectedTemplate(null);
              setDraft(null);
              setExpandedMilestoneId(null);
              return;
            }

            router.back();
          }}>
          <Ionicons name="arrow-back" size={24} color="#F5F7FB" />
        </Pressable>
        <Text style={styles.screenTitle}>{selectedTemplate || draft ? 'Redigera mål' : 'Lägg till mål'}</Text>
        {isDetailView ? (
          <View style={styles.topBarSpacer} />
        ) : (
          <Pressable
            style={styles.topBarButton}
            onPress={() => {
              if (isFilterPanelVisible) {
                closeFilters();
                return;
              }

              setIsFilterPanelVisible(true);
            }}>
            <Ionicons
              name={isFilterPanelVisible ? 'close-outline' : 'search-outline'}
              size={22}
              color="#F5F7FB"
            />
          </Pressable>
        )}
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, isDetailView ? styles.contentWithStickyCta : null]}
        showsVerticalScrollIndicator={false}>

        {mode === 'empty' ? (
          <View style={styles.modeBadge}>
            <Text style={styles.modeBadgeText}>Ny användare</Text>
          </View>
        ) : null}

        {!isDetailView ? (
          <>
            <View style={styles.selectionModeRow}>
              <Pressable style={[styles.selectionModeButton, styles.selectionModeButtonActive]}>
                <Text style={[styles.selectionModeText, styles.selectionModeTextActive]}>Välj mål</Text>
              </Pressable>
              <Pressable
                style={styles.selectionModeButton}
                onPress={() => {
                  setSelectedTemplate(null);
                  setDraft(buildCustomGoalDraft());
                }}>
                <Text style={styles.selectionModeText}>Skapa eget mål</Text>
              </Pressable>
            </View>
            <Text style={styles.sectionTitle}>Välj ett mål</Text>
            <Text style={styles.sectionSubtitle}>Välj ett mål eller skapa ditt eget</Text>

            <View style={styles.categoryRow}>
              {page.categories.map((category) => (
                <Pressable
                  key={category.key}
                  style={[styles.categoryItem, { width: categoryItemWidth }]}
                  onPress={() => setSelectedCategory(category.key)}>
                  <View
                    style={[
                      styles.categoryIconWrap,
                      { height: categoryWrapSize, width: categoryWrapSize },
                      category.key === page.selectedCategory ? styles.categoryIconWrapActive : null,
                    ]}>
                    <Ionicons
                      name={category.icon}
                      size={categoryIconSize}
                      color={category.key === page.selectedCategory ? '#A866FF' : '#9AA3B2'}
                    />
                  </View>
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.75}
                    style={[
                      styles.categoryText,
                      { fontSize: categoryLabelSize },
                      category.key === page.selectedCategory ? styles.categoryTextActive : null,
                    ]}>
                    {category.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {isFilterPanelVisible ? (
              <View style={styles.discoveryPanel}>
                <View style={styles.searchRow}>
                  <Ionicons name="search-outline" size={18} color="#A8B0BC" />
                  <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    style={styles.searchInput}
                    placeholder="Sök mål, t.ex. löpning eller 5 km"
                    placeholderTextColor="#6F7887"
                  />
                  <Pressable onPress={closeFilters} style={styles.searchCloseButton}>
                    <Ionicons name="close-outline" size={18} color="#C8D0DB" />
                  </Pressable>
                </View>
                <View style={styles.difficultyFilterRow}>
                  {(['ALL', 'EASY', 'MEDIUM', 'HARD', 'EPIC', 'LEGENDARY'] as DifficultyFilter[]).map((filter) => (
                    <Pressable
                      key={filter}
                      style={[
                        styles.difficultyFilterChip,
                        difficultyFilter === filter ? styles.difficultyFilterChipActive : null,
                      ]}
                      onPress={() => setDifficultyFilter(filter)}>
                      <Text
                        style={[
                          styles.difficultyFilterChipText,
                          difficultyFilter === filter ? styles.difficultyFilterChipTextActive : null,
                        ]}>
                        {filter === 'ALL' ? 'Alla svårigheter' : filter}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ) : null}

            {filteredTemplates.map((template) => (
              <Pressable key={template.id} style={styles.templateCard} onPress={() => void loadTemplateDetail(template.id)}>
                <View style={[styles.templateIconWrap, { backgroundColor: `${template.color}22` }]}>
                  <AppIcon name={template.icon} size={28} color={template.color} />
                </View>
                <View style={styles.templateContent}>
                  <View style={styles.templateHeaderRow}>
                    <Text style={styles.templateTitle}>{template.title}</Text>
                    <View style={styles.xpHighlightPill}>
                      <Text style={styles.xpHighlightPillText}>{template.totalXpReward} XP</Text>
                    </View>
                  </View>
                  <Text style={styles.templateDescription}>{template.summaryDescription}</Text>
                  <View style={styles.templateMetaRow}>
                    <View style={[styles.templateTag, { backgroundColor: `${template.color}22` }]}>
                      <Text style={[styles.templateTagText, { color: template.color }]}>{template.category}</Text>
                    </View>
                    <View style={styles.difficultyPill}>
                      <Text style={styles.difficultyPillText}>{template.difficulty}</Text>
                    </View>
                  </View>
                  <View style={styles.subtitleBadgeRow}>
                    {template.subtitle.map((subtitle) => (
                      <View key={`${template.id}-${subtitle}`} style={styles.subtitleBadge}>
                        {renderSubtitleIcon(subtitle, '#C9A9FF')}
                        <Text style={styles.subtitleBadgeText}>{mapSubtitleLabel(subtitle)}</Text>
                      </View>
                    ))}
                  </View>
                  <Text style={styles.templateMetaText}>{template.milestones.length} milestones</Text>
                </View>
                <Ionicons name="chevron-forward" size={22} color="#D8DEE7" />
              </Pressable>
            ))}
            {filteredTemplates.length === 0 ? (
              <View style={styles.emptyTemplateCard}>
                <Ionicons name="checkmark-done-outline" size={28} color="#A866FF" />
                <Text style={styles.emptyTemplateTitle}>Inga mål matchade filtreringen</Text>
                <Text style={styles.emptyTemplateText}>
                  Testa en annan svårighetsgrad eller ett annat sökord. Du kan också skapa ett eget mål om du vill bygga vidare.
                </Text>
              </View>
            ) : null}
          </>
        ) : isDetailLoading || !draft ? (
          <View style={styles.feedbackState}>
            <ActivityIndicator size="large" color="#A866FF" />
            <Text style={styles.feedbackText}>Hämtar måldetaljer...</Text>
          </View>
        ) : (
          <GoalEditView
            error={error}
            draft={draft}
            selectedTemplate={selectedTemplate}
            computedTotalXpReward={computedTotalXpReward}
            parseSubtitleTokens={parseSubtitleTokens}
            mapSubtitleLabel={mapSubtitleLabel}
            getDynamicDetailValue={getDynamicDetailValue}
            setDraft={setDraft}
            expandedMilestoneId={expandedMilestoneId}
            setExpandedMilestoneId={setExpandedMilestoneId}
            addMilestone={addMilestone}
            removeMilestone={removeMilestone}
            setShowTemplateQuests={setShowTemplateQuests}
            showTemplateQuests={showTemplateQuests}
          />
        )}
      </ScrollView>
      {isDetailView && draft && !isDetailLoading ? (
        <View style={styles.stickyGoalFooter}>
          <Pressable
            onPress={() => void handleCreateGoal()}
            style={[styles.stickyGoalButton, isCreatingGoal ? styles.stickyGoalButtonDisabled : null]}
            disabled={isCreatingGoal}>
            <Ionicons name="add" size={24} color="#F7F3FF" />
            <Text style={styles.stickyGoalButtonText}>{isCreatingGoal ? 'Lägger till...' : 'Lägg till mål'}</Text>
          </Pressable>
        </View>
      ) : null}
      <MilestoneEditorModal
        milestone={selectedMilestone}
        onClose={() => setExpandedMilestoneId(null)}
        onUpdateTitle={updateMilestoneTitle}
        onUpdateXp={updateMilestoneXp}
        onAddSubtask={addSubtask}
        onRemoveSubtask={removeSubtask}
        onUpdateSubtaskTitle={updateSubtaskTitle}
        onAddTip={addTip}
        onRemoveTip={removeTip}
        onUpdateTipText={updateTipText}
      />
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
    paddingBottom: 156,
  },
  contentWithStickyCta: {
    paddingBottom: 220,
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
    backgroundColor: '#090E16',
    borderBottomColor: '#171D28',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 14,
    zIndex: 5,
  },
  topBarButton: {
    alignItems: 'center',
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  screenTitle: {
    color: '#F5F7FB',
    fontSize: 24,
    fontWeight: '700',
  },
  topBarSpacer: {
    width: 24,
  },
  stickyGoalFooter: {
    backgroundColor: 'rgba(9, 14, 22, 0.96)',
    borderTopColor: '#171D28',
    borderTopWidth: 1,
    bottom: 0,
    left: 0,
    paddingBottom: 18,
    paddingHorizontal: 20,
    paddingTop: 14,
    position: 'absolute',
    right: 0,
  },
  stickyGoalButton: {
    alignItems: 'center',
    backgroundColor: '#9A5CF8',
    borderRadius: 18,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    paddingVertical: 18,
  },
  stickyGoalButtonDisabled: {
    opacity: 0.6,
  },
  stickyGoalButtonText: {
    color: '#F7F3FF',
    fontSize: 17,
    fontWeight: '800',
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
  selectionModeRow: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 20,
    marginTop: 18,
  },
  selectionModeButton: {
    alignItems: 'center',
    backgroundColor: '#121824',
    borderColor: '#222B38',
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  selectionModeButtonActive: {
    backgroundColor: '#241539',
    borderColor: '#8B4EF4',
  },
  selectionModeText: {
    color: '#AEB7C5',
    fontSize: 14,
    fontWeight: '700',
  },
  selectionModeTextActive: {
    color: '#F7F3FF',
  },
  discoveryPanel: {
    backgroundColor: '#121824',
    borderColor: '#1F2632',
    borderRadius: 18,
    borderWidth: 1,
    marginHorizontal: 20,
    marginTop: 8,
    padding: 14,
  },
  searchRow: {
    alignItems: 'center',
    backgroundColor: '#0F1520',
    borderColor: '#252E3D',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    color: '#F5F7FB',
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
  searchCloseButton: {
    alignItems: 'center',
    backgroundColor: '#1A2230',
    borderRadius: 999,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  difficultyFilterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingTop: 14,
  },
  difficultyFilterChip: {
    backgroundColor: '#101722',
    borderColor: '#222B38',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  difficultyFilterChipActive: {
    backgroundColor: '#241539',
    borderColor: '#8B4EF4',
  },
  difficultyFilterChipText: {
    color: '#AEB7C5',
    fontSize: 12,
    fontWeight: '700',
  },
  difficultyFilterChipTextActive: {
    color: '#F7F3FF',
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
    flexDirection: 'row',
    marginTop: 18,
    paddingHorizontal: 20,
  },
  categoryItem: {
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  categoryIconWrap: {
    alignItems: 'center',
    backgroundColor: '#121824',
    borderRadius: 16,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  categoryIconWrapActive: {
    backgroundColor: '#1E1930',
  },
  categoryText: {
    color: '#9AA3B2',
    fontSize: 11,
    marginTop: 8,
    maxWidth: '100%',
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
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  emptyTemplateCard: {
    alignItems: 'center',
    backgroundColor: '#121824',
    borderColor: '#202736',
    borderRadius: 18,
    borderWidth: 1,
    marginHorizontal: 20,
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  emptyTemplateTitle: {
    color: '#F5F7FB',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
    textAlign: 'center',
  },
  emptyTemplateText: {
    color: '#9AA3B2',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
    textAlign: 'center',
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
    fontSize: 17,
    fontWeight: '700',
  },
  templateHeaderRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  templateDescription: {
    color: '#C5CCD8',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
  },
  templateMetaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  templateTag: {
    alignSelf: 'flex-start',
    borderRadius: 999,
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
    marginTop: 8,
  },
  xpHighlightPill: {
    backgroundColor: '#8B4EF4',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  xpHighlightPillText: {
    color: '#F7F3FF',
    fontSize: 11,
    fontWeight: '800',
  },
  difficultyPill: {
    backgroundColor: '#111824',
    borderColor: '#2B3342',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  difficultyPillText: {
    color: '#C4CCDA',
    fontSize: 11,
    fontWeight: '800',
  },
  subtitleBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  subtitleBadge: {
    alignItems: 'center',
    backgroundColor: '#101722',
    borderColor: '#222B38',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  subtitleBadgeText: {
    color: '#C9A9FF',
    fontSize: 11,
    fontWeight: '700',
  },
  detailCard: {
    backgroundColor: '#151B24',
    borderColor: '#1F2632',
    borderRadius: 20,
    borderWidth: 1,
    marginHorizontal: 20,
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  inlineErrorCard: {
    alignItems: 'center',
    backgroundColor: '#2A2110',
    borderColor: '#5A4820',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 20,
    marginTop: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  inlineErrorText: {
    color: '#F7E7B8',
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
  detailHeroRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailHeroIconWrap: {
    alignItems: 'center',
    borderRadius: 18,
    height: 70,
    justifyContent: 'center',
    width: 70,
  },
  detailHeroCopy: {
    flex: 1,
  },
  heroTitleInput: {
    color: '#F5F7FB',
    fontSize: 26,
    fontWeight: '800',
    marginTop: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  detailMetaPills: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  heroDifficultyPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#4A2D76',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  heroDifficultyPillText: {
    color: '#E9D8FF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  detailXpBadge: {
    alignItems: 'center',
    backgroundColor: '#121A26',
    borderColor: '#304156',
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
    minWidth: 150,
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  detailXpBadgeValue: {
    color: '#F7F3FF',
    fontSize: 18,
    fontWeight: '800',
  },
  detailXpBadgeLabel: {
    color: '#D7E0EA',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  heroSecondaryInput: {
    marginTop: 14,
  },
  heroCategoryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
  },
  heroCategoryBadge: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  heroCategoryDot: {
    backgroundColor: '#A866FF',
    borderRadius: 999,
    height: 10,
    width: 10,
  },
  heroCategoryText: {
    color: '#D8DEE7',
    fontSize: 14,
    fontWeight: '600',
  },
  milestonesHeaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  addIconButton: {
    alignItems: 'center',
    backgroundColor: '#241539',
    borderColor: '#8B4EF4',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  addIconButtonText: {
    color: '#D7C2FF',
    fontSize: 13,
    fontWeight: '700',
  },
  detailCardTitle: {
    color: '#F5F7FB',
    fontSize: 18,
    fontWeight: '700',
  },
  overviewGrid: {
    flexDirection: 'row',
    marginTop: 18,
  },
  overviewGridItem: {
    alignItems: 'flex-start',
    flex: 1,
    minHeight: 112,
    paddingHorizontal: 14,
  },
  overviewGridDivider: {
    borderRightColor: '#252B38',
    borderRightWidth: 1,
  },
  overviewGridValue: {
    color: '#F5F7FB',
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
    marginTop: 10,
  },
  detailRow: {
    alignItems: 'center',
    borderTopColor: '#252B38',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  detailRowLabelWrap: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 10,
  },
  detailRowIconWrap: {
    alignItems: 'center',
    backgroundColor: '#241539',
    borderRadius: 999,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  detailLabel: {
    color: '#9AA3B2',
    fontSize: 12,
  },
  detailValue: {
    color: '#F5F7FB',
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
  },
  questPreviewBox: {
    backgroundColor: '#121824',
    borderRadius: 14,
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  questCollapseButton: {
    alignItems: 'center',
    backgroundColor: '#111824',
    borderColor: '#222B38',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  questCollapseLabelRow: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    paddingRight: 10,
  },
  questCollapseButtonText: {
    color: '#F5F7FB',
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
  },
  questPreviewRow: {
    alignItems: 'flex-start',
    borderTopColor: '#252B38',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  questPreviewInfo: {
    flex: 1,
  },
  questPreviewTitle: {
    color: '#F5F7FB',
    fontSize: 13,
    fontWeight: '700',
  },
  questPreviewText: {
    color: '#C7D0DB',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  questPreviewMeta: {
    alignItems: 'flex-end',
    gap: 4,
  },
  questPreviewFrequency: {
    color: '#97A0AE',
    fontSize: 11,
    fontWeight: '700',
  },
  questPreviewXp: {
    color: '#C9A9FF',
    fontSize: 12,
    fontWeight: '800',
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
  secondaryInput: {
    marginTop: 10,
  },
  milestoneEditorCard: {
    borderTopColor: '#252B38',
    borderTopWidth: 1,
    paddingLeft: 2,
    paddingTop: 18,
    position: 'relative',
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
    gap: 12,
  },
  milestoneIndexWrap: {
    alignItems: 'center',
    backgroundColor: '#241539',
    borderColor: '#8B4EF4',
    borderRadius: 999,
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  milestoneIndexText: {
    color: '#F7F3FF',
    fontSize: 13,
    fontWeight: '800',
  },
  milestoneEditorHeaderText: {
    color: '#F5F7FB',
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  milestoneXpValue: {
    color: '#D7BCFF',
    fontSize: 13,
    fontWeight: '800',
  },
  timelineList: {
    marginTop: 6,
  },
  timelineLine: {
    backgroundColor: '#5B3D88',
    left: 18,
    position: 'absolute',
    top: 46,
    width: 1,
    bottom: -18,
  },
  trashButton: {
    alignItems: 'center',
    backgroundColor: 'transparent',
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
    minHeight: 54,
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
  stickyFooter: {
    backgroundColor: '#090E16',
    borderTopColor: '#171D28',
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
  },
});
