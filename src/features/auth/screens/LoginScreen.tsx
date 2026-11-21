import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ROUTES } from '../../../app/navigation/routes';
import type { AuthScreenProps } from '../../../app/navigation/types';
import { useAppDispatch } from '../../../app/hooks';
import { AppText } from '../../../shared/components/AppText';
import { Banner } from '../../../shared/components/Banner';
import { Button } from '../../../shared/components/Button';
import { Screen } from '../../../shared/components/Screen';
import { spacing } from '../../../theme';
import { LoginForm } from '../components/LoginForm';
import { signIn } from '../authThunks';
import type { LoginValues } from '../schemas';

const styles = StyleSheet.create({
  content: { paddingVertical: spacing.xl },
  heading: { marginBottom: spacing.xl },
  footer: { marginTop: spacing.lg },
});

export const LoginScreen = ({
  navigation,
  route,
}: AuthScreenProps<typeof ROUTES.Login>) => {
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (values: LoginValues) => {
    setError(null);
    const result = await dispatch(signIn(values));
    if (signIn.rejected.match(result)) {
      setError(result.payload ?? 'Login failed. Please try again.');
    }
    // On success the root navigator swaps to the app tabs by itself.
  };

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <AppText variant="title" style={styles.heading}>
          Welcome to Passport
        </AppText>
        {route.params?.registered ? (
          <Banner
            kind="success"
            message="Account created! Log in to continue."
          />
        ) : null}
        {error ? <Banner kind="error" message={error} /> : null}
        <LoginForm onSubmit={handleLogin} />
        <View style={styles.footer}>
          <Button
            variant="secondary"
            title="Create an account"
            onPress={() => navigation.navigate(ROUTES.Register)}
          />
        </View>
      </ScrollView>
    </Screen>
  );
};
