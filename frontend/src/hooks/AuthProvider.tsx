import type { ReactNode } from 'react';
import { AuthContext, useAuthState } from './useAuth';

/** Wraps the app with authentication context. Must be inside BrowserRouter. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthState();
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}
