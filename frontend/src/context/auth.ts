import { createContext } from "react";

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

export interface AuthContextValue extends AuthState {
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
