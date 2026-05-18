import Ionicons from '@expo/vector-icons/Ionicons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import type { GoalsMutationReward } from './types';

export function GoalCompletionModal({
  reward,
  onClose,
  variant = 'goal',
}: {
  reward: GoalsMutationReward | null;
  onClose: () => void;
  variant?: 'goal' | 'xp';
}) {
  const isGoalVariant = variant === 'goal';
  const isVisible = isGoalVariant ? Boolean(reward?.goalBonusXp) : Boolean(reward && reward.totalXp >= 0);

  return (
    <Modal visible={isVisible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.card, !isGoalVariant ? styles.xpCard : null]}>
          <View style={[styles.glow, !isGoalVariant ? styles.xpGlow : null]} />
          <Ionicons name={isGoalVariant ? 'trophy-outline' : 'sparkles-outline'} size={48} color="#F7F3FF" />
          <Text style={styles.eyebrow}>{isGoalVariant ? 'GOAL COMPLETE' : 'XP UPPLÅST'}</Text>
          <Text style={styles.title}>{reward?.title}</Text>
          <Text style={styles.text}>
            {isGoalVariant
              ? 'Du klarade hela målet och låste upp bonusbelöningen.'
              : reward?.goalBonusXp
                ? 'Du fick XP och en bonus för att du klarade målet.'
                : reward?.questXp
                  ? 'Questen gav dig ett nytt XP-lyft.'
                  : reward?.milestoneXp
                    ? 'Milestonen är klar och gav dig ny progression.'
                    : 'Ditt senaste steg gav mer XP till din karaktär.'}
          </Text>
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
  xpCard: {
    minHeight: '56%',
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
  xpGlow: {
    backgroundColor: '#5E8BFF',
    opacity: 0.18,
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
