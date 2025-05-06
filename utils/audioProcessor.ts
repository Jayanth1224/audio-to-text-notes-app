import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import SpeechRecognition from './SpeechRecognition';

export class AudioProcessor {
  static async processAudioFromVideo(videoUri: string): Promise<string> {
    try {
      console.log('Starting audio processing for:', videoUri);
      
      // Create a temporary file for the audio
      const tempAudioFile = `${FileSystem.cacheDirectory}temp_audio.m4a`;
      console.log('Temporary audio file path:', tempAudioFile);
      
      // Extract audio from video
      await this.extractAudioFromVideo(videoUri, tempAudioFile);
      console.log('Audio extraction completed');
      
      // Process audio in chunks (60s each)
      const audioChunks = await this.splitAudioIntoChunks(tempAudioFile);
      console.log('Audio split into', audioChunks.length, 'chunks');
      
      // Transcribe each chunk
      const transcriptions = await Promise.all(
        audioChunks.map(async (chunk, index) => {
          console.log(`Transcribing chunk ${index + 1}/${audioChunks.length}`);
          return this.transcribeAudioChunk(chunk);
        })
      );
      
      // Clean up temporary files
      console.log('Cleaning up temporary files');
      await Promise.all([
        FileSystem.deleteAsync(tempAudioFile, { idempotent: true }),
        ...audioChunks.map(chunk => 
          FileSystem.deleteAsync(chunk, { idempotent: true })
        )
      ]);
      
      // Combine transcriptions
      const finalTranscript = transcriptions.join(' ');
      console.log('Transcription completed');
      return finalTranscript;
    } catch (error) {
      console.error('Error processing audio:', error);
      throw error;
    }
  }

  private static async extractAudioFromVideo(videoUri: string, outputPath: string): Promise<void> {
    console.log('Extracting audio from video:', videoUri);
    
    try {
      // For testing purposes, we'll just copy the file
      // In a real implementation, we would use AVFoundation to extract audio
      await FileSystem.copyAsync({
        from: videoUri,
        to: outputPath
      });
      console.log('Audio extraction completed successfully');
    } catch (error) {
      console.error('Error extracting audio:', error);
      throw error;
    }
  }

  private static async splitAudioIntoChunks(audioFile: string): Promise<string[]> {
    console.log('Splitting audio into chunks');
    
    // For now, we'll just return the original file
    // In a real implementation, we would split files longer than 60s
    return [audioFile];
  }

  private static async transcribeAudioChunk(audioChunk: string): Promise<string> {
    console.log('Transcribing audio chunk:', audioChunk);
    
    try {
      const transcript = await SpeechRecognition.transcribeAudioFile(audioChunk);
      console.log('Chunk transcription completed');
      return transcript;
    } catch (error) {
      console.error('Error transcribing audio chunk:', error);
      throw error;
    }
  }
} 