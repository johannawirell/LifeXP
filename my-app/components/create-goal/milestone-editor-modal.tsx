import Ionicons from '@expo/vector-icons/Ionicons';
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { editGoalStyles as styles } from './edit-goal-styles';
import type { EditableTemplateDraft } from './types';

type Props = {
  milestone: EditableTemplateDraft['milestones'][number] | null;
  onClose: () => void;
  onUpdateTitle: (milestoneId: string, title: string) => void;
  onUpdateXp: (milestoneId: string, xpReward: number) => void;
  onAddSubtask: (milestoneId: string) => void;
  onRemoveSubtask: (milestoneId: string, subtaskId: string) => void;
  onUpdateSubtaskTitle: (milestoneId: string, subtaskId: string, title: string) => void;
  onAddTip: (milestoneId: string) => void;
  onRemoveTip: (milestoneId: string, tipId: string) => void;
  onUpdateTipText: (milestoneId: string, tipId: string, text: string) => void;
};

export function MilestoneEditorModal({
  milestone,
  onClose,
  onUpdateTitle,
  onUpdateXp,
  onAddSubtask,
  onRemoveSubtask,
  onUpdateSubtaskTitle,
  onAddTip,
  onRemoveTip,
  onUpdateTipText,
}: Props) {
  return (
    <Modal visible={Boolean(milestone)} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Redigera milestone</Text>
            <View style={styles.modalHeaderActions}>
              <Pressable onPress={onClose} style={styles.modalIconButton}>
                <Ionicons name="checkmark" size={20} color="#F7F3FF" />
              </Pressable>
              <Pressable onPress={onClose} style={styles.modalIconButton}>
                <Ionicons name="close" size={20} color="#F5F7FB" />
              </Pressable>
            </View>
          </View>
          {milestone ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <TextInput
                value={milestone.title}
                onChangeText={(text) => onUpdateTitle(milestone.id, text)}
                style={styles.input}
                placeholder="Milestone"
                placeholderTextColor="#6F7887"
              />
              <TextInput
                value={String(milestone.xpReward)}
                onChangeText={(text) => onUpdateXp(milestone.id, Number(text.replace(/[^0-9]/g, '')) || 0)}
                style={[styles.input, styles.secondaryInput]}
                keyboardType="number-pad"
                placeholder="XP"
                placeholderTextColor="#6F7887"
              />

              <View style={styles.modalSectionHeader}>
                <Text style={styles.editorSectionTitle}>Delmål</Text>
                <Pressable onPress={() => onAddSubtask(milestone.id)}>
                  <Text style={styles.inlineActionText}>Lägg till</Text>
                </Pressable>
              </View>
              {milestone.subtasks.map((subtask) => (
                <View key={subtask.id} style={styles.inlineEditorRow}>
                  <TextInput
                    value={subtask.title}
                    onChangeText={(text) => onUpdateSubtaskTitle(milestone.id, subtask.id, text)}
                    style={[styles.input, styles.inlineInput]}
                    placeholder="Delmål"
                    placeholderTextColor="#6F7887"
                  />
                  <Pressable onPress={() => onRemoveSubtask(milestone.id, subtask.id)} hitSlop={8}>
                    <Ionicons name="remove-circle-outline" size={20} color="#F08A45" />
                  </Pressable>
                </View>
              ))}

              <View style={styles.modalSectionHeader}>
                <Text style={styles.editorSectionTitle}>Tips</Text>
                <Pressable onPress={() => onAddTip(milestone.id)}>
                  <Text style={styles.inlineActionText}>Lägg till</Text>
                </Pressable>
              </View>
              {milestone.tips.map((tip) => (
                <View key={tip.id} style={styles.inlineEditorRow}>
                  <TextInput
                    value={tip.text}
                    onChangeText={(text) => onUpdateTipText(milestone.id, tip.id, text)}
                    style={[styles.input, styles.inlineInput]}
                    placeholder="Tips"
                    placeholderTextColor="#6F7887"
                  />
                  <Pressable onPress={() => onRemoveTip(milestone.id, tip.id)} hitSlop={8}>
                    <Ionicons name="remove-circle-outline" size={20} color="#F08A45" />
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}
