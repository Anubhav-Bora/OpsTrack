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
            const data = await get<Room[]>('/rooms');
            dispatch(setRooms(data));
            return data;
        },
        refetchInterval: 5000, // Poll every 5 seconds
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    });
}

export function useCreateRoom() {
    return useMutation({
        mutationFn: (data: CreateRoomInput) => post<Room>('/rooms', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
        },
    });
}
