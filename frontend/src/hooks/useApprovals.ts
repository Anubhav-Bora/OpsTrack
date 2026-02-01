import { useQuery, useMutation } from '@tanstack/react-query';
import { get, put } from '@/utils/api';
import { Task } from '@/types';
import { queryClient } from '@/lib/queryClient';

export function useSubmittedTasks() {
    return useQuery({
        queryKey: ['tasks', 'submitted'],
        queryFn: async () => {
            const data = await get<any[]>(`/tasks`);
            // Filter for submitted tasks only
            return data
                .filter(task => task.status === 'SUBMITTED')
                .map(task => ({
                    ...task,
                    id: String(task.id),
                    roomId: String(task.roomId),
                    assigneeId: task.assignedTo ? String(task.assignedTo) : undefined,
                    assignee: task.assignee ? {
                        ...task.assignee,
                        id: String(task.assignee.id),
                    } : undefined,
                })) as Task[];
        },
        refetchInterval: 5000,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    });
}

export function useApproveTaskMutation() {
    return useMutation({
        mutationFn: ({ taskId, roomId }: { taskId: string; roomId: string }) =>
            put<Task>(`/tasks/${taskId}/approve`, { roomId: Number(roomId) }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', 'submitted'] });
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
}

export function useRejectTaskMutation() {
    return useMutation({
        mutationFn: ({ taskId, roomId, rejectionNote }: { taskId: string; roomId: string; rejectionNote?: string }) =>
            put<Task>(`/tasks/${taskId}/reject`, { roomId: Number(roomId), rejectionNote }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', 'submitted'] });
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
}
