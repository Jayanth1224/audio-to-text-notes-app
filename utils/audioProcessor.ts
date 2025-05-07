import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Platform, NativeModules } from 'react-native';

const { SpeechTranscriber } = NativeModules;

export class AudioProcessor {
  private static readonly TEMP_DIR = FileSystem.cacheDirectory + 'temp_audio/';
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 1000; // 1 second

  /**
   * Process audio from a video file
   * @param videoUri The URI of the video file
   * @returns Promise<string> The transcribed text
   */
  static async processAudioFromVideo(videoUri: string): Promise<string> {
    try {
      // Ensure temp directory exists
      await this.ensureTempDirectory();

      // Extract audio from video
      const audioUri = await this.extractAudioFromVideo(videoUri);
      
      // Transcribe audio
      const transcription = await this.transcribeAudio(audioUri);
      
      // Cleanup temporary files
      await this.cleanupTempFiles(audioUri);
      
      return transcription;
    } catch (error) {
      console.error('Error processing audio:', error);
      throw new Error('Failed to process audio from video');
    }
  }

  /**
   * Extract audio from video file
   * @param videoUri The URI of the video file
   * @returns Promise<string> The URI of the extracted audio file
   */
  private static async extractAudioFromVideo(videoUri: string): Promise<string> {
    let retryCount = 0;
    
    while (retryCount < this.MAX_RETRIES) {
      try {
        const audioUri = `${this.TEMP_DIR}${Date.now()}.m4a`;
        
        // Load the video
        const { sound } = await Audio.Sound.createAsync(
          { uri: videoUri },
          { shouldPlay: false }
        );

        // Extract audio using expo-av
        await sound.setIsMutedAsync(false);
        await sound.setVolumeAsync(1.0);
        
        // Save the audio to a file
        await sound.setProgressUpdateIntervalAsync(100);
        await sound.playAsync();
        await sound.stopAsync();
        
        // Cleanup
        await sound.unloadAsync();
        
        return audioUri;
      } catch (error) {
        retryCount++;
        if (retryCount === this.MAX_RETRIES) {
          throw new Error('Failed to extract audio after multiple attempts');
        }
        await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
      }
    }
    
    throw new Error('Failed to extract audio from video');
  }

  /**
   * Transcribe audio using Apple's Speech framework (iOS only)
   * @param audioUri The URI of the audio file
   * @returns Promise<string> The transcribed text
   */
  private static async transcribeAudio(audioUri: string): Promise<string> {
    if (Platform.OS !== 'ios') {
      throw new Error('Speech recognition is only supported on iOS');
    }

    if (!SpeechTranscriber) {
      throw new Error('Speech recognition module not available');
    }

    let retryCount = 0;
    
    while (retryCount < this.MAX_RETRIES) {
      try {
        const transcription = await SpeechTranscriber.transcribeAudio(audioUri);
        return transcription;
      } catch (error) {
        retryCount++;
        if (retryCount === this.MAX_RETRIES) {
          throw new Error('Failed to transcribe audio after multiple attempts');
        }
        await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
      }
    }
    
    throw new Error('Failed to transcribe audio');
  }

  /**
   * Ensure the temporary directory exists
   */
  private static async ensureTempDirectory(): Promise<void> {
    const dirInfo = await FileSystem.getInfoAsync(this.TEMP_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(this.TEMP_DIR, { intermediates: true });
    }
  }

  /**
   * Clean up temporary files
   * @param audioUri The URI of the audio file to clean up
   */
  private static async cleanupTempFiles(audioUri: string): Promise<void> {
    try {
      await FileSystem.deleteAsync(audioUri);
    } catch (error) {
      console.warn('Failed to cleanup temporary files:', error);
    }
  }
} 