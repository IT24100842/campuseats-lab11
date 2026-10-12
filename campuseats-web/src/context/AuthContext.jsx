import { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { apiClient } from "../api/client.js";

// ── Slides 38 & 45: Context for GLOBAL CLIENT STATE ──────────────
// Auth state is the textbook use case for Context: small, changes
// rarely, needed everywhere (navbar, route guards, API client).
// Login now calls the ASP.NET Core API, which returns a signed JWT
// (signed with Jwt__Key from the server's environment variables).
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage("campuseats-user", null);

  const login = async (roleKey) => {
    const res = await apiClient.post("/auth/login", { role: roleKey });
    setUser({ ...res.data.user, token: res.data.token });
  };
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook so consumers write useAuth() instead of useContext(AuthContext)
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
