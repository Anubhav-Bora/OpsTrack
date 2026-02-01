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
            const data = await get<any[]>('/tasks');
            const transformed = data.map(task => ({
                ...task,
                id: String(task.id),
                roomId: String(task.roomId),
                assigneeId: task.assignedTo ? String(task.assignedTo) : undefined,
                assignee: task.assignee ? {
                    ...task.assignee,
                    id: String(task.assignee.id),
                } : undefined,
            })) as Task[];
            dispatch(setTasks(transformed));
            return transformed;
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
            const data = await get<any[]>(`/tasks/room/${roomId}`);
            const transformed = data.map(task => ({
                ...task,
                id: String(task.id),
                roomId: String(task.roomId),
                assigneeId: task.assignedTo ? String(task.assignedTo) : undefined,
                assignee: task.assignee ? {
                    ...task.assignee,
                    id: String(task.assignee.id),
                } : undefined,
            })) as Task[];
            dispatch(setTasks(transformed));
            return transformed;
        },
        refetchInterval: 5000,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    });
}

export function useCreateTask() {
    return useMutation({
        mutationFn: (data: CreateTaskInput & { roomId: string }) =>
            post<Task>('/tasks', {
                title: data.title,
                description: data.description,
                requiredRole: data.requiredRole || 'BACKEND',
                roomId: Number(data.roomId),
                dueDate: data.dueDate,
                assignedTo: data.assigneeId ? Number(data.assigneeId) : undefined,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
}

export function useApproveTask() {
    return useMutation({
        mutationFn: ({ taskId, roomId }: { taskId: string; roomId: string }) =>
            put<Task>(`/tasks/${taskId}/approve`, { roomId: Number(roomId) }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
}

export function useRejectTask() {
    return useMutation({
        mutationFn: ({ taskId, roomId, rejectionNote }: { taskId: string; roomId: string; rejectionNote?: string }) =>
            put<Task>(`/tasks/${taskId}/reject`, { roomId: Number(roomId), rejectionNote }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
}
