import { NativeModules } from 'react-native';

interface SpeechRecognitionInterface {
  transcribeAudioFile(url: string): Promise<string>;
}

const { SpeechRecognition } = NativeModules;

export default SpeechRecognition as SpeechRecognitionInterface; 