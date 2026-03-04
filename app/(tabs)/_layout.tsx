import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, View, Text } from 'react-native';
import { useApp } from '@/lib/app-context';

function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', gap: 2 }}>
      <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>
      <Text style={{ fontSize: 10, color: focused ? '#D4AF37' : '#475569', letterSpacing: 0.5 }}>
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === 'web' ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 60 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          paddingTop: 8,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          backgroundColor: '#0F172A',
          borderTopColor: '#1E293B',
          borderTopWidth: 1,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#D4AF37',
        tabBarInactiveTintColor: '#475569',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="☽" label="星轨" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="sandbox"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🌌" label="羁绊" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
