import { loginSchema, registerSchema } from './schemas';

const validRegister = {
  firstName: 'Emily',
  lastName: 'Johnson',
  username: 'emilys',
  email: 'emily@example.com',
  password: 'secret1',
  confirmPassword: 'secret1',
};

/** Returns the error message for one field, or undefined if it is valid. */
const errorFor = (
  result: {
    success: boolean;
    error?: { issues: { path: PropertyKey[]; message: string }[] };
  },
  field: string,
) => result.error?.issues.find(i => i.path[0] === field)?.message;

describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    expect(
      loginSchema.safeParse({ username: 'emilys', password: 'emilyspass' })
        .success,
    ).toBe(true);
  });

  it('rejects a username shorter than 3 characters', () => {
    const result = loginSchema.safeParse({
      username: 'em',
      password: 'secret1',
    });
    expect(result.success).toBe(false);
    expect(errorFor(result, 'username')).toMatch(/at least 3/);
  });

  it('rejects a password shorter than 6 characters', () => {
    const result = loginSchema.safeParse({
      username: 'emilys',
      password: '12345',
    });
    expect(result.success).toBe(false);
    expect(errorFor(result, 'password')).toMatch(/at least 6/);
  });

  it('trims whitespace before checking the username length', () => {
    const result = loginSchema.safeParse({
      username: '  em  ',
      password: 'secret1',
    });
    expect(result.success).toBe(false);
  });
});

describe('registerSchema', () => {
  it('accepts a fully valid form', () => {
    expect(registerSchema.safeParse(validRegister).success).toBe(true);
  });

  it('requires first and last names', () => {
    const result = registerSchema.safeParse({
      ...validRegister,
      firstName: '  ',
      lastName: '',
    });
    expect(errorFor(result, 'firstName')).toBe('First name is required');
    expect(errorFor(result, 'lastName')).toBe('Last name is required');
  });

  it('rejects an invalid email', () => {
    const result = registerSchema.safeParse({
      ...validRegister,
      email: 'not-an-email',
    });
    expect(errorFor(result, 'email')).toBe('Enter a valid email address');
  });

  it('reports a mismatch on the confirmPassword field', () => {
    const result = registerSchema.safeParse({
      ...validRegister,
      confirmPassword: 'different',
    });
    expect(result.success).toBe(false);
    expect(errorFor(result, 'confirmPassword')).toBe('Passwords do not match');
  });
});
