export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export type RegisterResponse = {
  message?: string;
  user?: {
    id?: number;
    name?: string;
    email?: string;
    [k: string]: any;
  };
  accessToken?: string;
  token?: string;
  tokenType?: string;
  [k: string]: any;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  success: boolean;
  message?: string;
  accessToken?: string;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
};

export type User = {
  name?: string;
  email?: string;
};

export type AuthData = {
  user?: User;
  accessToken?: string;
};

export type MeResponse = {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}