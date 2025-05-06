#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(SpeechRecognition, NSObject)

RCT_EXTERN_METHOD(transcribeAudioFile:(NSString *)url
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end 