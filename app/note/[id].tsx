import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Share2, MoreVertical } from 'lucide-react-native';
import { useNoteStore } from '@/store/noteStore';
import Colors from '@/constants/Colors';

export default function NoteScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getNoteById, updateNote, createNote } = useNoteStore();
  
  const isNew = id === 'new';
  const note = isNew ? null : getNoteById(id);
  
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  
  const saveNote = () => {
    if (isNew) {
      if (title.trim() || content.trim()) {
        createNote({
          title: title.trim() || 'Untitled Note',
          content: content.trim(),
          folderId: 'notes', // Default folder
        });
      }
    } else if (note) {
      updateNote(id, {
        title: title.trim() || 'Untitled Note',
        content: content.trim(),
      });
    }
  };
  
  // Auto-save when going back or component unmounts
  useEffect(() => {
    return () => {
      saveNote();
    };
  }, [title, content]);
  
  const handleGoBack = () => {
    saveNote();
    router.back();
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ChevronLeft size={24} color={Colors.yellow} />
        </TouchableOpacity>
        
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.iconButton}>
            <Share2 size={24} color={Colors.yellow} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MoreVertical size={24} color={Colors.yellow} />
          </TouchableOpacity>
        </View>
      </View>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
        keyboardVerticalOffset={100}
      >
        <ScrollView style={styles.scrollView}>
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Title"
            placeholderTextColor={Colors.gray}
            selectionColor={Colors.yellow}
            autoFocus={isNew}
          />
          <TextInput
            style={styles.contentInput}
            value={content}
            onChangeText={setContent}
            placeholder="Note"
            placeholderTextColor={Colors.gray}
            selectionColor={Colors.yellow}
            multiline
            textAlignVertical="top"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkBackground,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderColor,
  },
  backButton: {
    padding: 8,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    marginLeft: 16,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  titleInput: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: Colors.white,
    marginBottom: 16,
    padding: 0,
  },
  contentInput: {
    flex: 1,
    fontSize: 17,
    fontFamily: 'Inter-Regular',
    color: Colors.white,
    lineHeight: 24,
    padding: 0,
    minHeight: 300,
  },
});