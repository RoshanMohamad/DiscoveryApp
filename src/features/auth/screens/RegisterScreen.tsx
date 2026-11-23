import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ROUTES } from '../../../app/navigation/routes';
import type { AuthScreenProps } from '../../../app/navigation/types';
import { images } from '../../../assets/images';
import { Banner } from '../../../shared/components/Banner';
import { HeroBackground } from '../../../shared/components/HeroBackground';
import { getErrorMessage } from '../../../shared/utils/errors';
import { useTheme, type Theme } from '../../../theme';
import { useRegisterMutation } from '../authApi';
import { AuthHero } from '../components/AuthHero';
import { RegisterForm } from '../components/RegisterForm';
import type { RegisterValues } from '../schemas';

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    background: { flex: 1 },
    content: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
    },
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
    <HeroBackground source={images.night} scrim style={styles.background}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AuthHero
          title="Create Account"
          subtitle="It's just a simulation."
          onBack={() => navigation.goBack()}
        />
        <View style={styles.content}>
          {error ? <Banner kind="error" message={error} /> : null}
          <RegisterForm onSubmit={handleRegister} />
        </View>
      </ScrollView>
    </HeroBackground>
  );
};
