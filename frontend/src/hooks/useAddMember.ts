import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { post, get } from '@/utils/api';
import { User } from '@/types';

export interface AddMemberInput {
  userId: string;
  roomId: string;
}

export function useAddMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddMemberInput) =>
      post('/room-members', data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['room-members', variables.roomId] });
    },
  });
}

export function useAvailableUsers(roomId: number) {
  return useQuery({
    queryKey: ['available-users', roomId],
    queryFn: async () => {
      const response = await get<User[]>(`/users?roomId=${roomId}&available=true`);
      return response;
    },
  });
}

export function useAllUsers() {
  return useQuery({
    queryKey: ['all-users'],
    queryFn: () => get<User[]>('/users'),
  });
}
