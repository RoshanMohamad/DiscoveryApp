import React from 'react';
import { Button } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { AppText } from '../../../shared/components/AppText';
import { Screen } from '../../../shared/components/Screen';
import { signedOut } from '../../auth/authSlice';

/** Placeholder: real logout (Keychain + cache reset) comes later. */
export const ProfileScreen = () => {
  const dispatch = useAppDispatch();
  const firstName = useAppSelector(s => s.auth.user?.firstName);
  return (
    <Screen>
      <AppText variant="title">Profile</AppText>
      <AppText>{firstName}</AppText>
      <Button title="Log out" onPress={() => dispatch(signedOut())} />
    </Screen>
  );
};
