"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  AuthApiErrorPayload,
  AuthUser,
  LoginInput,
  RegisterInput,
} from "./types";

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

export class AuthApiError extends Error {
  code?: string;
  fields?: Record<string, string[]>;
  status: number;

  constructor(
    message: string,
    status: number,
    payload?: AuthApiErrorPayload,
  ) {
    super(message);
    this.name = "AuthApiError";
    this.code = payload?.code;
    this.fields = payload?.fields;
    this.status = status;
  }
}

async function requestAuth<T>(path: string, init?: RequestInit) {
  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "content-type": "application/json",
      ...init?.headers,
    },
  });
  const payload = (await response.json().catch(() => null)) as
    | (T & AuthApiErrorPayload)
    | AuthApiErrorPayload
    | null;

  if (!response.ok) {
    throw new AuthApiError(
      payload?.error ?? "Authentication request failed.",
      response.status,
      payload ?? undefined,
    );
  }

  return payload as T;
}

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  user: AuthUser | null;
  status: AuthStatus;
  login: (input: LoginInput) => Promise<AuthUser>;
  register: (input: RegisterInput) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<AuthUser | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const refreshUser = useCallback(async () => {
    try {
      const payload = await requestAuth<{ user: AuthUser }>(
        "/api/auth/me",
      );
      setUser(payload.user);
      setStatus("authenticated");
      return payload.user;
    } catch (error) {
      setUser(null);
      setStatus("unauthenticated");

      if (error instanceof AuthApiError && error.status === 401) {
        return null;
      }

      return null;
    }
  }, []);

  useEffect(() => {
    let isCancelled = false;

    requestAuth<{ user: AuthUser }>("/api/auth/me")
      .then((payload) => {
        if (!isCancelled) {
          setUser(payload.user);
          setStatus("authenticated");
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setUser(null);
          setStatus("unauthenticated");
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    const payload = await requestAuth<{ user: AuthUser }>(
      "/api/auth/login",
      {
        method: "POST",
        body: JSON.stringify(input),
      },
    );
    setUser(payload.user);
    setStatus("authenticated");
    return payload.user;
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const payload = await requestAuth<{ user: AuthUser }>(
      "/api/auth/register",
      {
        method: "POST",
        body: JSON.stringify(input),
      },
    );
    setUser(payload.user);
    setStatus("authenticated");
    return payload.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await requestAuth<never>("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      login,
      register,
      logout,
      refreshUser,
    }),
    [login, logout, refreshUser, register, status, user],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}
