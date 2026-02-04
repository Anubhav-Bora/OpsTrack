import { useQuery } from "@tanstack/react-query";
import { get } from "@/utils/api";
import { UserWithStats } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

// Fetch all users with stats (for admin)
export function useAllUsersWithStats() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();

  return useQuery({
    queryKey: ["users", "stats", "all"],
    queryFn: async () => {
      const response = await get<any[]>('/users/stats');

      if (!Array.isArray(response)) {
        throw new Error('Invalid response format: expected array');
      }

      return response.map((user: any) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        stats: user.stats || {
          totalTasks: 0,
          pendingTasks: 0,
          inProgressTasks: 0,
          submittedTasks: 0,
          completedTasks: 0,
          rejectedTasks: 0,
        },
        rooms: user.rooms || [],
      })) as UserWithStats[];
    },
    enabled: isAuthenticated && !authLoading && user?.role === 'ADMIN',
    staleTime: 30000,
    retry: 1,
  });
}

// Fetch users with stats for a specific room (for leader)
export function useRoomUsersWithStats(roomId: string | undefined) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  return useQuery({
    queryKey: ["users", "stats", "room", roomId],
    queryFn: async () => {
      if (!roomId) {
        throw new Error('Room ID is required');
      }
      const response = await get<any[]>(`/users/stats/room/${roomId}`);

      if (!Array.isArray(response)) {
        throw new Error('Invalid response format: expected array');
      }

      return response.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        roomRole: user.roomRole,
        createdAt: user.createdAt,
        stats: user.stats || {
          totalTasks: 0,
          pendingTasks: 0,
          inProgressTasks: 0,
          submittedTasks: 0,
          completedTasks: 0,
          rejectedTasks: 0,
        },
        rooms: user.rooms || [],
      })) as UserWithStats[];
    },
    enabled: !!roomId && isAuthenticated && !authLoading,
    staleTime: 30000,
    retry: 1,
  });
}
