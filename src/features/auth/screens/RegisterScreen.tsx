import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ROUTES } from '../../../app/navigation/routes';
import type { AuthScreenProps } from '../../../app/navigation/types';
import { AppText } from '../../../shared/components/AppText';
import { Button } from '../../../shared/components/Button';
import { Screen } from '../../../shared/components/Screen';
import { spacing } from '../../../theme';
import { RegisterForm } from '../components/RegisterForm';

const styles = StyleSheet.create({
  content: { paddingVertical: spacing.xl },
  heading: { marginBottom: spacing.xl },
  footer: { marginTop: spacing.lg },
});

export const RegisterScreen = ({
  navigation,
}: AuthScreenProps<typeof ROUTES.Register>) => {
  // Placeholder: the DummyJSON /users/add call + success message come next.
  const handleRegister = () => {
    navigation.navigate(ROUTES.Login);
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
