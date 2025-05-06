import { Tabs } from 'expo-router';
import { Folder, Plus, PenSquare } from 'lucide-react-native';
import { View, StyleSheet, Platform } from 'react-native';
import Colors from '@/constants/Colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.yellow,
        tabBarInactiveTintColor: Colors.gray,
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Folders',
          tabBarIcon: ({ color, size }) => <Folder color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          title: 'All Notes',
          tabBarIcon: ({ color, size }) => <PenSquare color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.darkBackground,
    borderTopWidth: 0.2,
    borderTopColor: Colors.borderColor,
    paddingBottom: Platform.OS === 'ios' ? 20 : 5,
    paddingTop: 5,
    height: Platform.OS === 'ios' ? 85 : 65,
  },
});