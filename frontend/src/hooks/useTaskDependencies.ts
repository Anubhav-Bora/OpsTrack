import { useQuery, useMutation } from '@tanstack/react-query';
import * as React from 'react';
import { get, post, del } from '@/utils/api';
import { queryClient } from '@/lib/queryClient';
import { useAuth } from '@/contexts/AuthContext';

export interface TaskDependency {
    id: string;
    taskId: string;
    dependsOnTaskId: string;
    task?: any;
    dependsOn?: any;
}

export function useTaskDependencies(taskId: string) {
    const { isAuthenticated, isLoading: authLoading } = useAuth();

    const query = useQuery({
        queryKey: ['task-dependencies', taskId],
        queryFn: async () => {
            const data = await get<any[]>(`/task-dependencies/task/${taskId}`);
            return data.map(dep => ({
                ...dep,
                id: String(dep.id),
                taskId: String(dep.taskId),
                dependsOnTaskId: String(dep.dependsOnTaskId),
            })) as TaskDependency[];
        },
        enabled: !!taskId && isAuthenticated && !authLoading,
    });

    React.useEffect(() => {
        if (!!taskId && isAuthenticated && !authLoading) {
            query.refetch();
        }
    }, [isAuthenticated, authLoading, taskId, query]);

    return query;
}

export function useTaskDependents(taskId: string) {
    const { isAuthenticated, isLoading: authLoading } = useAuth();

    const query = useQuery({
        queryKey: ['task-dependents', taskId],
        queryFn: async () => {
            const data = await get<any[]>(`/task-dependencies/dependents/${taskId}`);
            return data.map(dep => ({
                ...dep,
                id: String(dep.id),
                taskId: String(dep.taskId),
                dependsOnTaskId: String(dep.dependsOnTaskId),
            })) as TaskDependency[];
        },
        enabled: !!taskId && isAuthenticated && !authLoading,
    });

    React.useEffect(() => {
        if (!!taskId && isAuthenticated && !authLoading) {
            query.refetch();
        }
    }, [isAuthenticated, authLoading, taskId, query]);

    return query;
}

export function useAddTaskDependency() {
    return useMutation({
        mutationFn: ({ taskId, dependsOnTaskId }: { taskId: string; dependsOnTaskId: string }) =>
            post<TaskDependency>('/task-dependencies', {
                taskId: Number(taskId),
                dependsOnTaskId: Number(dependsOnTaskId),
            }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['task-dependencies', variables.taskId] });
            queryClient.invalidateQueries({ queryKey: ['task-dependents', variables.dependsOnTaskId] });
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
}

export function useRemoveTaskDependency() {
    return useMutation({
        mutationFn: ({ taskId, dependsOnTaskId }: { taskId: string; dependsOnTaskId: string }) =>
            del(`/task-dependencies/${taskId}/${dependsOnTaskId}`),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['task-dependencies', variables.taskId] });
            queryClient.invalidateQueries({ queryKey: ['task-dependents', variables.dependsOnTaskId] });
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
}
