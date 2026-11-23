import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import { ROUTES } from '../../../app/navigation/routes';
import type { AuthScreenProps } from '../../../app/navigation/types';
import { AppText } from '../../../shared/components/AppText';
import { Banner } from '../../../shared/components/Banner';
import { Button } from '../../../shared/components/Button';
import { Screen } from '../../../shared/components/Screen';
import { getErrorMessage } from '../../../shared/utils/errors';
import { useTheme, type Theme } from '../../../theme';
import { useRegisterMutation } from '../authApi';
import { RegisterForm } from '../components/RegisterForm';
import type { RegisterValues } from '../schemas';

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    content: { paddingBottom: theme.spacing.xl },
    back: {
      width: theme.minTouchSize,
      height: theme.minTouchSize,
      justifyContent: 'center',
      marginLeft: -theme.spacing.sm,
    },
    heading: { marginTop: theme.spacing.sm },
    subtitle: { marginBottom: theme.spacing.xl },
    footer: { marginTop: theme.spacing.lg },
  });

export const RegisterScreen = ({
  navigation,
}: AuthScreenProps<typeof ROUTES.Register>) => {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
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
    <Screen safeTop>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => navigation.goBack()}
          style={styles.back}
        >
          <Feather
            name="arrow-left"
            size={theme.iconSize.lg}
            color={theme.colors.text}
          />
        </Pressable>
        <AppText variant="title" style={styles.heading}>
          Create Account
        </AppText>
        <AppText muted style={styles.subtitle}>
          It's just a simulation.
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
