import { useQuery, useMutation } from '@tanstack/react-query';
import { useAppDispatch } from '@/store/hooks';
import { setTasks } from '@/store/slices/taskSlice';
import { get, post, put } from '@/utils/api';
import { Task, CreateTaskInput } from '@/types';
import { queryClient } from '@/lib/queryClient';

export function useTasks() {
    const dispatch = useAppDispatch();

    return useQuery({
        queryKey: ['tasks'],
        queryFn: async () => {
            const data = await get<Task[]>('/tasks');
            dispatch(setTasks(data));
            return data;
        },
        refetchInterval: 5000,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    });
}

export function useTasksByRoom(roomId: number) {
    const dispatch = useAppDispatch();

    return useQuery({
        queryKey: ['tasks', 'room', roomId],
        queryFn: async () => {
            const data = await get<Task[]>(`/tasks/room/${roomId}`);
            dispatch(setTasks(data));
            return data;
        },
        refetchInterval: 5000,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    });
}

export function useCreateTask() {
    return useMutation({
        mutationFn: (data: CreateTaskInput) => post<Task>('/tasks', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
}

export function useApproveTask() {
    return useMutation({
        mutationFn: ({ taskId, roomId }: { taskId: number; roomId: number }) =>
            put<Task>(`/tasks/${taskId}/approve`, { roomId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
}

export function useRejectTask() {
    return useMutation({
        mutationFn: ({ taskId, roomId }: { taskId: number; roomId: number }) =>
            put<Task>(`/tasks/${taskId}/reject`, { roomId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
}
