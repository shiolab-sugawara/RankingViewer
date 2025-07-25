import {
  createContext,
  useContext,
  useState,
  useEffect
} from "react";
import type { ReactNode } from 'react';
import type { Dispatch, SetStateAction } from "react";
import * as api from "./apiClient";

type User = { id: number; email: string };

interface AuthCtx {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthCtx | undefined>(undefined);
export const useAuth = () => useContext(AuthContext)!;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    api.fetchCurrentUser()
       .then(res => setUser(res.data.data))
       .catch(() => setUser(null));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};