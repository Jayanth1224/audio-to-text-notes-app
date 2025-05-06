import Foundation
import Speech

@objc(SpeechRecognition)
class SpeechRecognition: NSObject {
  private let speechRecognizer = SFSpeechRecognizer(locale: Locale(identifier: "en-US"))
  private var recognitionRequest: SFSpeechURLRecognitionRequest?
  private var recognitionTask: SFSpeechRecognitionTask?
  
  @objc
  func transcribeAudioFile(_ url: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let audioURL = URL(string: url) else {
      reject("invalid_url", "Invalid audio URL provided", nil)
      return
    }
    
    SFSpeechRecognizer.requestAuthorization { authStatus in
      switch authStatus {
      case .authorized:
        self.startTranscription(audioURL, resolver: resolve, rejecter: reject)
      case .denied:
        reject("permission_denied", "Speech recognition permission denied", nil)
      case .restricted:
        reject("permission_restricted", "Speech recognition is restricted", nil)
      case .notDetermined:
        reject("permission_not_determined", "Speech recognition permission not determined", nil)
      @unknown default:
        reject("unknown_error", "Unknown authorization status", nil)
      }
    }
  }
  
  private func startTranscription(_ audioURL: URL, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let recognizer = speechRecognizer, recognizer.isAvailable else {
      reject("recognizer_unavailable", "Speech recognizer is not available", nil)
      return
    }
    
    recognitionRequest = SFSpeechURLRecognitionRequest(url: audioURL)
    guard let recognitionRequest = recognitionRequest else {
      reject("request_error", "Unable to create recognition request", nil)
      return
    }
    
    recognitionRequest.shouldReportPartialResults = false
    
    recognitionTask = recognizer.recognitionTask(with: recognitionRequest) { result, error in
      if let error = error {
        reject("transcription_error", "Error transcribing audio: \(error.localizedDescription)", error)
        return
      }
      
      guard let result = result else {
        reject("no_result", "No transcription result available", nil)
        return
      }
      
      if result.isFinal {
        resolve(result.bestTranscription.formattedString)
      }
    }
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
} 