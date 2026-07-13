import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthUser {
  token: string;
  role: string;
  expires_at: number; // unix timestamp
}

interface AuthContextType {
  user: AuthUser | null;
  login: (userData: AuthUser) => void;
  logout: () => void;
  extendSession: (newToken: string, newExp: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('sentinelfuse_auth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.expires_at * 1000 > Date.now()) {
          setUser(parsed);
        } else {
          sessionStorage.removeItem('sentinelfuse_auth');
        }
      } catch (e) {
        sessionStorage.removeItem('sentinelfuse_auth');
      }
    }
    setIsLoaded(true);
  }, []);

  const login = (userData: AuthUser) => {
    setUser(userData);
    sessionStorage.setItem('sentinelfuse_auth', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('sentinelfuse_auth');
  };

  const extendSession = (newToken: string, newExp: number) => {
    if (!user) return;
    const updated = { ...user, token: newToken, expires_at: newExp };
    setUser(updated);
    sessionStorage.setItem('sentinelfuse_auth', JSON.stringify(updated));
  };

  if (!isLoaded) return null;

  return (
    <AuthContext.Provider value={{ user, login, logout, extendSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
