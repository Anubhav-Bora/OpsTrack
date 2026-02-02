import { useQuery } from '@tanstack/react-query';
import * as React from 'react';
import { get } from '@/utils/api';
import { Task } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export function useMyTasks() {
    const { isAuthenticated, isLoading: authLoading } = useAuth();

    const query = useQuery({
        queryKey: ['tasks', 'my-tasks'],
        queryFn: async () => {
            const data = await get<any[]>(`/tasks/assignee/my-tasks`);
            return data.map(task => ({
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
        enabled: isAuthenticated && !authLoading,
        refetchInterval: 5000,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    });

    // Manually refetch when auth finishes loading
    React.useEffect(() => {
        if (isAuthenticated && !authLoading) {
            query.refetch();
        }
    }, [isAuthenticated, authLoading, query]);

    return query;
}
