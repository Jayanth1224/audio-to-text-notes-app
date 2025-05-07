#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(SpeechTranscriber, NSObject)

RCT_EXTERN_METHOD(transcribeAudio:(NSString *)audioPath
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end 