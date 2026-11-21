import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ROUTES } from '../../../app/navigation/routes';
import type { AuthScreenProps } from '../../../app/navigation/types';
import { useAppDispatch } from '../../../app/hooks';
import { AppText } from '../../../shared/components/AppText';
import { Button } from '../../../shared/components/Button';
import { Screen } from '../../../shared/components/Screen';
import { spacing } from '../../../theme';
import { LoginForm } from '../components/LoginForm';
import { signedIn } from '../authSlice';

const styles = StyleSheet.create({
  content: { paddingVertical: spacing.xl },
  heading: { marginBottom: spacing.xl },
  footer: { marginTop: spacing.lg },
});

export const LoginScreen = ({
  navigation,
}: AuthScreenProps<typeof ROUTES.Login>) => {
  const dispatch = useAppDispatch();

  // Placeholder: the DummyJSON login call replaces this in the next auth commit.
  const handleLogin = (values: { username: string }) => {
    dispatch(
      signedIn({
        id: 0,
        username: values.username,
        firstName: values.username,
      }),
    );
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
