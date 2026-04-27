import { StyleSheet, Text, View } from 'react-native';

type PlaceholderScreenProps = {
  label: string;
};

export default function PlaceholderScreen({ label }: PlaceholderScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
  },
});
