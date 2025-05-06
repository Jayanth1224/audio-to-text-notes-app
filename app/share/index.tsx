import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { handleSharedVideo } from '@/utils/shareHandler';
import { AudioProcessor } from '@/utils/audioProcessor';
import { useNoteStore, NoteStoreState } from '@/store/noteStore';
import Colors from '@/constants/Colors';

export default function ShareScreen() {
  const [status, setStatus] = useState<'loading' | 'processing' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useLocalSearchParams();
  const createNote = useNoteStore((state: NoteStoreState & { createNote: Function }) => state.createNote);

  useEffect(() => {
    const processSharedContent = async () => {
      try {
        // Handle the shared video
        const video = await handleSharedVideo(params);
        if (!video) {
          setError('No video was shared');
          setStatus('error');
          return;
        }

        setStatus('processing');
        
        // Process the video to extract audio and transcribe
        const transcription = await AudioProcessor.processAudioFromVideo(video.uri);
        if (!transcription) {
          setError('Failed to transcribe video');
          setStatus('error');
          return;
        }

        // Create a new note with the transcription
        const note = createNote({
          title: `Video Note ${new Date().toLocaleDateString()}`,
          content: transcription,
          folderId: 'notes'
        });

        setStatus('success');
        
        // Navigate to the note after a short delay
        setTimeout(() => {
          router.replace(`/note/${note.id}`);
        }, 1500);

      } catch (err) {
        console.error('Error processing shared content:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setStatus('error');
      }
    };

    processSharedContent();
  }, [params]);

  return (
    <View style={styles.container}>
      {status === 'loading' && (
        <>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.text}>Loading shared content...</Text>
        </>
      )}

      {status === 'processing' && (
        <>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.text}>Processing video and transcribing audio...</Text>
        </>
      )}

      {status === 'success' && (
        <>
          <Text style={[styles.text, styles.success]}>✓ Note created successfully!</Text>
          <Text style={styles.text}>Redirecting to your note...</Text>
        </>
      )}

      {status === 'error' && (
        <>
          <Text style={[styles.text, styles.error]}>Error: {error}</Text>
          <Text style={styles.text}>Please try sharing the video again.</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.background,
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
    color: Colors.text,
  },
  success: {
    color: Colors.success,
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    color: Colors.error,
    fontSize: 18,
    fontWeight: 'bold',
  },
});