import { useQuery } from '@tanstack/react-query';
import { get } from '@/utils/api';
import { Task } from '@/types';

export function useMyTasks() {
    return useQuery({
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
        refetchInterval: 5000,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    });
}
