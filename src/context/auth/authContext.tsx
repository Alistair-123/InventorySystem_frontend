import { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import type {
  AuthContextType,
  Personnel,
  LoginPayload,
} from './authTypes';
import { authService } from './authService';

export const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<Personnel | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const login = async (data: LoginPayload) => {
    setLoading(true);
    try {
      const res = await authService.login(data);
      setUser(res.personnel);
      setAccessToken(res.accessToken);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setAccessToken(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
