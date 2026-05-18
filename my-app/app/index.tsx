import Ionicons from '@expo/vector-icons/Ionicons';
import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSession } from '@/context/session-context';

type AuthMode = 'login' | 'register';

type SocialProvider = {
  id: 'apple' | 'google' | 'android';
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  tint: string;
};

const socialProviders: SocialProvider[] = [
  { id: 'apple', label: 'Fortsätt med Apple ID', icon: 'logo-apple', tint: '#F5F7FB' },
  { id: 'google', label: 'Fortsätt med Google', icon: 'logo-google', tint: '#F5F7FB' },
  { id: 'android', label: 'Fortsätt med Android', icon: 'logo-android', tint: '#8EE46C' },
];

export default function AuthScreen() {
  const { mode, startDemoMode, startEmptyMode } = useSession();
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  if (mode !== 'guest') {
    return <Redirect href="/(tabs)/goals" />;
  }

  const submitAuth = () => {
    if (authMode === 'login') {
      startDemoMode();
      router.replace('/(tabs)/goals');
      return;
    }

    startEmptyMode();
    router.replace('/(tabs)/goals');
  };

  const continueWithProvider = (provider: SocialProvider['id']) => {
    if (authMode === 'login') {
      startDemoMode();
      router.replace('/(tabs)/goals');
      return;
    }

    if (provider === 'apple' || provider === 'google' || provider === 'android') {
      startEmptyMode();
      router.replace('/(tabs)/goals');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>LifeXP</Text>
          <Text style={styles.title}>Turn your life into a game</Text>
          <Text style={styles.subtitle}>
            {authMode === 'login'
              ? 'Logga in för att fortsätta med din profil, dina mål och din statistik.'
              : 'Skapa konto för att börja från början och bygga upp din resa i appen.'}
          </Text>
        </View>

        <View style={styles.modeToggle}>
          <Pressable
            onPress={() => setAuthMode('login')}
            style={[styles.modeButton, authMode === 'login' ? styles.modeButtonActive : null]}>
            <Text style={[styles.modeButtonText, authMode === 'login' ? styles.modeButtonTextActive : null]}>
              Logga in
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setAuthMode('register')}
            style={[styles.modeButton, authMode === 'register' ? styles.modeButtonActive : null]}>
            <Text style={[styles.modeButtonText, authMode === 'register' ? styles.modeButtonTextActive : null]}>
              Registrera
            </Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          {authMode === 'register' ? (
            <TextInput
              placeholder="Namn"
              placeholderTextColor="#6F7887"
              style={styles.input}
            />
          ) : null}
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="E-post"
            placeholderTextColor="#6F7887"
            style={styles.input}
          />
          <TextInput
            secureTextEntry
            placeholder="Lösenord"
            placeholderTextColor="#6F7887"
            style={styles.input}
          />

          <Pressable onPress={submitAuth} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>
              {authMode === 'login' ? 'Logga in' : 'Skapa konto'}
            </Text>
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>eller</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialList}>
            {socialProviders.map((provider) => (
              <Pressable
                key={provider.id}
                onPress={() => continueWithProvider(provider.id)}
                style={styles.socialButton}>
                <Ionicons color={provider.tint} name={provider.icon} size={20} />
                <Text style={styles.socialButtonText}>{provider.label}</Text>
              </Pressable>
            ))}
          </View>


        </View>
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
    paddingHorizontal: 22,
  },
  hero: {
    marginBottom: 28,
  },
  eyebrow: {
    color: '#A866FF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  title: {
    color: '#F5F7FB',
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 38,
    marginTop: 14,
  },
  subtitle: {
    color: '#A1AABA',
    fontSize: 15,
    lineHeight: 23,
    marginTop: 12,
  },
  modeToggle: {
    backgroundColor: '#121924',
    borderColor: '#212936',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 16,
    padding: 6,
  },
  modeButton: {
    alignItems: 'center',
    borderRadius: 14,
    flex: 1,
    paddingVertical: 12,
  },
  modeButtonActive: {
    backgroundColor: '#8B4EF4',
  },
  modeButtonText: {
    color: '#7D8796',
    fontSize: 15,
    fontWeight: '700',
  },
  modeButtonTextActive: {
    color: '#F7F3FF',
  },
  card: {
    backgroundColor: '#141B25',
    borderColor: '#202836',
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  input: {
    backgroundColor: '#0E141D',
    borderColor: '#252D3A',
    borderRadius: 16,
    borderWidth: 1,
    color: '#F5F7FB',
    fontSize: 15,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#8B4EF4',
    borderRadius: 16,
    marginTop: 4,
    paddingVertical: 16,
  },
  primaryButtonText: {
    color: '#F7F3FF',
    fontSize: 16,
    fontWeight: '700',
  },
  dividerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 18,
  },
  dividerLine: {
    backgroundColor: '#27303D',
    flex: 1,
    height: 1,
  },
  dividerText: {
    color: '#7F8896',
    fontSize: 13,
    marginHorizontal: 12,
  },
  socialList: {
    gap: 10,
  },
  socialButton: {
    alignItems: 'center',
    backgroundColor: '#0F151E',
    borderColor: '#252D3A',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  socialButtonText: {
    color: '#F5F7FB',
    fontSize: 15,
    fontWeight: '600',
  },
  devHintBox: {
    alignItems: 'flex-start',
    backgroundColor: '#101621',
    borderColor: '#222B38',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  devHintText: {
    color: '#9FA8B7',
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
  },
});
