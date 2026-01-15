import {
  createContext,
  useEffect,
  useState,
} from 'react';
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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /**
   * 🔑 AUTH REHYDRATION (RUNS ON REFRESH)
   */
  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const personnel = await authService.authCheck();
        setUser(personnel);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  const login = async (data: LoginPayload) => {
    setLoading(true);
    try {
      const res = await authService.login(data);
      setUser(res.personnel);
      navigate('/', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      navigate('/login', { replace: true });
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
