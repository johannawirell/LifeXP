import Ionicons from '@expo/vector-icons/Ionicons';
import type { Dispatch, SetStateAction } from 'react';
import { ImageBackground, Pressable, Text, TextInput, View, useWindowDimensions } from 'react-native';

import { editGoalStyles as styles } from './edit-goal-styles';
import type { EditableTemplateDraft, GoalTemplateDetailResponse } from './types';

const backgroundImage = require('@/assets/images/background3.png');

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
  const isCompact = width < 760;
  const isTight = width < 620;
  const titleFontSize = width < 480 ? 14 : width < 560 ? 16 : width < 680 ? 18 : width < 820 ? 20 : width < 1180 ? 24 : 28;
  const titleLineHeight = titleFontSize + 6;
  const leftPaneWidth = isTight ? '67%' : isCompact ? '66%' : width < 1180 ? '62%' : '58%';
  const heroIconSize = width < 480 ? 28 : isTight ? 34 : isCompact ? 40 : 46;
  const heroXpIconSize = isTight ? 22 : isCompact ? 24 : 28;
  const heroXpValueSize = isTight ? 18 : isCompact ? 20 : 24;
  const heroXpBadgeWidth = width < 480 ? 110 : isTight ? 124 : isCompact ? 140 : 178;
  const heroXpBadgePaddingVertical = width < 480 ? 12 : isTight ? 14 : isCompact ? 18 : 22;
  const overviewIconSize = isTight ? 16 : isCompact ? 18 : 22;
  const overviewValueSize = isTight ? 13 : isCompact ? 14 : 17;
  const overviewLabelSize = isTight ? 11 : isCompact ? 12 : 13;
  const milestoneIconSize = isTight ? 20 : isCompact ? 22 : 26;
  const milestoneTitleSize = isTight ? 15 : isCompact ? 16 : 18;
  const milestoneDescriptionSize = isTight ? 11 : isCompact ? 12 : 13;
  const milestoneXpValueSize = isTight ? 12 : isCompact ? 13 : 15;
  const milestoneIndexSize = isTight ? 15 : isCompact ? 17 : 20;
  const overviewItems = (
    selectedTemplate?.overviewItems ?? [
      { id: 'custom-category', label: 'Kategori', value: draft.subtitle, icon: 'pricetag-outline' as const },
      { id: 'custom-setup', label: 'Upplägg', value: 'utvecklingssteg', icon: 'stats-chart-outline' as const },
      { id: 'custom-focus', label: 'Fokus', value: draft.subtitle, icon: 'locate-outline' as const },
      { id: 'custom-xp', label: 'Belöning', value: `${computedTotalXpReward} XP`, icon: 'sparkles-outline' as const },
    ]
  ).slice(0, 4);


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
            <View style={styles.detailHeroRow}>
              <View style={[styles.detailHeroLeft, { width: leftPaneWidth }]}>
                <View style={[styles.detailHeroIconWrap, { backgroundColor: `${draft.color}22` }]}>
                  <Ionicons name={draft.icon} size={heroIconSize} color="#F7F3FF" />
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
                        <Text
                          numberOfLines={1}
                          adjustsFontSizeToFit
                          minimumFontScale={0.75}
                          style={[styles.heroCategoryText, isCompact ? styles.heroCategoryTextCompact : null]}>
                          {mapSubtitleLabel(subtitle)}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
              <View style={[styles.detailXpBadge, { minWidth: heroXpBadgeWidth, paddingVertical: heroXpBadgePaddingVertical }]}>
                <Ionicons name="trophy-outline" size={heroXpIconSize} color="#F5C13C" />
                <Text style={[styles.detailXpBadgeValue, { fontSize: heroXpValueSize }]}>{computedTotalXpReward} XP</Text>
                <Text style={[styles.detailXpBadgeLabel, isCompact ? styles.detailXpBadgeLabelCompact : null]}>total belöning</Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>

      <View style={styles.detailCard}>
        <Text style={styles.detailCardTitle}>Översikt</Text>
        <View style={styles.overviewGrid}>
          {overviewItems.map((detail, index, array) => (
            <View
              key={detail.id}
              style={[
                styles.overviewGridItem,
                isCompact ? styles.overviewGridItemCompact : null,
                index < array.length - 1 ? styles.overviewGridDivider : null,
              ]}>
              {detail.icon ? (
                <View style={[styles.detailRowIconWrap, isCompact ? styles.detailRowIconWrapCompact : null]}>
                  <Ionicons name={detail.icon} size={overviewIconSize} color="#C9A9FF" />
                </View>
              ) : null}
              <Text style={[styles.detailLabel, isCompact ? styles.detailLabelCompact : null, { fontSize: overviewLabelSize }]}>
                {detail.label}
              </Text>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.68}
                style={[styles.overviewGridValue, isCompact ? styles.overviewGridValueCompact : null, { fontSize: overviewValueSize }]}>
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
                      <Text style={[styles.milestoneIndexText, isCompact ? styles.milestoneIndexTextCompact : null, { fontSize: milestoneIndexSize }]}>
                        {index + 1}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.milestoneMetaIconWrap,
                        isCompact ? styles.milestoneMetaIconWrapCompact : null,
                        { backgroundColor: `${accentColor}22` },
                      ]}>
                      <Ionicons name={milestoneIcon} size={milestoneIconSize} color={accentColor} />
                    </View>
                    <View style={styles.milestoneTextWrap}>
                      <Text
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        minimumFontScale={0.74}
                        style={[styles.milestoneEditorHeaderText, isCompact ? styles.milestoneEditorHeaderTextCompact : null, { fontSize: milestoneTitleSize }]}>
                        {milestone.title}
                      </Text>
                      {milestone.description ? (
                        <Text
                          numberOfLines={1}
                          adjustsFontSizeToFit
                          minimumFontScale={0.72}
                          style={[styles.milestoneDescription, isCompact ? styles.milestoneDescriptionCompact : null, { fontSize: milestoneDescriptionSize }]}>
                          {milestone.description}
                        </Text>
                      ) : null}
                    </View>
                    <View style={styles.milestoneXpBadge}>
                      <Text
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        minimumFontScale={0.75}
                        style={[styles.milestoneXpValue, isCompact ? styles.milestoneXpValueCompact : null, { fontSize: milestoneXpValueSize }]}>
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
