# Task Management Application

A modern, responsive task management web application built with Next.js, TypeScript, and React Query. This application provides an intuitive interface for managing tasks with support for both Kanban board and list views.

## 🚀 Features

- **Dual View Modes**: Switch between Kanban board (drag-and-drop) and paginated list view
- **CRUD Operations**: Create, Read, Update, and Delete tasks
- **Real-time Updates**: Optimistic UI updates with React Query
- **Drag & Drop**: Intuitive drag-and-drop functionality in Kanban view using @dnd-kit
- **Filtering & Pagination**: Filter tasks by status and paginate through large datasets
- **Toast Notifications**: Real-time feedback using Sonner
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript support throughout the application
- **Server-Side Rendering**: Next.js App Router with SSR support

## 📋 Requirements

- Node.js 18+ or Bun 1.0+
- Backend API running (see API Configuration below)

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **State Management**: React Query (TanStack Query)
- **Drag & Drop**: @dnd-kit
- **Form Handling**: React Hook Form + Zod validation
- **Notifications**: Sonner
- **Icons**: Lucide React

## 📦 Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd corenglish-frontend-test
```

2. Install dependencies:

```bash
bun install
# or
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Configure the API URL in `.env.local`:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-api-url.com
```

## 🚀 Getting Started

Run the development server:

```bash
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🔧 API Configuration

The application requires a backend API with the following endpoints:

- `GET /tasks` - Fetch all tasks (supports query params: `?page=1&limit=10&status=TO_DO`)
- `GET /tasks/:id` - Fetch a single task
- `POST /tasks` - Create a new task
- `PATCH /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

Configure the backend API URL in your environment variables:

```bash
NEXT_PUBLIC_API_URL=https://be-corenglish-production.up.railway.app
```

## 📱 Features Overview

### Task List View

- Paginated list of all tasks
- Filter by status (TO_DO, IN_PROGRESS, DONE)
- Adjustable items per page (6, 12, 24, 60)
- Quick actions: Edit and Delete

### Kanban Board View

- Three columns: To Do, In Progress, Done
- Drag-and-drop tasks between columns
- Visual feedback with hover states
- Task count badges

### Task Management

- **Create Task**: Add new tasks with title and description
- **Edit Task**: Update task details and status
- **Delete Task**: Remove tasks with confirmation dialog
- **Status Updates**: Change task status via drag-and-drop or form

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── tasks/             # Task-related pages
│   │   ├── create/        # Create task page
│   │   ├── edit/[id]/     # Edit task page
│   │   ├── page.tsx       # Task list page (SSR)
│   │   └── client-page.tsx # Client-side task list
│   └── layout.tsx         # Root layout with providers
├── components/            # React components
│   ├── tasks/            # Task-specific components
│   │   ├── KanbanBoard.tsx
│   │   ├── TaskList.tsx
│   │   ├── TaskCard.tsx
│   │   ├── TaskForm.tsx
│   │   └── TasksToolbar.tsx
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom React hooks
│   └── react-queries/    # React Query hooks
├── lib/                  # Utility functions
│   ├── fetch.ts          # API client
│   └── query-keys.ts     # Query key factory
├── providers/            # React context providers
│   └── QueryProvider.tsx # React Query provider
├── services/             # API services
│   └── api/
│       └── task.ts       # Task API service
└── types/                # TypeScript type definitions
    └── index.ts
```

## 🎨 Design Decisions

1. **Dual View Architecture**: Implemented both Kanban and List views to satisfy different user preferences and use cases
2. **Optimistic Updates**: React Query's optimistic updates provide instant feedback
3. **Mobile-First**: Responsive design ensures usability across all devices
4. **Type Safety**: Comprehensive TypeScript usage prevents runtime errors
5. **Component Reusability**: Modular components (TaskCard, TaskForm) work in multiple contexts
6. **Server-Side Rendering**: Initial data fetching on the server improves performance and SEO

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Configure environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL
4. Deploy!

The application is optimized for Vercel deployment with:

- Automatic builds with Turbopack
- Edge runtime support
- Environment variable management

**Live Demo**: [Add your deployed Vercel URL here]

## 🧪 Development

### Build for production:

```bash
bun run build
# or
npm run build
```

### Run linting:

```bash
bun run lint
# or
npm run lint
```

## 📝 Environment Variables

| Variable              | Description          | Required |
| --------------------- | -------------------- | -------- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL | Yes      |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is part of a frontend development challenge.

## 👥 Author

[Your Name]

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query)
- [@dnd-kit](https://dndkit.com/)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
