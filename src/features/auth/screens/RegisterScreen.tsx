import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ROUTES } from '../../../app/navigation/routes';
import type { AuthScreenProps } from '../../../app/navigation/types';
import { AppText } from '../../../shared/components/AppText';
import { Banner } from '../../../shared/components/Banner';
import { Button } from '../../../shared/components/Button';
import { Screen } from '../../../shared/components/Screen';
import { getErrorMessage } from '../../../shared/utils/errors';
import { spacing } from '../../../theme';
import { useRegisterMutation } from '../authApi';
import { RegisterForm } from '../components/RegisterForm';
import type { RegisterValues } from '../schemas';

const styles = StyleSheet.create({
  content: { paddingVertical: spacing.xl },
  heading: { marginBottom: spacing.xl },
  footer: { marginTop: spacing.lg },
});

export const RegisterScreen = ({
  navigation,
}: AuthScreenProps<typeof ROUTES.Register>) => {
  const [register] = useRegisterMutation();
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async ({
    confirmPassword: _confirm,
    ...body
  }: RegisterValues) => {
    setError(null);
    try {
      await register(body).unwrap();
      // DummyJSON can't really log this user in, so send them to Login.
      navigation.navigate(ROUTES.Login, { registered: true });
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <AppText variant="title" style={styles.heading}>
          Create account
        </AppText>
        {error ? <Banner kind="error" message={error} /> : null}
        <RegisterForm onSubmit={handleRegister} />
        <View style={styles.footer}>
          <Button
            variant="secondary"
            title="I already have an account"
            onPress={() => navigation.goBack()}
          />
        </View>
      </ScrollView>
    </Screen>
  );
};
