import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { formatDate } from '@/utils/dateFormatter';
import Colors from '@/constants/Colors';

interface NoteItemProps {
  title: string;
  excerpt: string;
  date: Date;
  onPress: () => void;
}

export function NoteItem({ title, excerpt, date, onPress }: NoteItemProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.details}>
          <Text style={styles.date}>{formatDate(date)}</Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.excerpt} numberOfLines={1}>
            {excerpt}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderColor,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
    color: Colors.white,
    marginBottom: 4,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray,
  },
  separator: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray,
    marginHorizontal: 6,
  },
  excerpt: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray,
  },
});