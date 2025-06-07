import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  AuthContextType,
  AuthState,
  LoginCredentials,
  User,
  ROLE_PERMISSIONS,
} from "@/types/auth";
import { MockAuthService } from "@/services/mockAuth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps): React.ReactElement {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for existing session on mount
    const user = MockAuthService.getCurrentUser();
    setAuthState({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    });
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      const user = await MockAuthService.login(credentials);

      if (user) {
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        return true;
      }

      return false;
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = () => {
    MockAuthService.logout();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const hasPermission = (permission: string): boolean => {
    if (!authState.user) return false;

    const userPermissions = ROLE_PERMISSIONS[authState.user.role] || [];
    return userPermissions.includes(permission);
  };

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Define useAuth hook separately from the export
function useAuthHook(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Export the components and hook
export { AuthProvider };
export const useAuth = useAuthHook;
