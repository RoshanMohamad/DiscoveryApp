import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { ROUTES } from '../../../app/navigation/routes';
import type { AuthScreenProps } from '../../../app/navigation/types';
import { useAppDispatch } from '../../../app/hooks';
import { AppText } from '../../../shared/components/AppText';
import { Banner } from '../../../shared/components/Banner';
import { Button } from '../../../shared/components/Button';
import { GoogleIcon } from '../../../shared/components/GoogleIcon';
import { Screen } from '../../../shared/components/Screen';
import { showNotAvailable } from '../../../shared/utils/notAvailable';
import { useTheme, type Theme } from '../../../theme';
import { AuthHero } from '../components/AuthHero';
import { LoginForm } from '../components/LoginForm';
import { signIn } from '../authThunks';
import type { LoginValues } from '../schemas';

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: { padding: 0 },
    content: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: theme.spacing.lg,
    },
    line: {
      flex: 1,
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.colors.border,
    },
    dividerText: { marginHorizontal: theme.spacing.md },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: theme.spacing.lg,
    },
    link: {
      minHeight: theme.minTouchSize,
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.xs,
    },
  });

export const LoginScreen = ({
  navigation,
  route,
}: AuthScreenProps<typeof ROUTES.Login>) => {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);
  const justRegistered = route.params?.registered;

  // Login stays mounted under Register, so a stale error from an earlier
  // attempt would otherwise sit next to the success message.
  useEffect(() => {
    if (justRegistered) {
      setError(null);
    }
  }, [justRegistered]);

  const handleLogin = async (values: LoginValues) => {
    setError(null);
    const result = await dispatch(signIn(values));
    if (signIn.rejected.match(result)) {
      setError(result.payload ?? 'Login failed. Please try again.');
    }
    // On success the root navigator swaps to the app tabs by itself.
  };

  return (
    <Screen style={styles.screen}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AuthHero
          title="Welcome Back 👋"
          subtitle="Log in to continue your journey"
        />
        <View style={styles.content}>
          {justRegistered && !error ? (
            <Banner
              kind="success"
              message="Account created! Log in to continue."
            />
          ) : null}
          {error ? <Banner kind="error" message={error} /> : null}
          <LoginForm
            onSubmit={handleLogin}
            onForgotPassword={() => showNotAvailable('Password reset')}
          />
          <View style={styles.divider}>
            <View style={styles.line} />
            <AppText variant="caption" muted style={styles.dividerText}>
              or
            </AppText>
            <View style={styles.line} />
          </View>
          <Button
            variant="secondary"
            leading={<GoogleIcon />}
            title="Continue with Google"
            onPress={() => showNotAvailable('Google sign-in')}
          />
          <View style={styles.footer}>
            <AppText variant="caption" muted>
              Don't have an account?
            </AppText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Create an account"
              onPress={() => navigation.navigate(ROUTES.Register)}
              style={styles.link}
            >
              <AppText variant="label" style={{ color: theme.colors.primary }}>
                Create one
              </AppText>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
};
