import React, { useMemo } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/app/store';
import { RootNavigator } from './src/app/navigation/RootNavigator';
import { useTheme } from './src/theme';

const AppContent = () => {
  const theme = useTheme();
  const navTheme = useMemo(
    () => ({
      ...DefaultTheme,
      dark: theme.isDark,
      colors: {
        ...DefaultTheme.colors,
        primary: theme.colors.primary,
        background: theme.colors.background,
        card: theme.colors.surface,
        text: theme.colors.text,
        border: theme.colors.border,
      },
    }),
    [theme],
  );
  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
      <RootNavigator />
    </NavigationContainer>
  );
};

const App = () => (
  <Provider store={store}>
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  </Provider>
);

export default App;
