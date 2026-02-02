import { useQuery } from "@tanstack/react-query";
import { request } from "@/utils/api";
import { UserWithStats } from "@/types";

// Fetch all users with stats (for admin)
export function useAllUsersWithStats() {
  return useQuery<UserWithStats[]>({
    queryKey: ["users", "stats"],
    queryFn: () => request<UserWithStats[]>({ url: "/users/stats", method: "GET" }),
    staleTime: 30000, // 30 seconds
  });
}

// Fetch users with stats for a specific room (for leader)
export function useRoomUsersWithStats(roomId: string | undefined) {
  return useQuery<UserWithStats[]>({
    queryKey: ["users", "stats", "room", roomId],
    queryFn: () => request<UserWithStats[]>({ url: `/users/stats/room/${roomId}`, method: "GET" }),
    enabled: !!roomId,
    staleTime: 30000, // 30 seconds
  });
}
