import { Room, Task, User, RoomMember, DashboardStats } from "@/types";

// Mock users
export const MOCK_USERS: User[] = [
  {
    id: "user-1",
    name: "John Admin",
    email: "admin@example.com",
    role: "ADMIN",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "user-2",
    name: "Sarah Leader",
    email: "leader@example.com",
    role: "LEADER",
    createdAt: "2024-01-05T00:00:00Z",
  },
  {
    id: "user-3",
    name: "Mike Member",
    email: "member@example.com",
    role: "MEMBER",
    createdAt: "2024-01-10T00:00:00Z",
  },
  {
    id: "user-4",
    name: "Emily Developer",
    email: "emily@example.com",
    role: "MEMBER",
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "user-5",
    name: "Alex Designer",
    email: "alex@example.com",
    role: "MEMBER",
    createdAt: "2024-01-20T00:00:00Z",
  },
];

// Mock rooms
export const MOCK_ROOMS: Room[] = [
  {
    id: "room-1",
    name: "Product Development",
    description: "Main product development team working on the next release",
    membersCount: 5,
    tasksCount: 12,
    completedTasksCount: 7,
    createdAt: "2024-01-01T00:00:00Z",
    createdBy: "user-1",
  },
  {
    id: "room-2",
    name: "Marketing Campaign",
    description: "Q1 marketing campaign planning and execution",
    membersCount: 3,
    tasksCount: 8,
    completedTasksCount: 3,
    createdAt: "2024-01-15T00:00:00Z",
    createdBy: "user-1",
  },
  {
    id: "room-3",
    name: "Customer Support",
    description: "Customer support team and ticket management",
    membersCount: 4,
    tasksCount: 15,
    completedTasksCount: 10,
    createdAt: "2024-02-01T00:00:00Z",
    createdBy: "user-2",
  },
  {
    id: "room-4",
    name: "Design System",
    description: "Creating and maintaining the company design system",
    membersCount: 2,
    tasksCount: 6,
    completedTasksCount: 2,
    createdAt: "2024-02-15T00:00:00Z",
    createdBy: "user-1",
  },
];

// Mock tasks
export const MOCK_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Implement user authentication",
    description: "Set up JWT-based authentication with login, signup, and password reset functionality",
    status: "APPROVED",
    assigneeId: "user-3",
    assignee: MOCK_USERS[2],
    roomId: "room-1",
    dueDate: "2024-02-15T00:00:00Z",
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-02-10T00:00:00Z",
    approvedAt: "2024-02-10T00:00:00Z",
  },
  {
    id: "task-2",
    title: "Design dashboard mockups",
    description: "Create Figma mockups for the main dashboard with all key metrics",
    status: "SUBMITTED",
    assigneeId: "user-5",
    assignee: MOCK_USERS[4],
    roomId: "room-1",
    dueDate: "2024-02-20T00:00:00Z",
    createdAt: "2024-01-25T00:00:00Z",
    updatedAt: "2024-02-18T00:00:00Z",
    submittedAt: "2024-02-18T00:00:00Z",
  },
  {
    id: "task-3",
    title: "API documentation",
    description: "Write comprehensive API documentation using OpenAPI spec",
    status: "IN_PROGRESS",
    assigneeId: "user-4",
    assignee: MOCK_USERS[3],
    roomId: "room-1",
    dueDate: "2024-02-25T00:00:00Z",
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-15T00:00:00Z",
  },
  {
    id: "task-4",
    title: "Set up CI/CD pipeline",
    description: "Configure GitHub Actions for automated testing and deployment",
    status: "PENDING",
    assigneeId: "user-3",
    assignee: MOCK_USERS[2],
    roomId: "room-1",
    dueDate: "2024-03-01T00:00:00Z",
    createdAt: "2024-02-05T00:00:00Z",
    updatedAt: "2024-02-05T00:00:00Z",
  },
  {
    id: "task-5",
    title: "Create social media content",
    description: "Prepare content for LinkedIn, Twitter, and Instagram for the product launch",
    status: "SUBMITTED",
    assigneeId: "user-5",
    assignee: MOCK_USERS[4],
    roomId: "room-2",
    dueDate: "2024-02-22T00:00:00Z",
    createdAt: "2024-02-10T00:00:00Z",
    updatedAt: "2024-02-20T00:00:00Z",
    submittedAt: "2024-02-20T00:00:00Z",
  },
  {
    id: "task-6",
    title: "Email campaign setup",
    description: "Configure email templates and automation workflows in Mailchimp",
    status: "IN_PROGRESS",
    assigneeId: "user-4",
    assignee: MOCK_USERS[3],
    roomId: "room-2",
    dueDate: "2024-02-28T00:00:00Z",
    createdAt: "2024-02-12T00:00:00Z",
    updatedAt: "2024-02-19T00:00:00Z",
  },
  {
    id: "task-7",
    title: "Respond to priority tickets",
    description: "Handle all high-priority customer support tickets from this week",
    status: "REJECTED",
    assigneeId: "user-3",
    assignee: MOCK_USERS[2],
    roomId: "room-3",
    dueDate: "2024-02-18T00:00:00Z",
    createdAt: "2024-02-15T00:00:00Z",
    updatedAt: "2024-02-17T00:00:00Z",
    rejectedAt: "2024-02-17T00:00:00Z",
    rejectionNote: "Need more detailed responses with specific resolution steps for each ticket.",
  },
  {
    id: "task-8",
    title: "Create component library",
    description: "Build reusable UI components following the design system guidelines",
    status: "PENDING",
    assigneeId: "user-5",
    assignee: MOCK_USERS[4],
    roomId: "room-4",
    dueDate: "2024-03-05T00:00:00Z",
    createdAt: "2024-02-20T00:00:00Z",
    updatedAt: "2024-02-20T00:00:00Z",
  },
];

