export type UserRole = 'ADMIN' | 'LEADER' | 'MEMBER';

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface Room {
  id: string;
  name: string;
  description?: string;
  membersCount: number;
  tasksCount: number;
  completedTasksCount: number;
  createdAt: string;
  createdBy: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assigneeId?: string;
  assignee?: User;
  roomId: string;
  dueDate?: string;
  dependencies?: string[];
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionNote?: string;
}

export interface RoomMember {
  id: string;
  userId: string;
  user: User;
  roomId: string;
  role: UserRole;
  joinedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface DashboardStats {
  totalTasks: number;
  pendingApprovals: number;
  completedTasks: number;
  inProgressTasks: number;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  assigneeId?: string;
  dueDate?: string;
  dependencies?: string[];
}

export interface CreateRoomInput {
  name: string;
  description?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}
