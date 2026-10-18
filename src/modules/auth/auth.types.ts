export type RegisterInput = {
  name: string;
  email: string;
  password?: string;
};

export type LoginInput = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type GoogleAuthInput = {
  idToken: string;
};

export type ResetPasswordInput = {
  token: string;
  newPassword: string;
};

export type ForgotPasswordInput = {
  email: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export type AuthUserWithPassword = AuthUser & {
  password: string | null;
  googleId: string | null;
};

export type AuthResult = {
  user: AuthUser;
  token: string;
};

export type LoginResult = AuthResult & {
  rememberMe: boolean;
};

export type CreateUserData = {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  avatarUrl?: string | null;
};

export type PasswordResetTokenData = {
  userId: string;
  token: string;
  expiresAt: Date;
};