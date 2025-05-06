import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SearchBar } from '@/components/SearchBar';
import { FolderItem } from '@/components/FolderItem';
import { NewButton } from '@/components/NewButton';
import { ChevronDown, FolderPlus, File } from 'lucide-react-native';
import { useFolderStore } from '@/store/folderStore';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';

export default function FoldersScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { folders } = useFolderStore();
  
  const handleFolderPress = (folderId: string) => {
    router.push(`/folder/${folderId}`);
  };

  const handleNewFolder = () => {
    // Implement new folder creation functionality
    console.log('Create new folder');
  };

  const handleNewNote = () => {
    // Create a new note in the default folder
    router.push('/note/new');
  };

  const renderSectionHeader = (title: string, isExpandable: boolean = false) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {isExpandable && (
        <ChevronDown size={20} color={Colors.yellow} />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.title}>Folders</Text>
        <TouchableOpacity>
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
      </View>
      
      <SearchBar 
        value={searchQuery} 
        onChangeText={setSearchQuery}
        placeholder="Search"
      />
      
      <View style={styles.content}>
        <View style={styles.folderSection}>
          <FolderItem 
            icon="pencil" 
            title="Quick Notes" 
            count={2} 
            onPress={() => handleFolderPress('quick-notes')}
          />
          <FolderItem 
            icon="user" 
            title="Shared" 
            count={2} 
            onPress={() => handleFolderPress('shared')}
          />
        </View>
        
        {renderSectionHeader('iCloud', true)}
        
        <View style={styles.folderSection}>
          <FolderItem 
            icon="folder" 
            title="Notes" 
            count={68} 
            onPress={() => handleFolderPress('notes')}
          />
          <FolderItem 
            icon="trash" 
            title="Recently Deleted" 
            count={3} 
            onPress={() => handleFolderPress('recently-deleted')}
          />
        </View>
      </View>
      
      <View style={styles.footer}>
        <NewButton 
          icon={FolderPlus} 
          onPress={handleNewFolder}
        />
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
  title: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: Colors.white,
  },
  editButton: {
    fontSize: 17,
    fontFamily: 'Inter-Regular',
    color: Colors.yellow,
  },
  content: {
    flex: 1,
  },
  folderSection: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 24,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: Colors.white,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
});