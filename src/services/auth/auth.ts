import instance from "../../core/api";
import type { RegisterRequest, RegisterResponse } from "../../types/auth/auth";

export async function registerApi(payload: RegisterRequest): Promise<RegisterResponse> {
    const { data } = await instance.post<RegisterResponse>("/auth/register", payload);
    return data;
}