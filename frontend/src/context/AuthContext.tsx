import { useEffect } from "react";
import type { ReactNode } from "react";
import axiosInstance from "../lib/axios";
import { AuthContext } from "./auth";
import { useAuthStore, type User } from "../store/authStore";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, token, setUser, setToken, setLoading, setError, clearAuth } =
    useAuthStore();

  const persistAuth = (newUser: User, newToken: string) => {
    setUser(newUser);
    setToken(newToken);
    setError(null);
  };

  const login = async (email: string, password: string): Promise<User> => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.post("/api/users/login", {
        email,
        password,
      });
      const newUser: User = {
        userId: data.user.userId || data.user.id,
        id: data.user.userId || data.user.id,
        email: data.user.email,
        username: data.user.username,
        accountType: data.user.accountType,
        role: data.user.accountType,
        healthConditions: data.user.healthConditions,
        weeklyBudgetCents: data.user.weeklyBudgetCents,
        pantry: data.user.pantry,
      };
      persistAuth(newUser, data.token);
      return newUser;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    username: string,
    password: string
  ): Promise<User> => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.post("/api/users/signup", {
        email,
        username,
        password,
      });
      const newUser: User = {
        userId: data.user.userId || data.user.id,
        id: data.user.userId || data.user.id,
        email: data.user.email,
        username: data.user.username,
        accountType: data.user.accountType,
        role: data.user.accountType,
        healthConditions: data.user.healthConditions,
        weeklyBudgetCents: data.user.weeklyBudgetCents,
        pantry: data.user.pantry,
      };
      persistAuth(newUser, data.token);
      return newUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    clearAuth();
  };

  const hydrate = async () => {
    if (!token || !user) return;
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(
        "/api/users/profile/" + user.username
      );
      const newUser: User = {
        userId: data.userId || data.id,
        id: data.userId || data.id,
        email: data.email,
        username: data.username,
        accountType: data.accountType,
        role: data.accountType,
        healthConditions: data.healthConditions,
        weeklyBudgetCents: data.weeklyBudgetCents,
        pantry: data.pantry,
      };
      setUser(newUser);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to hydrate auth"
      );
      clearAuth();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && user) {
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    } else {
      delete axiosInstance.defaults.headers.common["Authorization"];
    }
  }, [token, user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        hydrate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
