import { z } from 'zod';

export const MIN_USERNAME_LENGTH = 3;
export const MIN_PASSWORD_LENGTH = 6;

const username = z
  .string()
  .trim()
  .min(
    MIN_USERNAME_LENGTH,
    `Username must be at least ${MIN_USERNAME_LENGTH} characters`,
  );

const password = z
  .string()
  .min(
    MIN_PASSWORD_LENGTH,
    `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
  );

export const loginSchema = z.object({ username, password });

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(1, 'First name is required'),
    lastName: z.string().trim().min(1, 'Last name is required'),
    username,
    email: z.string().trim().pipe(z.email('Enter a valid email address')),
    password,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  // Cross-field rule: attach the error to confirmPassword so it shows under that field.
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
