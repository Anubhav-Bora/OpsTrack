export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const AUTH_TOKEN_KEY = 'workspace_auth_token';
export const USER_KEY = 'workspace_user';

export const POLLING_INTERVAL = 5000; // 5 seconds

export const TASK_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  SUBMITTED: 'Submitted',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

export const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Admin',
  LEADER: 'Leader',
  MEMBER: 'Member',
};

export const ROLE_DESCRIPTIONS: Record<string, string> = {
  ADMIN: 'Full control over rooms, tasks, and members',
  LEADER: 'Can manage tasks and approve submissions',
  MEMBER: 'Can work on assigned tasks',
};

export const PAGINATION_LIMIT = 10;
