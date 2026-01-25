# Notium - AI-Powered Note Taking Application

A modern, full-stack note-taking application inspired by Apple Notes, with AI-powered features for content generation and assistance.

## Features

- 📝 Rich text editing with TipTap
- 🤖 AI-powered content generation (OpenAI integration)
- 📁 Folder organization
- 🔍 Full-text search
- 💾 Offline-first with IndexedDB
- 📤 Export notes as Markdown, Text, or HTML
- 🎨 Beautiful, responsive UI with dark mode support
- 🔄 Real-time sync (backend ready)

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- TipTap (Rich text editor)
- Zustand (State management)
- Dexie.js (IndexedDB)
- Framer Motion (Animations)
- OpenAI API

### Backend
- Node.js + TypeScript
- Express.js
- PostgreSQL + Prisma ORM
- JWT Authentication
- Redis (Caching)
- OpenAI API Integration

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Redis 7+ (optional)
- OpenAI API Key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Notium
```

2. Install dependencies:
```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

3. Set up environment variables:

**Frontend** (`frontend/.env`):
```env
VITE_OPENAI_API_KEY=your_api_key_here
VITE_API_URL=http://localhost:8000/api/v1
```

**Backend** (`backend/.env`):
```env
DATABASE_URL=postgresql://user:password@localhost:5432/notium
JWT_SECRET=your-secret-key
OPENAI_API_KEY=your_api_key_here
REDIS_URL=redis://localhost:6379
FRONTEND_URL=http://localhost:3000
```

4. Set up the database:
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

5. Run the development servers:

```bash
# From root directory
npm run dev

# Or separately:
# Frontend
cd frontend && npm run dev

# Backend
cd backend && npm run dev
```

## Project Structure

```
Notium/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── hooks/       # Custom hooks
│   │   ├── store/       # Zustand store
│   │   ├── services/    # API services
│   │   ├── utils/       # Utility functions
│   │   └── db/          # IndexedDB setup
│   └── ...
├── backend/           # Node.js backend API
│   ├── src/
│   │   ├── controllers/ # Route controllers
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   ├── middleware/  # Express middleware
│   │   └── lib/         # Prisma client
│   └── prisma/         # Database schema
└── ...
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user

### Notes
- `GET /api/v1/notes` - Get all notes (paginated)
- `POST /api/v1/notes` - Create note
- `GET /api/v1/notes/:id` - Get note by ID
- `PUT /api/v1/notes/:id` - Update note
- `DELETE /api/v1/notes/:id` - Delete note
- `PATCH /api/v1/notes/:id/pin` - Toggle pin
- `PATCH /api/v1/notes/:id/favorite` - Toggle favorite

### Folders
- `GET /api/v1/folders` - Get all folders
- `POST /api/v1/folders` - Create folder
- `PUT /api/v1/folders/:id` - Update folder
- `DELETE /api/v1/folders/:id` - Delete folder

### AI
- `POST /api/v1/ai/generate` - Generate content
- `POST /api/v1/ai/improve` - Improve text
- `POST /api/v1/ai/summarize` - Summarize text
- `POST /api/v1/ai/translate` - Translate text
- `POST /api/v1/ai/answer` - Answer question
- `GET /api/v1/ai/usage` - Get usage stats

## Development

### Frontend
```bash
cd frontend
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Run ESLint
```

### Backend
```bash
cd backend
npm run dev      # Start dev server with hot reload
npm run build    # Build TypeScript
npm run db:migrate # Run database migrations
npm run db:studio # Open Prisma Studio
```

## License

MIT
