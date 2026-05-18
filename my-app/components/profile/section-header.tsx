import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, View } from 'react-native';

import { profileStyles as styles } from './styles';

export function SectionHeader({
  title,
  action,
  onPress,
}: {
  title: string;
  action?: string;
  onPress?: () => void;
}) {
  const content = (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <View style={styles.sectionAction}>
          <Text style={styles.sectionActionText}>{action}</Text>
          <Ionicons name="chevron-forward" size={14} color="#8D56F7" />
        </View>
      ) : null}
    </View>
  );

  if (!action || !onPress) {
    return content;
  }

  return <Pressable onPress={onPress}>{content}</Pressable>;
}
