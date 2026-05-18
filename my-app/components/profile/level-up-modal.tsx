import Ionicons from '@expo/vector-icons/Ionicons';
import { Animated, Modal, Pressable, Text, View } from 'react-native';

import { profileStyles as styles } from './styles';

export function LevelUpModal({
  visible,
  level,
  opacity,
  scale,
  onClose,
}: {
  visible: boolean;
  level?: number;
  opacity: Animated.Value;
  scale: Animated.Value;
  onClose: () => void;
}) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.levelUpBackdrop}>
        <Animated.View
          style={[
            styles.levelUpCard,
            {
              opacity,
              transform: [{ scale }],
            },
          ]}>
          <View style={styles.levelUpGlow} />
          <Ionicons name="sparkles-outline" size={34} color="#F7F3FF" />
          <Text style={styles.levelUpEyebrow}>LEVEL UP</Text>
          <Text style={styles.levelUpTitle}>Level {level}</Text>
          <Text style={styles.levelUpText}>Din karaktär har blivit starkare. Fortsätt bygga momentum.</Text>
          <Pressable onPress={onClose} style={styles.levelUpButton}>
            <Text style={styles.levelUpButtonText}>Fortsätt</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}
