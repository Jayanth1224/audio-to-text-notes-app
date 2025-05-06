import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { Platform } from 'react-native';
import { ThemeProvider } from '@/context/ThemeContext';
import * as Linking from 'expo-linking';

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': require('@expo-google-fonts/inter/Inter_400Regular.ttf'),
    'Inter-Medium': require('@expo-google-fonts/inter/Inter_500Medium.ttf'),
    'Inter-SemiBold': require('@expo-google-fonts/inter/Inter_600SemiBold.ttf'),
    'Inter-Bold': require('@expo-google-fonts/inter/Inter_700Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen after fonts have loaded (or an error was encountered)
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    // Handle deep links
    const subscription = Linking.addEventListener('url', (event) => {
      const { url } = event;
      // Handle the shared content URL
      console.log('Received URL:', url);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Fonts not loaded and no error? Return null to keep splash screen
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider>
      <React.Fragment>
        <Stack screenOptions={{ 
          headerShown: false,
          animation: Platform.OS === 'ios' ? 'default' : 'fade_from_bottom',
        }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
        </Stack>
        <StatusBar style="light" />
      </React.Fragment>
    </ThemeProvider>
  );
}