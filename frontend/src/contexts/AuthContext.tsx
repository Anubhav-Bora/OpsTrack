import * as React from "react";
import { User, AuthState, LoginInput, SignupInput, RoomMember } from "@/types";
import { AUTH_TOKEN_KEY, USER_KEY, API_BASE_URL } from "@/utils/constants";

interface AuthContextType extends AuthState {
  login: (input: LoginInput) => Promise<void>;
  signup: (input: SignupInput) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Load user from localStorage on mount and when it changes
  React.useEffect(() => {
    const loadAuthState = () => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      const userStr = localStorage.getItem(USER_KEY);

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr) as User;
          setState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          localStorage.removeItem(AUTH_TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    loadAuthState();

    // Listen for storage changes (when login happens in useAuthApi)
    const handleStorageChange = () => {
      loadAuthState();
    };

    // Listen for custom auth-updated event (fired when login happens in same tab)
    const handleAuthUpdated = () => {
      loadAuthState();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-updated', handleAuthUpdated);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-updated', handleAuthUpdated);
    };
  }, []);

  const login = React.useCallback(async (input: LoginInput) => {
    try {
      // Call backend API
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let error;
        try {
          error = JSON.parse(errorText);
        } catch {
          error = { error: errorText || "Authentication failed" };
        }
        throw new Error(error.error || error.message || "Invalid email or password");
      }

      const { user, token } = await response.json();

      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));

      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      throw error instanceof Error ? error : new Error("Login failed");
    }
  }, []);

  const signup = React.useCallback(async (input: SignupInput) => {
    try {
      // Call backend API
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let error;
        try {
          error = JSON.parse(errorText);
        } catch {
          error = { error: errorText || "Signup failed" };
        }
        throw new Error(error.error || error.message || "Signup failed");
      }

      const { user, token } = await response.json();

      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));

      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      throw error instanceof Error ? error : new Error("Signup failed");
    }
  }, []);

  const logout = React.useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const updateUser = React.useCallback((user: User) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setState((prev) => ({ ...prev, user }));
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Hook to check if user has specific global role
export function useHasRole(...roles: User["role"][]) {
  const { user } = useAuth();
  return user ? roles.includes(user.role) : false;
}

// Hook to check if user can perform admin/leader actions globally (Admin only)
export function useIsAdminOrLeader() {
  return useHasRole("ADMIN");
}

// Hook to get user's role within a specific room
export function useRoomRole(members: RoomMember[]) {
  const { user } = useAuth();
  
  const currentMember = React.useMemo(() => {
    if (!user) return null;
    return members.find((m) => m.userId === user.id) || null;
  }, [members, user]);

  const roomRole = currentMember?.role || null;
  const isRoomAdminOrLeader = roomRole === "ADMIN" || roomRole === "LEADER";
  const isRoomAdmin = roomRole === "ADMIN";

  return {
    currentMember,
    roomRole,
    isRoomAdminOrLeader,
    isRoomAdmin,
  };
}

// Utility function to check if user is admin/leader in a room (for non-hook contexts)
export function getUserRoomRole(userId: string, members: RoomMember[]) {
  const member = members.find((m) => m.userId === userId);
  return member?.role || null;
}

export function isAdminOrLeaderInRoom(userId: string, members: RoomMember[]) {
  const role = getUserRoomRole(userId, members);
  return role === "ADMIN" || role === "LEADER";
}
