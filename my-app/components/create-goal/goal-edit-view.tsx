import Ionicons from '@expo/vector-icons/Ionicons';
import type { Dispatch, SetStateAction } from 'react';
import { useEffect } from 'react';
import { Image, ImageBackground, Pressable, Text, TextInput, View, useWindowDimensions } from 'react-native';

import { editGoalStyles as styles } from './edit-goal-styles';
import type { EditableTemplateDraft, GoalTemplateDetailResponse } from './types';

const backgroundImage = require('@/assets/images/background.png');

const milestoneAccentColors = ['#8152F4', '#E0AE2B', '#23C16B', '#2F9CFF', '#A866FF'] as const;
const milestoneIcons: (keyof typeof Ionicons.glyphMap)[] = [
  'calendar-outline',
  'calendar-clear-outline',
  'calendar-number-outline',
  'calendar-outline',
  'medal-outline',
];

type Props = {
  error: string | null;
  draft: EditableTemplateDraft;
  selectedTemplate: GoalTemplateDetailResponse | null;
  computedTotalXpReward: number;
  parseSubtitleTokens: (subtitle: string | string[]) => string[];
  mapSubtitleLabel: (subtitle: string) => string;
  getDynamicDetailValue: (label: string, value: string) => string;
  setDraft: Dispatch<SetStateAction<EditableTemplateDraft | null>>;
  expandedMilestoneId: string | null;
  setExpandedMilestoneId: Dispatch<SetStateAction<string | null>>;
  addMilestone: () => void;
  removeMilestone: (milestoneId: string) => void;
  setShowTemplateQuests: Dispatch<SetStateAction<boolean>>;
  showTemplateQuests: boolean;
};

