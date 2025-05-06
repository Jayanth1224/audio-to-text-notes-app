import { AudioProcessor } from './audioProcessor';
import * as FileSystem from 'expo-file-system';

export async function transcribeAudio(videoUri?: string): Promise<string> {
  try {
    let uri = videoUri;
    
    // If no videoUri is provided, create a simulated test scenario
    if (!uri) {
      // Create a temporary test audio file
      const testAudioPath = `${FileSystem.cacheDirectory}test_audio.m4a`;
      
      // For testing, we'll create a simple text file that simulates an audio file
      // In a real scenario, this would be an actual audio file
      await FileSystem.writeAsStringAsync(testAudioPath, 'This is a simulated audio file for testing');
      
      uri = testAudioPath;
    }
    
    console.log('Processing audio from:', uri);
    
    // Use our AudioProcessor to handle the transcription
    const transcript = await AudioProcessor.processAudioFromVideo(uri);
    
    // For testing purposes, if we're using the simulated file,
    // return a mock transcription
    if (!videoUri) {
      return "This is a simulated transcription of a cooking recipe:\n\n" +
             "Ingredients:\n" +
             "- 2 cups flour\n" +
             "- 1 cup sugar\n" +
             "- 3 eggs\n" +
             "- 1 cup milk\n\n" +
             "Instructions:\n" +
             "1. Mix dry ingredients\n" +
             "2. Add wet ingredients\n" +
             "3. Bake at 350°F for 30 minutes";
    }
    
    return transcript;
  } catch (error) {
    console.error('Error in transcribeAudio:', error);
    throw error;
  }
} 