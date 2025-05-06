import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface NewButtonProps {
  icon: LucideIcon;
  onPress: () => void;
}

export function NewButton({ icon: Icon, onPress }: NewButtonProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Icon size={24} color={Colors.yellow} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});