import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  userId: string;
  id: string;
  email: string;
  username: string;
  accountType: "Follower" | "Creator" | "Admin";
  role?: string;
  healthConditions?: Record<string, string>;
  weeklyBudgetCents?: number;
  pantry?: PantryItem[];
}

export interface PantryItem {
  sourceId: string;
  name: string;
  calories: number;
  allergenType: string[];
  sourceVersion: number;
  count: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAuth: () => void;
  hydrateAuth: (user: User, token: string) => void;
}

export type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set: (state: Partial<AuthStore>) => void) => ({
      ...initialState,
      setUser: (user: User | null) => set({ user }),
      setToken: (token: string | null) => set({ token }),
      setLoading: (isLoading: boolean) => set({ isLoading }),
      setError: (error: string | null) => set({ error }),
      clearAuth: () => set(initialState),
      hydrateAuth: (user: User, token: string) =>
        set({ user, token, error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state: AuthStore) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);

export function useAuthStoreState(): Omit<AuthStore, keyof AuthActions> {
  const { user, token, isLoading, error } = useAuthStore();
  return { user, token, isLoading, error };
}
