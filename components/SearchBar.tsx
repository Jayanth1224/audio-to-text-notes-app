import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Mic } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = 'Search' }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.placeholderText}
        selectionColor={Colors.yellow}
        clearButtonMode="while-editing"
      />
      <TouchableOpacity style={styles.micButton}>
        <Mic size={20} color={Colors.gray} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 8 : 4,
  },
  input: {
    flex: 1,
    height: 36,
    fontSize: 17,
    fontFamily: 'Inter-Regular',
    color: Colors.white,
  },
  micButton: {
    padding: 4,
  },
});