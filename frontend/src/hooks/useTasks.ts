import { useQuery, useMutation } from '@tanstack/react-query';
import * as React from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setTasks } from '@/store/slices/taskSlice';
import { get, post, put, request } from '@/utils/api';
import { Task, CreateTaskInput } from '@/types';
import { queryClient } from '@/lib/queryClient';
import { useAuth } from '@/contexts/AuthContext';

export function useTasks() {
    const dispatch = useAppDispatch();
    const { isAuthenticated, isLoading: authLoading } = useAuth();

    const query = useQuery({
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
        enabled: isAuthenticated && !authLoading,
        refetchInterval: 5000,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    });

    React.useEffect(() => {
        if (isAuthenticated && !authLoading) {
            query.refetch();
        }
    }, [isAuthenticated, authLoading, query]);

    return query;
}

export function useTasksByRoom(roomId: number) {
    const dispatch = useAppDispatch();
    const { isAuthenticated, isLoading: authLoading } = useAuth();

    const query = useQuery({
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
        enabled: isAuthenticated && !authLoading,
        refetchInterval: 5000,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    });

    React.useEffect(() => {
        if (isAuthenticated && !authLoading) {
            query.refetch();
        }
    }, [isAuthenticated, authLoading, query]);

    return query;
}

export function useCreateTask() {
    return useMutation({
        mutationFn: (data: CreateTaskInput & { roomId: string }) =>
            post<any>('/tasks', {
                title: data.title,
                description: data.description,
                requiredRole: data.requiredRole || 'BACKEND',
                roomId: Number(data.roomId),
                dueDate: data.dueDate,
                assigneeId: data.assigneeId ? Number(data.assigneeId) : undefined,
            }),
        onSuccess: (data, variables) => {
            // Transform the created task to include assigneeId
            const transformed = {
                ...data,
                id: String(data.id),
                roomId: String(data.roomId),
                assigneeId: data.assignedTo ? String(data.assignedTo) : undefined,
                assignee: data.assignee ? {
                    ...data.assignee,
                    id: String(data.assignee.id),
                } : undefined,
            };
            // Add the new task to the store and cache
            queryClient.setQueryData(['tasks'], (oldData: Task[] | undefined) => {
                if (!oldData) return [transformed];
                return [...oldData, transformed];
            });
            // Also invalidate room-specific tasks query if roomId is provided
            if (variables.roomId) {
                queryClient.invalidateQueries({ queryKey: ['tasks', 'room', Number(variables.roomId)] });
            }
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

export function useEditTask() {
    return useMutation({
        mutationFn: async (data: { taskId: string; title: string; description?: string; requiredRole?: string; dueDate?: string; roomId: string; assigneeId?: string }) => {
            // First, update the task details
            await put<Task>(`/tasks/${data.taskId}`, {
                title: data.title,
                description: data.description,
                requiredRole: data.requiredRole || 'BACKEND',
                dueDate: data.dueDate,
                roomId: Number(data.roomId),
            });

            // Then, if assigneeId changed, update the assignment separately
            if (data.assigneeId !== undefined) {
                return put<any>(`/tasks/${data.taskId}/assign`, {
                    assignedTo: data.assigneeId ? Number(data.assigneeId) : undefined,
                    roomId: Number(data.roomId),
                });
            }

            // If no assignee change, just return the updated task
            return get<any>(`/tasks/${data.taskId}`);
        },
        onSuccess: (data, variables) => {
            // Transform the updated task to include assigneeId
            const transformed = {
                ...data,
                id: String(data.id),
                roomId: String(data.roomId),
                assigneeId: data.assignedTo ? String(data.assignedTo) : undefined,
                assignee: data.assignee ? {
                    ...data.assignee,
                    id: String(data.assignee.id),
                } : undefined,
            };
            // Update the task in the cache
            queryClient.setQueryData(['tasks'], (oldData: Task[] | undefined) => {
                if (!oldData) return [transformed];
                return oldData.map(t => t.id === transformed.id ? transformed : t);
            });
            // Also invalidate room-specific tasks query if roomId is provided
            if (variables.roomId) {
                queryClient.invalidateQueries({ queryKey: ['tasks', 'room', Number(variables.roomId)] });
            }
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
}

export function useDeleteTask() {
    return useMutation({
        mutationFn: (data: { taskId: string; roomId: string }) =>
            request<{ message: string }>({
                method: 'DELETE',
                url: `/tasks/${data.taskId}`,
                data: { roomId: Number(data.roomId) }
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
}
