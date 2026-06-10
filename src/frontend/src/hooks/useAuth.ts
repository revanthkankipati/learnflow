// Re-export from useAuthContext to avoid naming conflict with useAuth.tsx
export { AuthProvider, getStoredUser, useAuth } from "./useAuthContext";
export type { AuthUser } from "./useAuthContext";
