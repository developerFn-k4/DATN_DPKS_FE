export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export type RegisterResponse = {
  success?: boolean;
  message?: string;
  user?: User;
  token?: string;
  accessToken?: string;
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
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    date_of_birth: string | null;
    avatar: string | null;
    role: string;
    status: string;
  };
};

export type User = {
  id?: number;
  name?: string;
  email?: string;
  phone?: string | null;
  address?: string | null;
  date_of_birth?: string | null;
  avatar?: string | null;
  role?: string;
  status?: string;
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