// Mock room members
export const MOCK_ROOM_MEMBERS: Record<string, RoomMember[]> = {
  "room-1": [
    { id: "rm-1", userId: "user-1", user: MOCK_USERS[0], roomId: "room-1", role: "ADMIN", joinedAt: "2024-01-01T00:00:00Z" },
    { id: "rm-2", userId: "user-2", user: MOCK_USERS[1], roomId: "room-1", role: "LEADER", joinedAt: "2024-01-02T00:00:00Z" },
    { id: "rm-3", userId: "user-3", user: MOCK_USERS[2], roomId: "room-1", role: "MEMBER", joinedAt: "2024-01-05T00:00:00Z" },
    { id: "rm-4", userId: "user-4", user: MOCK_USERS[3], roomId: "room-1", role: "MEMBER", joinedAt: "2024-01-10T00:00:00Z" },
    { id: "rm-5", userId: "user-5", user: MOCK_USERS[4], roomId: "room-1", role: "MEMBER", joinedAt: "2024-01-15T00:00:00Z" },
  ],
  "room-2": [
    { id: "rm-6", userId: "user-1", user: MOCK_USERS[0], roomId: "room-2", role: "ADMIN", joinedAt: "2024-01-15T00:00:00Z" },
    { id: "rm-7", userId: "user-4", user: MOCK_USERS[3], roomId: "room-2", role: "MEMBER", joinedAt: "2024-01-20T00:00:00Z" },
    { id: "rm-8", userId: "user-5", user: MOCK_USERS[4], roomId: "room-2", role: "MEMBER", joinedAt: "2024-01-22T00:00:00Z" },
  ],
  "room-3": [
    { id: "rm-9", userId: "user-2", user: MOCK_USERS[1], roomId: "room-3", role: "LEADER", joinedAt: "2024-02-01T00:00:00Z" },
    { id: "rm-10", userId: "user-3", user: MOCK_USERS[2], roomId: "room-3", role: "MEMBER", joinedAt: "2024-02-05T00:00:00Z" },
  ],
  "room-4": [
    { id: "rm-11", userId: "user-1", user: MOCK_USERS[0], roomId: "room-4", role: "ADMIN", joinedAt: "2024-02-15T00:00:00Z" },
    { id: "rm-12", userId: "user-5", user: MOCK_USERS[4], roomId: "room-4", role: "MEMBER", joinedAt: "2024-02-18T00:00:00Z" },
  ],
};

// Dashboard stats calculator
export function calculateDashboardStats(tasks: Task[], userId?: string): DashboardStats {
  const userTasks = userId ? tasks.filter(t => t.assigneeId === userId) : tasks;
  
  return {
    totalTasks: userTasks.length,
    pendingApprovals: tasks.filter(t => t.status === "SUBMITTED").length,
    completedTasks: userTasks.filter(t => t.status === "APPROVED").length,
    inProgressTasks: userTasks.filter(t => t.status === "IN_PROGRESS").length,
  };
}
