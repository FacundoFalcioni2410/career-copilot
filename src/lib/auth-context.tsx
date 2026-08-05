"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { login as apiLogin } from "@/lib/api";
import { clearStoredToken, getStoredToken, setStoredToken } from "@/lib/auth";

type AuthContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // localStorage is only readable client-side; this is a one-time read on
    // mount to sync React state with it, not derived state from a render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToken(getStoredToken());
    setIsLoading(false);
  }, []);

  async function login(email: string, password: string) {
    const { access_token } = await apiLogin(email, password);
    setStoredToken(access_token);
    setToken(access_token);
  }

  function logout() {
    clearStoredToken();
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!token, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
