import React from 'react';
import { Controller, useForm, type Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { TextInputProps } from 'react-native';
import { Button } from '../../../shared/components/Button';
import { TextField } from '../../../shared/components/TextField';
import { registerSchema, type RegisterValues } from '../schemas';

type Props = {
  onSubmit: (values: RegisterValues) => void | Promise<void>;
};

type FieldConfig = {
  name: Path<RegisterValues>;
  label: string;
  inputProps?: TextInputProps;
};

// Declarative field list keeps the form short and every field consistent.
const FIELDS: FieldConfig[] = [
  {
    name: 'firstName',
    label: 'First name',
    inputProps: { textContentType: 'givenName' },
  },
  {
    name: 'lastName',
    label: 'Last name',
    inputProps: { textContentType: 'familyName' },
  },
  {
    name: 'username',
    label: 'Username',
    inputProps: { autoCapitalize: 'none', autoCorrect: false },
  },
  {
    name: 'email',
    label: 'Email',
    inputProps: {
      autoCapitalize: 'none',
      autoCorrect: false,
      keyboardType: 'email-address',
      textContentType: 'emailAddress',
    },
  },
  {
    name: 'password',
    label: 'Password',
    inputProps: { secureTextEntry: true, autoCapitalize: 'none' },
  },
  {
    name: 'confirmPassword',
    label: 'Confirm password',
    inputProps: { secureTextEntry: true, autoCapitalize: 'none' },
  },
];

export const RegisterForm = ({ onSubmit }: Props) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  return (
    <>
      {FIELDS.map(({ name, label, inputProps }) => (
        <Controller
          key={name}
          control={control}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              {...inputProps}
              label={label}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors[name]?.message}
            />
          )}
        />
      ))}
      <Button
        title="Create account"
        loading={isSubmitting}
        onPress={handleSubmit(onSubmit)}
      />
    </>
  );
};
