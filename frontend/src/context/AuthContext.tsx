import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { authApi } from '@/api/auth';
import type { LoginPayload, RegisterPayload } from '@/api/auth';
import type { AuthUser } from '@/types';
import { decodeToken } from '@/utils/jwt';
import { tokenStorage } from '@/utils/tokenStorage';

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => {
    const stored = tokenStorage.get();
    if (!decodeToken(stored)) {
      tokenStorage.clear();
      return null;
    }
    return stored;
  });
  const user = useMemo(() => decodeToken(token), [token]);

  const login = useCallback(async (payload: LoginPayload) => {
    const data = await authApi.login(payload);
    tokenStorage.set(data.token);
    setToken(data.token);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    await authApi.register(payload);
    const data = await authApi.login({
      email: payload.email,
      password: payload.password,
    });
    tokenStorage.set(data.token);
    setToken(data.token);
  }, []);

  const logout = useCallback(() => {
    tokenStorage.clear();
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      login,
      register,
      logout,
    }),
    [token, user, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
