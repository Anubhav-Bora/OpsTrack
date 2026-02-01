import { useQuery, useMutation } from '@tanstack/react-query';
import { useAppDispatch } from '@/store/hooks';
import { setRooms } from '@/store/slices/roomSlice';
import { get, post } from '@/utils/api';
import { Room, CreateRoomInput } from '@/types';
import { queryClient } from '@/lib/queryClient';

export function useRooms() {
    const dispatch = useAppDispatch();

    return useQuery({
        queryKey: ['rooms'],
        queryFn: async () => {
            const data = await get<any[]>('/rooms');
            const transformed = data.map(room => ({
                ...room,
                id: String(room.id),
                createdBy: String(room.createdBy),
            })) as Room[];
            dispatch(setRooms(transformed));
            return transformed;
        },
        refetchInterval: 5000, // Poll every 5 seconds
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    });
}

export function useCreateRoom() {
    return useMutation({
        mutationFn: (data: CreateRoomInput) => post<any>('/rooms', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
        },
    });
}
