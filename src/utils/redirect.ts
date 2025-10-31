// File: src/utils/redirect.ts
import * as WebBrowser from 'expo-web-browser';
WebBrowser.maybeCompleteAuthSession();

export function getRedirectTo() {
  // TEMP: force Expo proxy
  return 'https://auth.expo.io/@anonymous/loopcard-mobile';
}
