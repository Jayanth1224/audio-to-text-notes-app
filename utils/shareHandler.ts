import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

interface SharedVideo {
  uri: string;
  type: string;
  name: string;
}

/**
 * Handles incoming shared videos from other apps
 * @param sharedData The shared data from the extension
 * @returns Promise<SharedVideo | null>
 */
export const handleSharedVideo = async (sharedData: any): Promise<SharedVideo | null> => {
  try {
    // Check if we have shared data
    if (!sharedData || !sharedData.items || sharedData.items.length === 0) {
      console.log('No shared data received');
      return null;
    }

    // Get the first shared item
    const item = sharedData.items[0];
    
    // Check if it's a video
    if (!item.type?.startsWith('video/')) {
      console.log('Shared item is not a video');
      return null;
    }

    // For iOS, we need to handle the file differently
    if (Platform.OS === 'ios') {
      const videoUri = item.uri;
      
      // Create a temporary file path
      const tempFilePath = `${FileSystem.cacheDirectory}shared_video_${Date.now()}.mov`;
      
      // Copy the video to our app's cache directory
      await FileSystem.copyAsync({
        from: videoUri,
        to: tempFilePath
      });

      return {
        uri: tempFilePath,
        type: item.type,
        name: `shared_video_${Date.now()}.mov`
      };
    }

    // For Android, the URI is directly usable
    return {
      uri: item.uri,
      type: item.type,
      name: item.name || `shared_video_${Date.now()}.mp4`
    };

  } catch (error) {
    console.error('Error handling shared video:', error);
    return null;
  }
}; 