import { useInternetIdentity } from "@caffeineai/core-infrastructure";

export function useAuth() {
  const { identity, loginStatus, login, clear } = useInternetIdentity();

  const isAuthenticated = loginStatus === "success" && identity !== null;
  const isLoading = loginStatus === "logging-in";

  return {
    identity,
    isAuthenticated,
    isLoading,
    login,
    logout: clear,
    loginStatus,
  };
}
