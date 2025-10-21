import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import axiosInstance from "../lib/axios";
import { AuthContext } from "./auth";

interface User {
  id: string;
  email: string;
  username: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

const AUTH_STORAGE_KEY = "auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
  });

  const persistAuth = (user: User, token: string) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, token }));
    setState({ user, token });
  };

  const clearAuth = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setState({ user: null, token: null });
  };

  const login = async (email: string, password: string): Promise<User> => {
    const { data } = await axiosInstance.post("/auth/login", {
      email,
      password,
    });
    persistAuth(data.user, data.token);
    return data.user;
  };

  const register = async (
    email: string,
    username: string,
    password: string
  ): Promise<User> => {
    const { data } = await axiosInstance.post("/auth/register", {
      email,
      username,
      password,
    });
    persistAuth(data.user, data.token);
    return data.user;
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      void error;
    }
    clearAuth();
  };

  const hydrate = async () => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return;

    try {
      const { user, token } = JSON.parse(stored);
      setState({ user, token });

      const { data } = await axiosInstance.get("/auth/me");
      setState({ user: data.user, token });
    } catch (error) {
      void error;
      clearAuth();
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return;

    const loadAuth = async () => {
      try {
        const { user, token } = JSON.parse(stored);
        setState({ user, token });

        const { data } = await axiosInstance.get("/auth/me");
        setState({ user: data.user, token });
      } catch (error) {
        void error;
        clearAuth();
      }
    };

    loadAuth();

    const handleUnauthorized = () => {
      clearAuth();
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () =>
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...state, login, register, logout, hydrate }}
    >
      {children}
    </AuthContext.Provider>
  );
}
