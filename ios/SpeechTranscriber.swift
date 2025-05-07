import Foundation
import Speech

@objc(SpeechTranscriber)
class SpeechTranscriber: NSObject {
  private let speechRecognizer = SFSpeechRecognizer(locale: Locale(identifier: "en-US"))
  private var recognitionRequest: SFSpeechAudioBufferRecognitionRequest?
  private var recognitionTask: SFSpeechRecognitionTask?
  private let audioEngine = AVAudioEngine()
  
  @objc
  func transcribeAudio(_ audioPath: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    // Request authorization
    SFSpeechRecognizer.requestAuthorization { authStatus in
      DispatchQueue.main.async {
        switch authStatus {
        case .authorized:
          self.startTranscription(audioPath: audioPath, resolve: resolve, reject: reject)
        case .denied:
          reject("AUTHORIZATION_DENIED", "Speech recognition authorization denied", nil)
        case .restricted:
          reject("AUTHORIZATION_RESTRICTED", "Speech recognition not available on this device", nil)
        case .notDetermined:
          reject("AUTHORIZATION_NOT_DETERMINED", "Speech recognition not yet authorized", nil)
        @unknown default:
          reject("AUTHORIZATION_UNKNOWN", "Unknown authorization status", nil)
        }
      }
    }
  }
  
  private func startTranscription(audioPath: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let audioFile = try? AVAudioFile(forReading: URL(fileURLWithPath: audioPath)) else {
      reject("FILE_ERROR", "Could not read audio file", nil)
      return
    }
    
    let audioFormat = audioFile.processingFormat
    let audioFrameCount = UInt32(audioFile.length)
    
    guard let audioBuffer = AVAudioPCMBuffer(pcmFormat: audioFormat, frameCapacity: audioFrameCount) else {
      reject("BUFFER_ERROR", "Could not create audio buffer", nil)
      return
    }
    
    do {
      try audioFile.read(into: audioBuffer)
    } catch {
      reject("READ_ERROR", "Could not read audio file into buffer", error)
      return
    }
    
    recognitionRequest = SFSpeechAudioBufferRecognitionRequest()
    guard let recognitionRequest = recognitionRequest else {
      reject("REQUEST_ERROR", "Could not create recognition request", nil)
      return
    }
    
    recognitionTask = speechRecognizer?.recognitionTask(with: recognitionRequest) { result, error in
      if let error = error {
        reject("RECOGNITION_ERROR", "Recognition failed", error)
        return
      }
      
      if let result = result {
        resolve(result.bestTranscription.formattedString)
      }
    }
    
    let inputNode = audioEngine.inputNode
    inputNode.installTap(onBus: 0, bufferSize: 1024, format: audioFormat) { buffer, _ in
      recognitionRequest.append(buffer)
    }
    
    do {
      try audioEngine.start()
    } catch {
      reject("ENGINE_ERROR", "Could not start audio engine", error)
      return
    }
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
} 