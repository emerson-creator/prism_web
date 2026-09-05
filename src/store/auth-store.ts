import { create } from "zustand";
import * as api from "@/libs/api";
import { onSessionExpired } from "@/libs/api";
import type { LoginPayload, RegisterPayload, User } from "@/libs/types";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  /** True once we've checked localStorage on app load. */
  isHydrated: boolean;

  hydrate: () => void;
  login: (payload: LoginPayload) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  logout: () => Promise<void>;
  /** Syncs the in-memory + persisted user after a profile edit elsewhere. */
  updateUser: (user: User) => void;
}

function persistSession(accessToken: string, refreshToken: string, user: User) {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("user", JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isHydrated: false,

  /**
   * Reads the persisted user from localStorage on app start, so a page
   * refresh doesn't log the user out of the UI (the token itself is
   * still read fresh from localStorage on every API call in api.ts).
   */
  hydrate: () => {
    if (typeof window === "undefined") return;

    // Listen once for a forced session expiry (silent refresh failed
    // somewhere in api.ts) and clear the in-memory user to match.
    onSessionExpired(() => set({ user: null }));

    try {
      const raw = localStorage.getItem("user");
      const token = localStorage.getItem("accessToken");
      if (raw && token) {
        set({ user: JSON.parse(raw), isHydrated: true });
      } else {
        set({ isHydrated: true });
      }
    } catch {
      set({ isHydrated: true });
    }
  },

  login: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.login(payload);
      persistSession(res.accessToken, res.refreshToken, res.user);
      set({ user: res.user, isLoading: false });
      return true;
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Login failed",
        isLoading: false,
      });
      return false;
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.register(payload);
      persistSession(res.accessToken, res.refreshToken, res.user);
      set({ user: res.user, isLoading: false });
      return true;
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Registration failed",
        isLoading: false,
      });
      return false;
    }
  },

  logout: async () => {
    try {
      await api.logout();
    } catch {
      // Even if the server call fails, clear the local session.
    }
    clearSession();
    set({ user: null });
  },

  updateUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },
}));
