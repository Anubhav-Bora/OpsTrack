import { useMutation } from '@tanstack/react-query';
import { put } from '@/utils/api';
import { Task } from '@/types';
import { queryClient } from '@/lib/queryClient';

export function useUpdateTaskStatus() {
    return useMutation({
        mutationFn: ({ taskId, status }: { taskId: string; status: string }) =>
            put<Task>(`/tasks/${taskId}/status`, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['users', 'stats'] });
        },
    });
}

export function useAssignTask() {
    return useMutation({
        mutationFn: ({ taskId, assigneeId, roomId }: { taskId: string; assigneeId: string; roomId: string }) =>
            put<Task>(`/tasks/${taskId}/assign`, { assignedTo: Number(assigneeId), roomId: Number(roomId) }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['users', 'stats'] });
        },
    });
}

export function useSubmitTask() {
    return useMutation({
        mutationFn: ({ taskId }: { taskId: string }) =>
            put<Task>(`/tasks/${taskId}/submit`, {}),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['users', 'stats'] });
        },
    });
}
