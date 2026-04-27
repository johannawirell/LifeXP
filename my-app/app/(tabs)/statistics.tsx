import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSession } from '@/context/session-context';

export default function StatisticsScreen() {
  const { mode, resetSession } = useSession();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Ionicons
          name={mode === 'empty' ? 'stats-chart-outline' : 'bar-chart-outline'}
          size={44}
          color="#A866FF"
        />
        <Text style={styles.title}>Statistik</Text>
        <Text style={styles.text}>
          {mode === 'empty'
            ? 'Ingen statistik finns ännu eftersom den här användaren precis skapats.'
            : 'Statistikfliken är nästa steg och kan kopplas fullt ut till analytics-service på samma sätt som mål och profil.'}
        </Text>
        {mode === 'empty' ? (
          <Pressable onPress={resetSession} style={styles.button}>
            <Text style={styles.buttonText}>Byt läge</Text>
          </Pressable>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#090E16',
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: '#F5F7FB',
    fontSize: 28,
    fontWeight: '700',
    marginTop: 18,
  },
  text: {
    color: '#9AA3B2',
    fontSize: 15,
    lineHeight: 24,
    marginTop: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#8B4EF4',
    borderRadius: 12,
    marginTop: 20,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  buttonText: {
    color: '#F7F3FF',
    fontSize: 14,
    fontWeight: '700',
  },
});
