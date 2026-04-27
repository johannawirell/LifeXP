import { Redirect, router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSession } from '@/context/session-context';

export default function LoginScreen() {
  const { mode, startDemoMode, startEmptyMode } = useSession();

  if (mode !== 'guest') {
    return <Redirect href="/(tabs)/goals" />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>LifeXP</Text>
        <Text style={styles.subtitle}>Välj hur du vill öppna appen just nu.</Text>

        <Pressable
          style={styles.primaryButton}
          onPress={() => {
            startDemoMode();
            router.replace('/(tabs)/goals');
          }}>
          <Text style={styles.primaryButtonText}>Testläge</Text>
          <Text style={styles.buttonHint}>Öppna testläge med befintliga mål och data</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => {
            startEmptyMode();
            router.replace('/(tabs)/goals');
          }}>
          <Text style={styles.secondaryButtonText}>Ny användare</Text>
          <Text style={styles.buttonHintSecondary}>Börja från början med tom användare</Text>
        </Pressable>
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
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: '#F5F7FB',
    fontSize: 42,
    fontWeight: '800',
  },
  subtitle: {
    color: '#9AA3B2',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 12,
  },
  primaryButton: {
    backgroundColor: '#8B4EF4',
    borderRadius: 18,
    marginTop: 40,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  primaryButtonText: {
    color: '#F7F3FF',
    fontSize: 20,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#151B24',
    borderColor: '#262E3A',
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  secondaryButtonText: {
    color: '#F5F7FB',
    fontSize: 20,
    fontWeight: '700',
  },
  buttonHint: {
    color: '#E9DEFF',
    fontSize: 13,
    marginTop: 8,
  },
  buttonHintSecondary: {
    color: '#9AA3B2',
    fontSize: 13,
    marginTop: 8,
  },
});
