import * as React from "react";
import { User, AuthState, LoginInput, SignupInput, RoomMember } from "@/types";
import { AUTH_TOKEN_KEY, USER_KEY } from "@/utils/constants";

interface AuthContextType extends AuthState {
  login: (input: LoginInput) => Promise<void>;
  signup: (input: SignupInput) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// Mock users for demo - IDs must match MOCK_USERS in mockData.ts
const MOCK_USERS: User[] = [
  {
    id: "user-1",
    name: "John Admin",
    email: "admin@example.com",
    role: "ADMIN",
    createdAt: new Date().toISOString(),
  },
  {
    id: "user-2",
    name: "Sarah Leader",
    email: "leader@example.com",
    role: "LEADER",
    createdAt: new Date().toISOString(),
  },
  {
    id: "user-3",
    name: "Mike Member",
    email: "member@example.com",
    role: "MEMBER",
    createdAt: new Date().toISOString(),
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Load user from localStorage on mount
  React.useEffect(() => {
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
  }, []);

  const login = React.useCallback(async (input: LoginInput) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock authentication
    const user = MOCK_USERS.find((u) => u.email === input.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // For demo, accept any password
    const token = `mock_token_${Date.now()}`;

    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    setState({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const signup = React.useCallback(async (input: SignupInput) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Create new user
    const user: User = {
      id: `user_${Date.now()}`,
      name: input.name,
      email: input.email,
      role: input.role,
      createdAt: new Date().toISOString(),
    };

    const token = `mock_token_${Date.now()}`;

    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    setState({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
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
