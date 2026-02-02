import { useQuery, useMutation } from '@tanstack/react-query';
import * as React from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setRooms } from '@/store/slices/roomSlice';
import { get, post, del } from '@/utils/api';
import { Room, CreateRoomInput } from '@/types';
import { queryClient } from '@/lib/queryClient';
import { useAuth } from '@/contexts/AuthContext';

export function useRooms() {
    const dispatch = useAppDispatch();
    const { isAuthenticated, isLoading: authLoading } = useAuth();

    const query = useQuery({
        queryKey: ['rooms'],
        queryFn: async () => {
            try {
                console.log('[useRooms] Fetching rooms...');
                const data = await get<any[]>('/rooms');
                console.log('[useRooms] Rooms fetched:', data);
                const transformed = data.map(room => ({
                    ...room,
                    id: String(room.id),
                    createdBy: String(room.createdBy),
                })) as Room[];
                dispatch(setRooms(transformed));
                return transformed;
            } catch (error) {
                console.error('[useRooms] Error fetching rooms:', error);
                throw error;
            }
        },
        enabled: isAuthenticated && !authLoading,
        refetchInterval: 5000,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        retry: 3,
    });

    // Manually refetch when auth finishes loading
    React.useEffect(() => {
        if (isAuthenticated && !authLoading) {
            console.log('[useRooms] Auth loaded, refetching rooms');
            query.refetch();
        }
    }, [isAuthenticated, authLoading, query]);

    return query;
}

export function useCreateRoom() {
    return useMutation({
        mutationFn: (data: CreateRoomInput) => post<any>('/rooms', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
        },
    });
}

export function useDeleteRoom() {
    return useMutation({
        mutationFn: (roomId: string) => del(`/rooms/${roomId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
        },
    });
}
