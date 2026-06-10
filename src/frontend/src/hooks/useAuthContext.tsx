import React from "react";

const VALID_CREDENTIALS = [
  {
    username: "teacher",
    password: "teacher123",
    role: "teacher",
    displayName: "Teacher",
  },
  {
    username: "admin",
    password: "admin123",
    role: "admin",
    displayName: "Admin",
  },
];

const AUTH_KEY = "attendanceflow_auth";

export interface AuthUser {
  username: string;
  role: string;
  displayName: string;
}

export function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

// --- Singleton context so all components share the same auth state ---

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(getStoredUser);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const isAuthenticated = user !== null;

  const login = React.useCallback(
    async (username: string, password: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      await new Promise((r) => setTimeout(r, 400));
      const match = VALID_CREDENTIALS.find(
        (c) => c.username === username && c.password === password,
      );
      if (match) {
        const authUser: AuthUser = {
          username: match.username,
          role: match.role,
          displayName: match.displayName,
        };
        localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
        setUser(authUser);
        setIsLoading(false);
        return true;
      }
      setError("Invalid username or password");
      setIsLoading(false);
      return false;
    },
    [],
  );

  const logout = React.useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, error, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
