import { useQuery } from '@tanstack/react-query';
import { get } from '@/utils/api';
import { Room, Task, RoomMember } from '@/types';

export function useRoomDetail(roomId: number) {
    return useQuery({
        queryKey: ['room', roomId],
        queryFn: async () => {
            const data = await get<any>(`/rooms/${roomId}`);
            return {
                ...data,
                id: String(data.id),
                createdBy: String(data.createdBy),
            } as Room;
        },
        enabled: !!roomId,
    });
}

export function useRoomTasks(roomId: number) {
    return useQuery({
        queryKey: ['tasks', 'room', roomId],
        queryFn: async () => {
            const data = await get<any[]>(`/tasks/room/${roomId}`);
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
        enabled: !!roomId,
        refetchInterval: 5000,
    });
}

export function useRoomMembers(roomId: number) {
    return useQuery({
        queryKey: ['room-members', roomId],
        queryFn: async () => {
            const data = await get<any[]>(`/room-members/room/${roomId}`);
            return data.map(member => ({
                ...member,
                id: String(member.id),
                userId: String(member.userId),
                roomId: String(member.roomId),
                user: {
                    ...member.user,
                    id: String(member.user.id),
                },
            })) as RoomMember[];
        },
        enabled: !!roomId,
        refetchInterval: 5000,
    });
}
