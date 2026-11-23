import React, { useEffect, useMemo } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { persistor, store } from './src/app/store';
import { useAppDispatch, useAppSelector } from './src/app/hooks';
import { createLinking } from './src/app/navigation/linking';
import { RootNavigator } from './src/app/navigation/RootNavigator';
import {
  selectIsAuthenticated,
  selectIsRestoring,
} from './src/features/auth/authSlice';
import { restoreSession } from './src/features/auth/authThunks';
import { pendingLinkStored } from './src/features/share/pendingLinkSlice';
import { LoadingView } from './src/shared/components/LoadingView';
import { useTheme } from './src/theme';

const styles = StyleSheet.create({ splash: { flex: 1 } });

const AppContent = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const isRestoring = useAppSelector(selectIsRestoring);

  // Launch: restore the session from the Keychain token.
  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  // Reads the store lazily so the gate always sees the current auth state.
  const linking = useMemo(
    () =>
      createLinking({
        isAuthenticated: () => selectIsAuthenticated(store.getState()),
        onPendingCode: code => dispatch(pendingLinkStored(code)),
      }),
    [dispatch],
  );

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

  // Mount navigation only after the session check, so a cold-start link is
  // evaluated with the real auth state (logged in -> open it, else store it).
  if (isRestoring) {
    return (
      <View
        style={[styles.splash, { backgroundColor: theme.colors.background }]}
      >
        <LoadingView />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme} linking={linking}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
      <RootNavigator />
    </NavigationContainer>
  );
};

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </PersistGate>
  </Provider>
);

export default App;
