import { createContext } from "react";
import type { User } from "../store/authStore";

export interface AuthContextValue {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<User>;
  register: (
    email: string,
    username: string,
    password: string
  ) => Promise<User>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);
