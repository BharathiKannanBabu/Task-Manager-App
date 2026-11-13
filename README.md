# 🌊 Liquid Flow — Apple Liquid Glass Task Manager

A complete, production-ready, full-stack Task Management application featuring an Apple-inspired **Liquid Glass (Glassmorphism)** design system, full MERN stack architecture, TypeScript, JWT authentication, real-time analytics, interactive Kanban drag-and-drop, interactive calendar, and rich task organization.

---

## 💎 Features & Highlights

### 1. Liquid Glass Design System (Apple-Inspired)
- **Multi-layer Glass Surfaces**: Translucent cards, modals, and navigation bars with calibrated `backdrop-blur-xl`, `backdrop-blur-2xl`, and specular highlight glares.
- **Dynamic Ambient Liquid Orbs**: Floating animated fluid gradient orbs behind the glass that illuminate and refract through components in both Light and Dark modes.
- **Three-Way Theme System**:
  - **Light Mode**: Translucent frosted surfaces, soft neutral pearl background, subtle specular highlights, high-contrast typography.
  - **Dark Mode**: Deep midnight obsidian canvas, smoky dark translucent glass, subtle glowing borders, crisp white typography.
  - **System Default**: Automatically syncs with OS theme preferences (`prefers-color-scheme`).
  - Persisted dynamically in `localStorage`.

### 2. Comprehensive Task Management (Full CRUD)
- **Fields**: Title, Description, Category, Priority (Low, Medium, High, Urgent 🔥), Status (To Do, In Progress, Review, Completed), Start Date, Due Date, Tags, Subtasks with interactive checkboxes, Notes/Scratchpad.
- **Actions**:
  - Create, view, edit, and delete tasks.
  - Toggle subtasks with instant reactive persistence.
  - Quick-complete with celebratory **canvas-confetti** particle bursts.
  - Search across titles, descriptions, categories, and tags.
  - Multi-criteria filter: by Category, Priority, Status, and Tags.
  - Sorting: by creation date, due date, priority, and alphabetical order.
  - Grid & List view layout toggling.

### 3. Multiple Workflow Views
- **Productivity Dashboard**:
  - Live greeting banner with real-time digital clock and current date.
  - Liquid glass statistic cards: Total Tasks, Completed Tasks, Pending Tasks, Overdue Tasks, Today's Focus.
  - Radial completion progress ring.
  - Interactive SVG Weekly Productivity Chart displaying completions over the last 7 days.
  - Upcoming deadlines list with countdown alerts.
  - Real-time recent activity stream.
- **All Tasks & Filtered Views**:
  - All Tasks
  - Today's Tasks
  - Upcoming Tasks
  - Completed Tasks Archive
  - Overdue Tasks Alert View
- **Interactive Kanban Board**:
  - 4 workflow phases: To Do, In Progress, Review, Completed.
  - Native HTML5 Drag-and-Drop task card movement between columns.
  - Column counter badges and quick task creation within columns.
- **Interactive Calendar**:
  - Monthly, Weekly, and Daily view modes.
  - Due-date task pills with overdue status badges.
  - Previous/Next navigation and quick "Today" snap.
  - Click any day to inspect tasks; click a task pill to open its detail drawer.

### 4. Custom Categories & Priority Management
- Default categories: `Personal`, `Work`, `Development`, `Meetings`, `Learning`, `Shopping`, `Other`.
- Custom category creator modal with custom color themes.
- Delete custom categories with automatic synchronization.

### 5. In-App Notification Center
- Bell notification popup with real-time unread counter badge.
- Automatic notifications on:
  - Upcoming deadlines within 24 hours.
  - Overdue task alerts.
  - Task completion celebrations.
  - System updates.
- Actions: Mark as read, mark all read, clear all notifications.

