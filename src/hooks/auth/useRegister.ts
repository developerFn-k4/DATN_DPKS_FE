import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { getMeApi, loginApi, registerApi } from "../../services/auth/auth";
import type { AuthData, LoginRequest, MeResponse, RegisterRequest, User } from "../../types/auth/auth";

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = useCallback(async (payload: RegisterRequest) => {
    setLoading(true);
    setError(null);

    try {
      const res = await registerApi(payload);
      const token =
        res.accessToken ??
        res.token ??
        (res as any)?.payload?.accessToken ??
        (res as any)?.payload?.token;

      const user =
        res.user ??
        (res as any)?.payload?.user;

      if (token) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...(user ? { user } : {}),
            accessToken: token,
          })
        );
      }

      return res;
    } catch (e: unknown) {
      let msg = "Đăng ký thất bại";

      if (axios.isAxiosError(e)) {
        const data: any = e.response?.data;

        if (data?.errors) {
          const firstError = Object.values(data.errors)[0];
          if (Array.isArray(firstError)) {
            msg = firstError[0];
          }
        } else {
          msg = data?.message || data?.error || e.message || msg;
        }
      }

      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { register, loading, error };
}

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (payload: LoginRequest) => {
    setLoading(true);
    setError(null);

    try {
      const res = await loginApi(payload);

      // xử lý lỗi trả về từ backend
      if (!res.success) {
        setError(res.message || "Đăng nhập thất bại");
        return null;
      }

      const token =
        res.accessToken ??
        res.token ??
        (res as any)?.payload?.accessToken ??
        (res as any)?.payload?.token;

      const user =
        res.user ??
        (res as any)?.payload?.user;

      if (token) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...(user ? { user } : {}),
            accessToken: token,
          })
        );
      }

      return res;
    } catch (e: unknown) {
      let msg = "Đăng nhập thất bại";

      if (axios.isAxiosError(e)) {
        const data: any = e.response?.data;
        msg = data?.message || data?.error || e.message || msg;
      }

      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { login, loading, error };
}

export function useAuth() {
  const [auth, setAuth] = useState<AuthData | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (data) {
      setAuth(JSON.parse(data));
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    setAuth(null);
    window.location.href = "/";
  }, []);

  return {
    user: auth?.user,
    token: auth?.accessToken,
    isLogin: !!auth?.accessToken,
    logout,
  };
}

export function useMe() {
  const [user, setUser] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchMe = async () => {
    try {
      setLoading(true);

      const res = await getMeApi();

      if (res.success) {
        setUser(res.data);
      }
    } catch (error) {
      console.error("Fetch me error", error);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, fetchMe };
}