import { createContext, useContext, useState, type ReactNode } from "react";
import { login as apiLogin } from "../api/auth";
//import type { LoginResponse } from "../api/auth";
import { decodeJWT } from "../utils/jwt";

interface AuthContextType {
  token: string | null;
  role: string | null;
  user: string | null;
  login: (username: string, password: string) => Promise<{ token: string; role: string, user: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [user, setUser] = useState(localStorage.getItem("user"));

  // login function used by Login.tsx
  const login = async (username: string, password: string) => {
    const data = await apiLogin({ username, password });

    const jwt = data.access_token;
    const decoded = decodeJWT(jwt);
    const roleFromToken = decoded?.role;
    const userFromToken = decoded?.sub;
    //const expFromToken = decoded?.exp;

    if (!roleFromToken) {
      throw new Error("JWT does not contain a role");
    }

    // Save token+role+user id after login
    setToken(jwt);
    setRole(roleFromToken);
    setUser(userFromToken);
    localStorage.setItem("token", jwt);
    localStorage.setItem("role", roleFromToken);
    localStorage.setItem("user", userFromToken);

    return {token: jwt, role: roleFromToken, user: userFromToken };
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ token, role, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token);
  if (!decoded) return true;

  const now = Math.floor(Date.now() / 1000);
  return decoded.exp < now;
}

export function tokenExpiresIn(token: string): number {
  const decoded = decodeJWT(token);
  if (!decoded) return 0;

  return decoded.exp - Math.floor(Date.now() / 1000);
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
