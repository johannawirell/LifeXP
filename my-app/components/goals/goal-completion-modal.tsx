import Ionicons from '@expo/vector-icons/Ionicons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import type { GoalsMutationReward } from './types';

export function GoalCompletionModal({
  reward,
  onClose,
}: {
  reward: GoalsMutationReward | null;
  onClose: () => void;
}) {
  return (
    <Modal visible={Boolean(reward?.goalBonusXp)} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.glow} />
          <Ionicons name="trophy-outline" size={48} color="#F7F3FF" />
          <Text style={styles.eyebrow}>GOAL COMPLETE</Text>
          <Text style={styles.title}>{reward?.title}</Text>
          <Text style={styles.text}>Du klarade hela målet och låste upp bonusbelöningen.</Text>
          <View style={styles.xpPill}>
            <Text style={styles.xpText}>+{reward?.totalXp} XP</Text>
          </View>
          <Pressable onPress={onClose} style={styles.button}>
            <Text style={styles.buttonText}>Fortsätt</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(5, 8, 14, 0.78)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  card: {
    alignItems: 'center',
    backgroundColor: '#121824',
    borderColor: '#2B3444',
    borderRadius: 32,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: '68%',
    overflow: 'hidden',
    paddingHorizontal: 28,
    paddingVertical: 36,
    width: '100%',
  },
  glow: {
    backgroundColor: '#A866FF',
    borderRadius: 160,
    height: 220,
    opacity: 0.16,
    position: 'absolute',
    top: -70,
    width: 220,
  },
  eyebrow: {
    color: '#C9A9FF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginTop: 18,
  },
  title: {
    color: '#F7F3FF',
    fontSize: 32,
    fontWeight: '900',
    marginTop: 14,
    textAlign: 'center',
  },
  text: {
    color: '#C8D0DB',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 14,
    textAlign: 'center',
  },
  xpPill: {
    backgroundColor: '#8B4EF4',
    borderRadius: 999,
    marginTop: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  xpText: {
    color: '#F7F3FF',
    fontSize: 18,
    fontWeight: '900',
  },
  button: {
    backgroundColor: '#F7F3FF',
    borderRadius: 16,
    marginTop: 26,
    minWidth: 160,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  buttonText: {
    color: '#161C27',
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
  },
});
