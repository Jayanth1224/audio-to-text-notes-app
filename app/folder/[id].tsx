import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SearchBar } from '@/components/SearchBar';
import { NoteItem } from '@/components/NoteItem';
import { useNoteStore } from '@/store/noteStore';
import { useFolderStore } from '@/store/folderStore';
import { ChevronLeft, File } from 'lucide-react-native';
import { NewButton } from '@/components/NewButton';
import Colors from '@/constants/Colors';

export default function FolderScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  
  const { getFolderById } = useFolderStore();
  const { getNotesByFolderId } = useNoteStore();
  
  const folder = getFolderById(id);
  const notes = getNotesByFolderId(id);
  
  const handleNotePress = (noteId: string) => {
    router.push(`/note/${noteId}`);
  };

  const handleNewNote = () => {
    router.push({
      pathname: '/note/new',
      params: { folderId: id }
    });
  };

  const handleGoBack = () => {
    router.back();
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ChevronLeft size={24} color={Colors.yellow} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{folder?.name || 'Folder'}</Text>
          <Text style={styles.noteCount}>{notes.length}</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
      </View>
      
      <SearchBar 
        value={searchQuery} 
        onChangeText={setSearchQuery}
        placeholder="Search"
      />
      
      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NoteItem
            title={item.title}
            excerpt={item.content}
            date={item.updatedAt}
            onPress={() => handleNotePress(item.id)}
          />
        )}
        style={styles.notesList}
        contentContainerStyle={styles.notesContent}
        showsVerticalScrollIndicator={false}
      />
      
      <View style={styles.footer}>
        <NewButton 
          icon={File} 
          onPress={handleNewNote}
        />
      </View>
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
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.white,
    marginRight: 8,
  },
  noteCount: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.gray,
  },
  editButton: {
    fontSize: 17,
    fontFamily: 'Inter-Regular',
    color: Colors.yellow,
  },
  notesList: {
    flex: 1,
  },
  notesContent: {
    paddingHorizontal: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
});