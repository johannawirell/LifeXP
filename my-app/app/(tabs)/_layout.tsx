import Ionicons from '@expo/vector-icons/Ionicons';
import { Redirect, Tabs } from 'expo-router';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useSession } from '@/context/session-context';
import { API_BASE_URL, ApiError } from '@/lib/api';

function PlusTabButton({ onPress }: BottomTabBarButtonProps) {
  return (
    <Pressable onPress={onPress} style={styles.plusButtonWrapper}>
      <View style={styles.plusButton}>
        <Ionicons name="add" size={38} color="#F7F3FF" />
      </View>
    </Pressable>
  );
}

export default function TabLayout() {
  const { mode, isHydrating, resetSession, userId } = useSession();
  const [isValidatingSession, setIsValidatingSession] = useState(false);

  useEffect(() => {
    if (isHydrating || mode !== 'authenticated' || !userId) {
      return;
    }

    let isCancelled = false;

    const validateSession = async () => {
      try {
        setIsValidatingSession(true);
        const response = await fetch(`${API_BASE_URL}/profile/${userId}`);

        if (!response.ok) {
          throw new ApiError(response.status, `${API_BASE_URL}/profile/${userId}`);
        }
      } catch (validationError) {
        if (isCancelled) {
          return;
        }

        if (validationError instanceof ApiError && validationError.status === 404) {
          resetSession();
        }
      } finally {
        if (!isCancelled) {
          setIsValidatingSession(false);
        }
      }
    };

    void validateSession();

    return () => {
      isCancelled = true;
    };
  }, [isHydrating, mode, resetSession, userId]);

  if (isHydrating || isValidatingSession) {
    return null;
  }

  if (mode === 'guest') {
    return <Redirect href="/" />;
  }

  return (
    <Tabs
      initialRouteName="profile"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#9B5CF6',
        tabBarInactiveTintColor: '#727280',
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}>
      <Tabs.Screen
        name="goals"
        options={{
          title: 'Mål',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'navigate-circle' : 'navigate-circle-outline'}
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="create-goal"
        options={{
          title: '',
          tabBarLabel: '+',
          tabBarIcon: () => null,
          tabBarButton: (props) => <PlusTabButton {...props} />,
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: 'Statistik',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'stats-chart' : 'stats-chart-outline'} size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#11151D',
    borderTopWidth: 0,
    height: 92,
    paddingBottom: 12,
    paddingTop: 10,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  plusButtonWrapper: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginTop: -24,
  },
  plusButton: {
    alignItems: 'center',
    backgroundColor: '#8B4EF4',
    borderRadius: 24,
    height: 72,
    justifyContent: 'center',
    shadowColor: '#8B4EF4',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    width: 72,
  },
});
