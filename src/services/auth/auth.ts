import instance from "../../core/api";
import type { LoginRequest, LoginResponse, MeResponse, RegisterRequest, RegisterResponse } from "../../types/auth/auth";

export async function registerApi(payload: RegisterRequest): Promise<RegisterResponse> {
    const { data } = await instance.post<RegisterResponse>("/auth/register", payload);
    return data;
}

export async function loginApi(payload: LoginRequest): Promise<LoginResponse> {
  const { data } = await instance.post<LoginResponse>(
    "/auth/login",
    payload
  );
  return data;
}

export async function getMeApi(): Promise<MeResponse> {
  const { data } = await instance.get("/auth/me");
  return data;
}