import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AuthResponse, User } from "@/libs/types";

const { loginMock, registerMock, logoutMock, sessionExpiredMock } =
  vi.hoisted(() => ({
    loginMock: vi.fn(),
    registerMock: vi.fn(),
    logoutMock: vi.fn(),
    sessionExpiredMock: vi.fn(),
  }));

vi.mock("@/libs/api", () => ({
  login: loginMock,
  register: registerMock,
  logout: logoutMock,
  onSessionExpired: sessionExpiredMock,
}));

import { useAuthStore } from "./auth-store";

const user: User = {
  id: "user-1",
  email: "user@example.com",
  name: "Test",
  lastName: "User",
  Role: "USER",
};

const authResponse: AuthResponse = {
  accessToken: "access-token",
  refreshToken: "refresh-token",
  user,
};

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();

  useAuthStore.setState({
    user: null,
    isLoading: false,
    error: null,
    isHydrated: false,
  });

  loginMock.mockResolvedValue(authResponse);
  registerMock.mockResolvedValue(authResponse);
  logoutMock.mockResolvedValue(undefined);
  sessionExpiredMock.mockReturnValue(vi.fn());
});

describe("auth-store", () => {
  it("starts with an empty, unhydrated session", () => {
    const state = useAuthStore.getState();

    expect(state.user).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.isHydrated).toBe(false);
  });

  it("hydrates the user from localStorage when tokens exist", () => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("accessToken", "access-token");

    useAuthStore.getState().hydrate();

    expect(useAuthStore.getState().user).toEqual(user);
    expect(useAuthStore.getState().isHydrated).toBe(true);
    expect(sessionExpiredMock).toHaveBeenCalledOnce();
  });

  it("marks the store as hydrated when no session exists", () => {
    useAuthStore.getState().hydrate();

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isHydrated).toBe(true);
  });

  it("handles invalid persisted user data", () => {
    localStorage.setItem("user", "{invalid-json");
    localStorage.setItem("accessToken", "access-token");

    useAuthStore.getState().hydrate();

    expect(useAuthStore.getState().isHydrated).toBe(true);
    expect(useAuthStore.getState().user).toBeNull();
  });

  it("logs in and persists the session on success", async () => {
    const result = await useAuthStore.getState().login({
      email: user.email,
      password: "Password123!",
    });

    expect(result).toBe(true);
    expect(loginMock).toHaveBeenCalledWith({
      email: user.email,
      password: "Password123!",
    });
    expect(useAuthStore.getState().user).toEqual(user);
    expect(useAuthStore.getState().isLoading).toBe(false);
    expect(useAuthStore.getState().error).toBeNull();
    expect(localStorage.getItem("accessToken")).toBe("access-token");
    expect(localStorage.getItem("refreshToken")).toBe("refresh-token");
    expect(localStorage.getItem("user")).toBe(JSON.stringify(user));
  });

  it("stores the login error when login fails", async () => {
    loginMock.mockRejectedValue(new Error("Invalid credentials"));

    const result = await useAuthStore.getState().login({
      email: user.email,
      password: "wrong-password",
    });

    expect(result).toBe(false);
    expect(useAuthStore.getState().error).toBe("Invalid credentials");
    expect(useAuthStore.getState().isLoading).toBe(false);
  });

  it("uses a fallback message for non-Error login failures", async () => {
    loginMock.mockRejectedValue("unexpected");

    const result = await useAuthStore.getState().login({
      email: user.email,
      password: "password",
    });

    expect(result).toBe(false);
    expect(useAuthStore.getState().error).toBe("Login failed");
  });

  it("registers and persists the session on success", async () => {
    const payload = {
      email: user.email,
      password: "Password123!",
      name: "Test",
      lastName: "User",
    };

    const result = await useAuthStore.getState().register(payload);

    expect(result).toBe(true);
    expect(registerMock).toHaveBeenCalledWith(payload);
    expect(useAuthStore.getState().user).toEqual(user);
    expect(localStorage.getItem("accessToken")).toBe("access-token");
    expect(localStorage.getItem("refreshToken")).toBe("refresh-token");
  });

  it("stores the registration error when registration fails", async () => {
    registerMock.mockRejectedValue(new Error("Email already exists"));

    const result = await useAuthStore.getState().register({
      email: user.email,
      password: "Password123!",
      name: "Test",
      lastName: "User",
    });

    expect(result).toBe(false);
    expect(useAuthStore.getState().error).toBe("Email already exists");
    expect(useAuthStore.getState().isLoading).toBe(false);
  });

  it("logs out and clears persisted session data", async () => {
    localStorage.setItem("accessToken", "access-token");
    localStorage.setItem("refreshToken", "refresh-token");
    localStorage.setItem("user", JSON.stringify(user));
    useAuthStore.setState({ user });

    await useAuthStore.getState().logout();

    expect(logoutMock).toHaveBeenCalledOnce();
    expect(useAuthStore.getState().user).toBeNull();
    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(localStorage.getItem("refreshToken")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });

  it("clears the session even when the logout request fails", async () => {
    logoutMock.mockRejectedValue(new Error("Network error"));
    localStorage.setItem("accessToken", "access-token");
    localStorage.setItem("refreshToken", "refresh-token");
    localStorage.setItem("user", JSON.stringify(user));
    useAuthStore.setState({ user });

    await useAuthStore.getState().logout();

    expect(useAuthStore.getState().user).toBeNull();
    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(localStorage.getItem("refreshToken")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });

  it("updates the user in memory and localStorage", () => {
    const updatedUser = { ...user, name: "Updated" };

    useAuthStore.getState().updateUser(updatedUser);

    expect(useAuthStore.getState().user).toEqual(updatedUser);
    expect(localStorage.getItem("user")).toBe(JSON.stringify(updatedUser));
  });
});
