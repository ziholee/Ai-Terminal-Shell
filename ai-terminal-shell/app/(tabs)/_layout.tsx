import { Tabs } from 'expo-router';
import { Terminal, Bot, Server, Settings } from 'lucide-react-native';
import { Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000',
          borderTopColor: '#333',
          borderTopWidth: 1,
          height: isTablet ? 80 : 60,
          paddingBottom: isTablet ? 20 : 10,
          paddingTop: isTablet ? 15 : 5,
        },
        tabBarActiveTintColor: '#00FF00',
        tabBarInactiveTintColor: '#666',
        tabBarLabelStyle: {
          fontSize: isTablet ? 14 : 12,
          fontFamily: 'FiraCode-Regular',
          marginTop: isTablet ? 8 : 4,
        },
        tabBarIconStyle: {
          marginTop: isTablet ? 5 : 0,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Terminal',
          tabBarIcon: ({ size, color }) => (
            <Terminal size={isTablet ? 28 : size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{
          title: 'AI Assistant',
          tabBarIcon: ({ size, color }) => (
            <Bot size={isTablet ? 28 : size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="connections"
        options={{
          title: 'Connections',
          tabBarIcon: ({ size, color }) => (
            <Server size={isTablet ? 28 : size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => (
            <Settings size={isTablet ? 28 : size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}