import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { FolderIcon } from './FolderIcon';

interface FolderItemProps {
  icon: 'folder' | 'pencil' | 'user' | 'trash';
  title: string;
  count: number;
  onPress: () => void;
}

export function FolderItem({ icon, title, count, onPress }: FolderItemProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <FolderIcon type={icon} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.rightContent}>
        <Text style={styles.count}>{count}</Text>
        <ChevronRight size={20} color={Colors.gray} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderColor,
  },
  iconContainer: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontFamily: 'Inter-Regular',
    color: Colors.white,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  count: {
    fontSize: 17,
    fontFamily: 'Inter-Regular',
    color: Colors.gray,
    marginRight: 6,
  },
});