### 6. Authentication & User Profile
- User Registration & Login with JWT Bearer authentication.
- Password hashing using `bcryptjs`.
- Strict user data isolation: each user accesses only their own tasks, categories, and notifications.
- **One-Click Live Demo Access**: Instant demo account login preloaded with rich sample tasks and notifications.
- Profile management: Update Full Name, Bio, Avatar URL, and Change Password.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with Vite & TypeScript
- **Styling**: Tailwind CSS with custom Liquid Glass utility classes
- **Motion & Interactions**: Framer Motion
- **Icons**: Lucide React
- **State Management**: Zustand
- **Date Handling**: date-fns
- **HTTP Client**: Axios with JWT interceptors
- **Visual Feedback**: canvas-confetti

### Backend
- **Runtime**: Node.js & Express.js with TypeScript (`tsx`)
- **Database**: MongoDB with Mongoose ODM
- **Zero-Config In-Memory Engine**: `mongodb-memory-server` fallback for instant out-of-the-box local development without requiring an external MongoDB service, while seamlessly connecting to any external `MONGODB_URI` when provided.
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
- **Validation**: Zod schema validation
- **Security**: CORS, parameterized queries, and environment variable isolation

---

## 📁 Project Structure

```
Task-Manager-App/
├── server/
│   ├── src/
│   │   ├── config/          # Database & environment configurations
│   │   ├── models/          # Mongoose models (User, Task, Category, Notification)
│   │   ├── controllers/     # API controllers (Auth, Task, Category, Notification, Stats)
│   │   ├── routes/          # Express route definitions
│   │   ├── middleware/      # Auth & error handling middlewares
│   │   ├── utils/           # JWT & sample data seeder
│   │   └── server.ts        # Express entrypoint
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/          # GlassCard, LiquidBackground, Badge, Modal
│   │   │   ├── layout/      # Navbar, Sidebar, MobileNav, ThemeSwitcher
│   │   │   ├── dashboard/   # WelcomeBanner, StatCards, WeeklyChart, Deadlines, Activity
│   │   │   ├── tasks/       # TaskCard, TaskFilterBar, TaskListView, TaskDetailModal, CreateTaskModal
│   │   │   ├── kanban/      # KanbanBoard with drag-and-drop
│   │   │   ├── calendar/    # CalendarView (Month / Week / Day)
│   │   │   ├── notifications/ # NotificationPopover
│   │   │   ├── profile/     # ProfileModal
│   │   │   └── auth/        # AuthScreen with Demo Access
│   │   ├── services/        # API service clients
│   │   ├── store/           # Zustand stores (Task, Auth, Theme, Notification)
│   │   ├── styles/          # globals.css & liquid glass design rules
│   │   ├── types/           # TypeScript interfaces & types
│   │   ├── App.tsx          # Root application component
│   │   └── main.tsx         # React root
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
├── package.json             # Root monorepo orchestrator
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### 1. Install Dependencies
From the repository root:
```bash
npm run install:all
```
*(or run `npm install` inside both `/server` and `/client`)*

### 2. Configure Environment Variables
In the `server` directory, copy `.env.example` to `.env`:
```bash
cp server/.env.example server/.env
```
Default `.env` configuration:
```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/liquid_task_manager
JWT_SECRET=liquid_glass_super_secret_jwt_key_2026_apple_inspired
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```
> **Note**: If you don't have a local or remote MongoDB running, the server automatically starts an embedded in-memory MongoDB instance for seamless instant zero-config testing!

### 3. Run the Development Servers
From the root directory:
```bash
npm run dev
```
Or start them individually:
```bash
# Terminal 1 - Backend API Server (Port 5001)
npm run dev:server

# Terminal 2 - Frontend Vite Application (Port 5173)
npm run dev:client
```

Open **`http://localhost:5173`** in your browser.

---

## ⚡ Instant Demo Access
When the login screen loads, click **"Launch Live Demo Workspace"** to immediately sign into a preconfigured workspace with populated sample tasks, categories, overdue alerts, and productivity metrics.

Or create a new account with your own credentials!

---

## ⌨️ Keyboard Shortcuts
- `Cmd + K` or `Ctrl + K`: Quickly open the **New Task** modal from anywhere.
- `/`: Focus search input to find tasks rapidly.
- `Escape`: Close any open modal or drawer.

---

## 🧪 Production Build
To test the production builds:
```bash
npm run build
```
Both the TypeScript backend and frontend bundle compile cleanly without warnings or errors.
