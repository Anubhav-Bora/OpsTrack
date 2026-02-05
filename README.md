# OpsTrack

A comprehensive task management and collaboration platform designed for development teams. Built with React, TypeScript, TanStack Query, Redux Toolkit, Node.js, Express, Prisma, and PostgreSQL. OpsTrack enables teams to organize work into rooms, assign role-based tasks, track dependencies, and manage approvals with a clean, modern interface.

## 🌐 Live Demo

- **Frontend**: [https://ops-frontend-amber.vercel.app](https://ops-frontend-amber.vercel.app)
- **Backend API**: [https://ops-track-ashen.vercel.app](https://ops-track-ashen.vercel.app)

## ✨ Features

### Core Functionality
- **Room-Based Organization**: Create and manage project rooms with team members
- **Role-Based Task Assignment**: Assign tasks based on user roles (Admin, Backend, Frontend, DevOps, Cybersecurity)
- **Task Dependencies**: Define task prerequisites and track blocking relationships
- **Approval Workflow**: Submit tasks for review and approval by room leaders/admins
- **Task Status Tracking**: Monitor progress through multiple states (Pending, In Progress, Submitted, Approved, Rejected)
- **User Statistics**: View comprehensive stats for task completion and performance
- **Real-time Updates**: Automatic polling for task and room updates

### User Management
- **Authentication**: Secure JWT-based authentication
- **Role-Based Access Control**: Different permissions for room leaders, admins, and members
- **User Profiles**: Track user information and assigned roles

### Task Management
- **Create & Edit Tasks**: Full CRUD operations with rich task details
- **Task Dependencies**: Visual dependency tracking and validation
- **Status Management**: Update task status with proper workflow validation
- **Rejection Handling**: Provide feedback when rejecting submitted tasks
- **Due Date Tracking**: Set and monitor task deadlines

## 🛠️ Technology Stack

### Frontend
- **React 18.3.1** - UI library
- **TypeScript 5.8.3** - Type safety
- **Vite 5.4.19** - Build tool and dev server
- **React Router DOM 6.30.1** - Client-side routing
- **Redux Toolkit 2.11.2** - State management
- **TanStack Query 5.90.20** - Server state management and caching
- **Axios 1.13.4** - HTTP client
- **React Hook Form 7.61.1** - Form handling
- **Zod 3.25.76** - Schema validation

### UI Components & Styling
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - Pre-built component library
- **Lucide React 0.462.0** - Icon library
- **class-variance-authority** - Component variant management
- **tailwind-merge** - Tailwind class merging utility

### Backend
- **Node.js** - Runtime environment
- **Express 5.2.1** - Web framework
- **TypeScript** - Type safety
- **Prisma 7.3.0** - ORM and database toolkit
- **PostgreSQL** - Database (via Neon)
- **JWT (jsonwebtoken 9.0.3)** - Authentication
- **bcryptjs 3.0.3** - Password hashing
- **Zod 3.23.8** - Schema validation
- **CORS 2.8.6** - Cross-origin resource sharing

### Database
- **PostgreSQL** - Primary database
- **Neon** - Serverless Postgres hosting
- **Prisma Client** - Type-safe database client
- **Prisma Migrate** - Database migrations

### DevOps & Deployment
- **Vercel** - Hosting platform for both frontend and backend
- **Git** - Version control
- **pnpm** - Package manager
- **dotenv** - Environment variable management

### Development Tools
- **ESLint** - Code linting
- **Vitest** - Unit testing
- **Testing Library** - React component testing
- **Nodemon** - Development server auto-reload
- **ts-node** - TypeScript execution

## 📁 Project Structure

```
OpsTrack/
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Common/      # Shared components
│   │   │   ├── Room/        # Room-related components
│   │   │   ├── Task/        # Task-related components
│   │   │   └── ui/          # shadcn/ui components
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   ├── store/           # Redux store and slices
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── repositories/    # Data access layer
│   │   ├── routes/          # API routes
│   │   ├── middlewares/     # Express middlewares
│   │   └── utils/           # Utility functions
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   ├── migrations/      # Database migrations
│   │   └── seed.ts          # Database seeding
│   ├── api/
│   │   └── index.ts         # Vercel serverless entry
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- PostgreSQL database (or Neon account)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pnpm install
```

3. Create `.env` file:
```env
DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="your_secret_key"
FRONTEND_URL="http://localhost:5173"
```

4. Run database migrations:
```bash
pnpm prisma migrate dev
```

5. Seed the database (optional):
```bash
# OpsTrack

OpsTrack is a simple, modern task management and collaboration platform for development teams.

## 🚀 Technologies Used

**Frontend:**
- React
- TypeScript
- Vite
- Redux Toolkit
- TanStack Query
- Tailwind CSS, shadcn/ui, Radix UI

**Backend:**
- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL (Neon)

**Other:**
- JWT Auth, pnpm, Vercel

**Real-time updates:**
Polling is used for real-time updates (instead of WebSockets) for Vercel compatibility. WebSocket support can be added if needed.

---

## ✨ Features

- Room-based project organization
- Role-based task assignment
- Task dependencies and approvals
- User authentication (JWT)
- Modern UI with responsive design

---

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- PostgreSQL database (or Neon)

### Backend Setup
```sh
cd backend
pnpm install
# Set up .env (see .env.example)
pnpm prisma migrate dev
pnpm dev
```

### Frontend Setup
```sh
cd frontend
pnpm install
# Set up .env.development (see .env.example)
pnpm dev
```

---

## Project Structure

frontend/ - React app
backend/  - Node.js API & Prisma

---

## License

ISC License. Built with ❤️ by the OpsTrack team.
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/:id/stats` - Get user statistics

### Rooms
- `GET /api/rooms` - List user's rooms
- `POST /api/rooms` - Create new room
- `GET /api/rooms/:id` - Get room details
- `PUT /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id` - Delete room

### Tasks
- `GET /api/tasks` - List tasks (with filters)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/status` - Update task status

### Room Members
- `POST /api/room-members` - Add member to room
- `DELETE /api/room-members/:id` - Remove member from room

### Task Dependencies
- `POST /api/task-dependencies` - Add task dependency
- `DELETE /api/task-dependencies/:id` - Remove dependency

## 🎨 UI Components

Built with shadcn/ui and Radix UI primitives:
- Modals and Dialogs
- Forms with validation
- Data tables
- Toast notifications
- Badges and status indicators
- Loading states
- Empty states
- Responsive navigation

## 🔄 State Management

- **Redux Toolkit**: Global state for auth, rooms, and tasks
- **TanStack Query**: Server state caching and synchronization
- **React Context**: Theme and authentication context
- **Local Storage**: Persistent auth tokens

## 🧪 Testing

```bash
# Frontend tests
cd frontend
pnpm test

# Watch mode
pnpm test:watch
```

## 📦 Deployment

### Vercel Deployment

Both frontend and backend are deployed on Vercel:

**Backend Environment Variables:**
- `DATABASE_URL`
- `JWT_SECRET`
- `FRONTEND_URL`

**Frontend Environment Variables:**
- `VITE_API_URL`

### Build Commands

```bash
# Frontend
pnpm build

# Backend (handled by Vercel)
# Uses api/index.ts as serverless function
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

Built with ❤️ by the OpsTrack team

## 🐛 Known Issues

- None currently reported

## 🗺️ Roadmap

- [ ] Real-time notifications with WebSockets
- [ ] File attachments for tasks
- [ ] Task comments and discussions
- [ ] Advanced filtering and search
- [ ] Email notifications
- [ ] Mobile app
- [ ] Task templates
- [ ] Time tracking
- [ ] Analytics dashboard

## 📞 Support

For support, please open an issue in the GitHub repository.
