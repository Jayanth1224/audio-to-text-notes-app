import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Check, X } from 'lucide-react-native';
import { useNoteStore } from '@/store/noteStore';
import { transcribeAudio } from '@/utils/audioTranscription';
import Colors from '@/constants/Colors';

// This would be a share extension entry point in a real native app
// For Expo, we'll simulate receiving a shared video
export default function ShareScreen() {
  const router = useRouter();
  const { createNote } = useNoteStore();
  const [isProcessing, setIsProcessing] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Simulate receiving a video and transcribing the audio
  useEffect(() => {
    const processSharedContent = async () => {
      try {
        // In a real app, we'd get the shared video URL from the share extension
        // Here we'll simulate a transcription with a delay
        const simulatedTranscript = await transcribeAudio();
        setTranscript(simulatedTranscript);
      } catch (err) {
        setError('Failed to transcribe audio. Please try again.');
        console.error(err);
      } finally {
        setIsProcessing(false);
      }
    };
    
    processSharedContent();
  }, []);
  
  const handleSave = () => {
    if (transcript) {
      // Create a new note with the transcribed content
      createNote({
        title: 'Transcribed Note',
        content: transcript,
        folderId: 'notes', // Default folder
      });
      
      // Navigate to the notes list
      router.replace('/');
    }
  };
  
  const handleCancel = () => {
    router.back();
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
          <X size={24} color={Colors.red} />
        </TouchableOpacity>
        <Text style={styles.title}>Transcribe Audio</Text>
        <TouchableOpacity 
          onPress={handleSave} 
          style={styles.headerButton}
          disabled={isProcessing || !transcript}
        >
          <Check size={24} color={isProcessing || !transcript ? Colors.gray : Colors.green} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        {isProcessing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.yellow} />
            <Text style={styles.loadingText}>Transcribing audio...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <View style={styles.transcriptContainer}>
            <Text style={styles.transcriptText}>{transcript}</Text>
          </View>
        )}
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
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderColor,
  },
  headerButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.white,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.white,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.red,
    textAlign: 'center',
  },
  transcriptContainer: {
    flex: 1,
  },
  transcriptText: {
    fontSize: 17,
    fontFamily: 'Inter-Regular',
    color: Colors.white,
    lineHeight: 24,
  },
});