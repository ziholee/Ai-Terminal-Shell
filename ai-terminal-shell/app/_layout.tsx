import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import {
  FiraCode_400Regular,
  FiraCode_700Bold
} from '@expo-google-fonts/fira-code';
import {
  SourceCodePro_400Regular,
  SourceCodePro_700Bold
} from '@expo-google-fonts/source-code-pro';
import * as SplashScreen from 'expo-splash-screen';
import { LanguageProvider } from '@/contexts/LanguageContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'FiraCode-Regular': FiraCode_400Regular,
    'FiraCode-Bold': FiraCode_700Bold,
    'SourceCodePro-Regular': SourceCodePro_400Regular,
    'SourceCodePro-Bold': SourceCodePro_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <LanguageProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" backgroundColor="#000" />
    </LanguageProvider>
  );
}