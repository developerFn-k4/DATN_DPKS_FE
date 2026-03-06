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