export function GoalEditView({
  error,
  draft,
  selectedTemplate,
  computedTotalXpReward,
  parseSubtitleTokens,
  mapSubtitleLabel,
  getDynamicDetailValue,
  setDraft,
  expandedMilestoneId,
  setExpandedMilestoneId,
  addMilestone,
  removeMilestone,
  setShowTemplateQuests,
  showTemplateQuests,
}: Props) {
  const { width } = useWindowDimensions();
  const isNarrow = width < 820;
  const isMedium = width >= 820 && width < 1180;
  const isCompact = width < 720;
  const titleFontSize = width < 720 ? 22 : width < 1180 ? 24 : 28;
  const titleLineHeight = titleFontSize + 6;
  const leftPaneWidth = isNarrow ? '100%' : isMedium ? '62%' : '58%';
  const resolvedBackground = Image.resolveAssetSource(backgroundImage);
  const overviewItems = (
    selectedTemplate?.overviewItems ?? [
      { id: 'custom-category', label: 'Kategori', value: draft.subtitle, icon: 'pricetag-outline' as const },
      { id: 'custom-setup', label: 'Upplägg', value: 'utvecklingssteg', icon: 'stats-chart-outline' as const },
      { id: 'custom-focus', label: 'Fokus', value: draft.subtitle, icon: 'locate-outline' as const },
      { id: 'custom-xp', label: 'Belöning', value: `${computedTotalXpReward} XP`, icon: 'sparkles-outline' as const },
    ]
  ).slice(0, 4);

  useEffect(() => {
    console.log('[GoalEditView] background.png asset', resolvedBackground);
  }, [resolvedBackground]);

  return (
    <>
      {error ? (
        <View style={styles.inlineErrorCard}>
          <Ionicons name="alert-circle-outline" size={18} color="#F5C13C" />
          <Text style={styles.inlineErrorText}>{error}</Text>
        </View>
      ) : null}

      <View style={[styles.detailCard, styles.heroCard]}>
        <ImageBackground
          source={backgroundImage}
          style={styles.heroBackground}
          imageStyle={styles.heroBackgroundImage}
          resizeMode="cover">
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <View style={[styles.detailHeroRow, isNarrow ? styles.detailHeroRowStacked : null]}>
              <View style={[styles.detailHeroLeft, { width: leftPaneWidth }]}>
                <View style={[styles.detailHeroIconWrap, { backgroundColor: `${draft.color}22` }]}>
                  <Ionicons name={draft.icon} size={46} color="#F7F3FF" />
                </View>
                <View style={styles.detailHeroCopy}>
                  <TextInput
                    value={draft.title}
                    onChangeText={(text) => setDraft((current) => (current ? { ...current, title: text } : current))}
                    style={[styles.heroTitleInput, { fontSize: titleFontSize, lineHeight: titleLineHeight }]}
                    placeholder="Måltitel"
                    placeholderTextColor="#6F7887"
                  />
                  <View style={styles.detailMetaPills}>
                    <View style={styles.heroDifficultyPill}>
                      <Text style={[styles.heroDifficultyPillText, isCompact ? styles.heroDifficultyPillTextCompact : null]}>
                        {draft.difficulty}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.heroCategoryRow}>
                    {parseSubtitleTokens(draft.subtitle).map((subtitle) => (
                      <View key={`draft-${subtitle}`} style={styles.heroCategoryBadge}>
                        <View style={styles.heroCategoryDot} />
                        <Text style={[styles.heroCategoryText, isCompact ? styles.heroCategoryTextCompact : null]}>
                          {mapSubtitleLabel(subtitle)}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
              <View style={[styles.detailXpBadge, isNarrow ? styles.detailXpBadgeStacked : null]}>
                <Ionicons name="trophy-outline" size={28} color="#F5C13C" />
                <Text style={styles.detailXpBadgeValue}>{computedTotalXpReward} XP</Text>
                <Text style={styles.detailXpBadgeLabel}>total belöning</Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>

      <View style={styles.detailCard}>
        <Text style={styles.detailCardTitle}>Översikt</Text>
        <View style={[styles.overviewGrid, isNarrow ? styles.overviewGridWrapped : null]}>
          {overviewItems.map((detail, index, array) => (
            <View
              key={detail.id}
              style={[
                styles.overviewGridItem,
                isNarrow ? styles.overviewGridItemWrapped : null,
                isCompact ? styles.overviewGridItemCompact : null,
                !isNarrow && index < array.length - 1 ? styles.overviewGridDivider : null,
              ]}>
              {detail.icon ? (
                <View style={[styles.detailRowIconWrap, isCompact ? styles.detailRowIconWrapCompact : null]}>
                  <Ionicons name={detail.icon} size={isCompact ? 18 : 22} color="#C9A9FF" />
                </View>
              ) : null}
              <Text style={[styles.detailLabel, isCompact ? styles.detailLabelCompact : null]}>{detail.label}</Text>
              <Text style={[styles.overviewGridValue, isCompact ? styles.overviewGridValueCompact : null]}>
                {getDynamicDetailValue(detail.label, detail.value)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.detailCard}>
        <View style={styles.milestonesHeaderRow}>
          <Text style={styles.detailCardTitle}>Milestones</Text>
          <Pressable style={styles.addIconButton} onPress={addMilestone}>
            <Ionicons name="add" size={18} color="#F7F3FF" />
            <Text style={styles.addIconButtonText}>Lägg till</Text>
          </Pressable>
        </View>
        <View style={styles.timelineList}>
          {draft.milestones.map((milestone, index) => {
            const accentColor = milestoneAccentColors[index % milestoneAccentColors.length];
            const milestoneIcon = milestoneIcons[index % milestoneIcons.length];

            return (
              <View key={milestone.id} style={styles.milestoneEditorCard}>
                {index < draft.milestones.length - 1 ? <View style={styles.timelineLine} /> : null}
                <View style={styles.milestoneEditorRow}>
                  <Pressable
                    style={styles.milestoneEditorHeader}
                    onPress={() => setExpandedMilestoneId((current) => (current === milestone.id ? null : milestone.id))}>
                    <View style={[styles.milestoneIndexWrap, isCompact ? styles.milestoneIndexWrapCompact : null]}>
                      <Text style={[styles.milestoneIndexText, isCompact ? styles.milestoneIndexTextCompact : null]}>
                        {index + 1}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.milestoneMetaIconWrap,
                        isCompact ? styles.milestoneMetaIconWrapCompact : null,
                        { backgroundColor: `${accentColor}22` },
                      ]}>
                      <Ionicons name={milestoneIcon} size={isCompact ? 22 : 26} color={accentColor} />
                    </View>
                    <View style={styles.milestoneTextWrap}>
                      <Text style={[styles.milestoneEditorHeaderText, isCompact ? styles.milestoneEditorHeaderTextCompact : null]}>
                        {milestone.title}
                      </Text>
                      {milestone.description ? (
                        <Text style={[styles.milestoneDescription, isCompact ? styles.milestoneDescriptionCompact : null]}>
                          {milestone.description}
                        </Text>
                      ) : null}
                    </View>
                    <View style={styles.milestoneXpBadge}>
                      <Text style={[styles.milestoneXpValue, isCompact ? styles.milestoneXpValueCompact : null]}>
                        +{milestone.xpReward} XP
                      </Text>
                    </View>
                  </Pressable>
                  <Pressable style={styles.trashButton} onPress={() => removeMilestone(milestone.id)} hitSlop={8}>
                    <Ionicons name="trash-outline" size={22} color="#E3E8F0" />
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>
        {selectedTemplate?.quests?.length ? (
          <>
            <Pressable style={styles.questCollapseButton} onPress={() => setShowTemplateQuests((current) => !current)}>
              <View style={styles.questCollapseLabelRow}>
                <Ionicons name="sparkles-outline" size={16} color="#C9A9FF" />
                <Text style={styles.questCollapseButtonText}>
                  {showTemplateQuests
                    ? 'Dölj quests som skapas med målet'
                    : `Visa quests som skapas med målet (${selectedTemplate.quests.length})`}
                </Text>
              </View>
              <Ionicons name={showTemplateQuests ? 'chevron-up' : 'chevron-down'} size={18} color="#D8DEE7" />
            </Pressable>
            {showTemplateQuests ? (
              <View style={styles.questPreviewBox}>
                {selectedTemplate.quests.map((quest, index) => (
                  <View
                    key={quest.id}
                    style={[styles.questPreviewRow, index === 0 ? { borderTopWidth: 0 } : null]}>
                    <View style={styles.questPreviewInfo}>
                      <Text style={styles.questPreviewTitle}>{quest.title}</Text>
                      {quest.description ? <Text style={styles.questPreviewText}>{quest.description}</Text> : null}
                    </View>
                    <View style={styles.questPreviewMeta}>
                      <Text style={styles.questPreviewFrequency}>{quest.frequency}</Text>
                      <Text style={styles.questPreviewXp}>+{quest.xpReward} XP</Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : null}
          </>
        ) : null}
      </View>
    </>
  );
}
