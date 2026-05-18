import Ionicons from '@expo/vector-icons/Ionicons';
import * as Linking from 'expo-linking';
import { Redirect, router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSession } from '@/context/session-context';
import { AUTH_BASE_URL } from '@/lib/api';

type AuthMode = 'login' | 'register';
type ProviderId = 'google' | 'apple' | 'android';

const providerButtons: {
  id: ProviderId;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}[] = [
  { id: 'google', title: 'Fortsätt med Google', icon: 'logo-google', color: '#F5F7FB' },
  { id: 'apple', title: 'Fortsätt med Apple ID', icon: 'logo-apple', color: '#F5F7FB' },
  { id: 'android', title: 'Fortsätt med Android', icon: 'logo-android', color: '#8EE46C' },
];

WebBrowser.maybeCompleteAuthSession();

export default function AuthScreen() {
  const { mode, startAuthenticatedSession } = useSession();
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [pendingProvider, setPendingProvider] = useState<ProviderId | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (mode !== 'guest') {
    return <Redirect href="/(tabs)/goals" />;
  }

  const startOAuth = async (provider: ProviderId) => {
    if (provider !== 'google') {
      setError(`${provider === 'apple' ? 'Apple ID' : 'Android'} aktiveras senare. Google är först ut.`);
      return;
    }

    try {
      setError(null);
      setPendingProvider(provider);

      const redirectUri = Linking.createURL('/auth/callback');
      const authUrl = `${AUTH_BASE_URL}/${provider}/start?redirectUri=${encodeURIComponent(redirectUri)}&intent=${authMode}`;
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

      if (result.type !== 'success' || !result.url) {
        setPendingProvider(null);
        return;
      }

      const parsed = Linking.parse(result.url);
      const accessToken = typeof parsed.queryParams?.accessToken === 'string' ? parsed.queryParams.accessToken : null;
      const refreshToken = typeof parsed.queryParams?.refreshToken === 'string' ? parsed.queryParams.refreshToken : null;
      const userId = typeof parsed.queryParams?.userId === 'string' ? parsed.queryParams.userId : null;
      const authProvider =
        typeof parsed.queryParams?.provider === 'string' ? parsed.queryParams.provider : provider;

      if (!accessToken || !refreshToken || !userId) {
        throw new Error('OAuth-svaret saknade access token, refresh token eller userId.');
      }

      startAuthenticatedSession({
        accessToken,
        refreshToken,
        userId,
        provider: authProvider,
      });

      router.replace('/(tabs)/goals');
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'OAuth-flödet misslyckades.');
    } finally {
      setPendingProvider(null);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>LifeXP</Text>
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
          <Text style={styles.cardTitle}>
            {authMode === 'login' ? 'Välj hur du vill logga in' : 'Välj hur du vill skapa konto'}
          </Text>

          <View style={styles.providerList}>
            {providerButtons.map((provider) => {
              const isLoading = pendingProvider === provider.id;

              return (
                <Pressable
                  key={provider.id}
                  disabled={Boolean(pendingProvider) || (provider.id !== 'google' && pendingProvider === null)}
                  onPress={() => void startOAuth(provider.id)}
                  style={[
                    styles.providerButton,
                    isLoading ? styles.providerButtonDisabled : null,
                    provider.id !== 'google' ? styles.providerButtonDisabled : null,
                  ]}>
                  {isLoading ? (
                    <ActivityIndicator color="#F5F7FB" />
                  ) : (
                    <Ionicons color={provider.color} name={provider.icon} size={22} />
                  )}
                  <View style={styles.providerTextWrap}>
                    <Text style={styles.providerButtonText}>{provider.title}</Text>
                    {provider.id !== 'google' ? <Text style={styles.providerSoonText}>Kommer snart</Text> : null}
                  </View>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={18} color="#A866FF" />
            <Text style={styles.infoText}>
              Google är det enda aktiva OAuth-flödet just nu. Apple ID och Android visas kvar men är inte aktiverade ännu.
            </Text>
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
  cardTitle: {
    color: '#F5F7FB',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  providerList: {
    gap: 10,
  },
  providerButton: {
    alignItems: 'center',
    backgroundColor: '#0F151E',
    borderColor: '#252D3A',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 58,
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  providerButtonDisabled: {
    opacity: 0.6,
  },
  providerButtonText: {
    color: '#F5F7FB',
    fontSize: 15,
    fontWeight: '600',
  },
  providerTextWrap: {
    flex: 1,
  },
  providerSoonText: {
    color: '#7E8797',
    fontSize: 12,
    marginTop: 3,
  },
  infoBox: {
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
  infoText: {
    color: '#9FA8B7',
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
  },
  errorText: {
    color: '#E0B6FF',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 14,
  },
});
