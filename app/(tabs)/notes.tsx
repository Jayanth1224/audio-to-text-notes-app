import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SearchBar } from '@/components/SearchBar';
import { NoteItem } from '@/components/NoteItem';
import { useNoteStore } from '@/store/noteStore';
import { useRouter } from 'expo-router';
import { File } from 'lucide-react-native';
import { NewButton } from '@/components/NewButton';
import Colors from '@/constants/Colors';

export default function NotesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { notes } = useNoteStore();
  
  const handleNotePress = (noteId: string) => {
    router.push(`/note/${noteId}`);
  };

  const handleNewNote = () => {
    router.push('/note/new');
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>All Notes</Text>
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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 0 : 40,
    paddingBottom: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: Colors.white,
    marginRight: 8,
  },
  noteCount: {
    fontSize: 18,
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