import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Folder, PenSquare, User, Trash } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface FolderIconProps {
  type: 'folder' | 'pencil' | 'user' | 'trash';
  size?: number;
}

export function FolderIcon({ type, size = 30 }: FolderIconProps) {
  const renderIcon = () => {
    switch (type) {
      case 'folder':
        return <Folder size={size - 10} color={Colors.white} />;
      case 'pencil':
        return <PenSquare size={size - 10} color={Colors.white} />;
      case 'user':
        return <User size={size - 10} color={Colors.white} />;
      case 'trash':
        return <Trash size={size - 10} color={Colors.white} />;
      default:
        return <Folder size={size - 10} color={Colors.white} />;
    }
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {renderIcon()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.yellow,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});