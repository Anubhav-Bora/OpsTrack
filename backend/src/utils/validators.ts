import { z } from 'zod';

// Auth schemas
export const signupSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['ADMIN', 'BACKEND', 'FRONTEND', 'DEVOPS', 'CYBERSECURITY'] as const),
});

export const signinSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(1, 'Password is required'),
});

// User schemas
export const createUserSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['ADMIN', 'BACKEND', 'FRONTEND', 'DEVOPS', 'CYBERSECURITY'] as const),
});

// Task schemas
export const createTaskSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    requiredRole: z.enum(['ADMIN', 'BACKEND', 'FRONTEND', 'DEVOPS', 'CYBERSECURITY'] as const),
    roomId: z.number().int().positive('Room ID must be positive'),
});

export const updateTaskStatusSchema = z.object({
    status: z.enum(['PENDING', 'IN_PROGRESS', 'DONE', 'BLOCKED'] as const),
});

export const assignTaskSchema = z.object({
    assignedTo: z.number().int().positive('User ID must be positive'),
});

// Room schemas
export const createRoomSchema = z.object({
    name: z.string().min(1, 'Room name is required'),
    createdBy: z.number().int().positive('User ID must be positive'),
});

export const updateRoomSchema = z.object({
    name: z.string().min(1, 'Room name is required'),
});

// Room member schemas
export const addMemberToRoomSchema = z.object({
    userId: z.number().int().positive('User ID must be positive'),
    roomId: z.number().int().positive('Room ID must be positive'),
    role: z.enum(['LEADER', 'ADMIN', 'MEMBER'] as const).optional(),
});

export const updateMemberRoleSchema = z.object({
    role: z.enum(['LEADER', 'ADMIN', 'MEMBER'] as const),
});

// Task dependency schemas
export const addTaskDependencySchema = z.object({
    taskId: z.number().int().positive('Task ID must be positive'),
    dependsOnTaskId: z.number().int().positive('Depends on task ID must be positive'),
});
