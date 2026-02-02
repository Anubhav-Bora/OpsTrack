import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import { post, get } from '@/utils/api';
import { User } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

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
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const query = useQuery({
    queryKey: ['available-users', roomId],
    queryFn: async () => {
      const response = await get<User[]>(`/users?roomId=${roomId}&available=true`);
      return response;
    },
    enabled: !!roomId && isAuthenticated && !authLoading,
  });

  React.useEffect(() => {
    if (!!roomId && isAuthenticated && !authLoading) {
      query.refetch();
    }
  }, [isAuthenticated, authLoading, roomId, query]);

  return query;
}

export function useAllUsers() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const query = useQuery({
    queryKey: ['all-users'],
    queryFn: () => get<User[]>('/users'),
    enabled: isAuthenticated && !authLoading,
  });

  React.useEffect(() => {
    if (isAuthenticated && !authLoading) {
      query.refetch();
    }
  }, [isAuthenticated, authLoading, query]);

  return query;
}
