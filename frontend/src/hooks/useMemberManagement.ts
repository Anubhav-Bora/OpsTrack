import { useMutation } from '@tanstack/react-query';
import { put, del } from '@/utils/api';
import { RoomMember } from '@/types';
import { queryClient } from '@/lib/queryClient';

export function useUpdateMemberRole() {
    return useMutation({
        mutationFn: ({ userId, roomId, role }: { userId: string; roomId: string; role: string }) =>
            put<RoomMember>(`/room-members/${userId}/${roomId}`, { role }),
        onSuccess: (_, { roomId }) => {
            queryClient.invalidateQueries({ queryKey: ['room-members', Number(roomId)] });
        },
    });
}

export function useRemoveMember() {
    return useMutation({
        mutationFn: ({ userId, roomId }: { userId: string; roomId: string }) =>
            del<{ message: string }>(`/room-members/${userId}/${roomId}`),
        onSuccess: (_, { roomId }) => {
            queryClient.invalidateQueries({ queryKey: ['room-members', Number(roomId)] });
        },
    });
}

export function useAddMember() {
    return useMutation({
        mutationFn: ({ userId, roomId, role }: { userId: string; roomId: string; role: string }) =>
            put<RoomMember>(`/room-members`, { userId: Number(userId), roomId: Number(roomId), role }),
        onSuccess: (_, { roomId }) => {
            queryClient.invalidateQueries({ queryKey: ['room-members', Number(roomId)] });
        },
    });
}
