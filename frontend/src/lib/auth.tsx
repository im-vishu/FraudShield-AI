import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { apiFetch } from "@/lib/api";

export type Role = "ADMIN" | "ANALYST" | "USER";
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

interface AuthCtx {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (name: string, email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);
const KEY = "fs.auth";

type StoredAuth = { user: AuthUser; token: string };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredAuth;
        if (parsed?.user && parsed?.token) {
          setUser(parsed.user);
          setToken(parsed.token);
        }
      }
    } catch {
      // Ignore invalid/corrupt localStorage payloads.
    }
    setLoading(false);
  }, []);

  const persist = (next: StoredAuth) => {
    localStorage.setItem(KEY, JSON.stringify(next));
    setUser(next.user);
    setToken(next.token);
  };

  const login = async (email: string, password: string) => {
    const data = await apiFetch<{ user: AuthUser; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    persist(data);
    return data.user;
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await apiFetch<{ user: AuthUser; token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    persist(data);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem(KEY);
    setUser(null);
    setToken(null);
  };

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout }),
    [user, token, loading],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}

export function useAuthToken() {
  return useAuth().token;
}
