import { AudioProcessor } from './audioProcessor';

export async function transcribeAudio(videoUri?: string): Promise<string> {
  try {
    // If no videoUri is provided, we'll use a simulated one for testing
    const uri = videoUri || 'file:///path/to/simulated/video.mp4';
    
    // Use our AudioProcessor to handle the transcription
    const transcript = await AudioProcessor.processAudioFromVideo(uri);
    return transcript;
  } catch (error) {
    console.error('Error in transcribeAudio:', error);
    throw error;
  }
} 