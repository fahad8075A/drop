"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";
import { User, Store, Subscription } from "../types";

interface AuthContextType {
  user: User | null;
  subscription: Subscription | null;
  stores: Store[];
  activeStore: Store | null;
  setActiveStore: (store: Store) => void;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [activeStore, setActiveStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const data = await api.get<{ user: User; stores: Store[]; subscription: Subscription | null }>("/auth/me");
      setUser(data.user);
      setStores(data.stores);
      setSubscription(data.subscription || null);
      if (data.stores.length > 0) {
        // Keep activeStore if still valid, or default to first
        setActiveStore((prev) => (prev ? data.stores.find((s) => s.id === prev.id) || data.stores[0] : data.stores[0]));
      }
    } catch {
      if (typeof window !== "undefined") {
        localStorage.removeItem("droppilot_token");
      }
      setUser(null);
      setSubscription(null);
      setStores([]);
      setActiveStore(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await api.post<{ user: User; token: string }>("/auth/login", { email, password });
      if (typeof window !== "undefined") {
        localStorage.setItem("droppilot_token", data.token);
      }
      setUser(data.user);
      await refreshUser();
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await api.post<{ user: User; token: string }>("/auth/register", { name, email, password });
      if (typeof window !== "undefined") {
        localStorage.setItem("droppilot_token", data.token);
      }
      setUser(data.user);
      await refreshUser();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    if (typeof window !== "undefined") {
      localStorage.removeItem("droppilot_token");
    }
    setUser(null);
    setStores([]);
    setActiveStore(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        subscription,
        stores,
        activeStore,
        setActiveStore,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
