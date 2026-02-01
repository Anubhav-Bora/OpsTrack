// API Base URL - automatically set from environment variables
// Development: http://localhost:3000/api
// Production: /api (relative path, served from same domain)
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
  BACKEND: 'Backend',
  FRONTEND: 'Frontend',
  DEVOPS: 'DevOps',
  CYBERSECURITY: 'Cybersecurity',
};

export const ROLE_DESCRIPTIONS: Record<string, string> = {
  ADMIN: 'Full control over the system',
  BACKEND: 'Backend development role',
  FRONTEND: 'Frontend development role',
  DEVOPS: 'DevOps and infrastructure role',
  CYBERSECURITY: 'Cybersecurity role',
};

export const PAGINATION_LIMIT = 10;
