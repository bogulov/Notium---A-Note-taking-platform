# BACKEND.md

## AI-Powered Note Taking Application - Complete Backend Specification

---

## TABLE OF CONTENTS

1. [Backend Architecture Overview](#1-backend-architecture-overview)
2. [Technology Stack](#2-technology-stack)
3. [Database Design](#3-database-design)
4. [API Architecture](#4-api-architecture)
5. [Authentication & Authorization](#5-authentication--authorization)
6. [Real-time Synchronization](#6-real-time-synchronization)
7. [AI Service Integration](#7-ai-service-integration)
8. [File Storage System](#8-file-storage-system)
9. [Caching Strategy](#9-caching-strategy)
10. [Security Implementation](#10-security-implementation)
11. [Rate Limiting & Throttling](#11-rate-limiting--throttling)
12. [Backup & Recovery](#12-backup--recovery)
13. [Monitoring & Logging](#13-monitoring--logging)
14. [Deployment Architecture](#14-deployment-architecture)
15. [API Documentation](#15-api-documentation)

---

## 1. BACKEND ARCHITECTURE OVERVIEW

### 1.1 Architecture Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                            │
│  (React App + IndexedDB + Service Worker)                   │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ HTTPS/WSS
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                     API GATEWAY                             │
│  - Rate Limiting                                            │
│  - Authentication                                           │
│  - Request Validation                                       │
│  - Load Balancing                                           │
└─────────────────┬───────────────────────────────────────────┘
                  │
        ┌─────────┴─────────┬─────────────┬─────────────┐
        │                   │             │             │
┌───────▼────────┐  ┌──────▼──────┐ ┌───▼──────┐ ┌───▼──────┐
│  Auth Service  │  │ Notes API   │ │ AI Proxy │ │ File API │
│  (Node.js)     │  │ (Node.js)   │ │ Service  │ │ Service  │
└───────┬────────┘  └──────┬──────┘ └───┬──────┘ └───┬──────┘
        │                   │             │             │
        │                   │             │             │
┌───────▼────────┐  ┌──────▼──────┐ ┌───▼──────┐ ┌───▼──────┐
│  PostgreSQL    │  │ PostgreSQL  │ │ OpenAI   │ │   S3     │
│  (Users)       │  │ (Notes)     │ │   API    │ │ (Files)  │
└────────────────┘  └──────┬──────┘ └──────────┘ └──────────┘
                           │
                    ┌──────▼──────┐
                    │    Redis    │
                    │  (Cache)    │
                    └─────────────┘
```

### 1.2 Design Principles

**1. Microservices-Lite Architecture**

- Modular but not fully distributed
- Shared database per domain
- Independent deployment capability

**2. API-First Design**

- RESTful APIs for CRUD operations
- WebSocket for real-time sync
- GraphQL for complex queries (optional)

**3. Offline-First Support**

- Backend accepts delayed syncs
- Conflict resolution on server
- Optimistic UI updates on client

**4. Scalability**

- Horizontal scaling for API servers
- Database read replicas
- CDN for static assets

**5. Security**

- JWT-based authentication
- API key rotation
- Encrypted data at rest
- HTTPS everywhere

---

## 2. TECHNOLOGY STACK

### 2.1 Recommended Stack

```
┌──────────────────────────────────────────────────────────┐
│                   BACKEND STACK                          │
├──────────────────────────────────────────────────────────┤
│ Runtime:          Node.js 20 LTS                         │
│ Framework:        Express.js 4.18+ / Fastify 4.0+        │
│ Language:         TypeScript 5.2+                        │
├──────────────────────────────────────────────────────────┤
│ Database:         PostgreSQL 15+ (Primary)               │
│ ORM:              Prisma 5.0+ / Drizzle ORM              │
│ Cache:            Redis 7.0+                             │
│ Search:           PostgreSQL Full-Text Search            │
├──────────────────────────────────────────────────────────┤
│ File Storage:     AWS S3 / Cloudflare R2                 │
│ CDN:              Cloudflare / AWS CloudFront            │
├──────────────────────────────────────────────────────────┤
│ Auth:             JWT + Passport.js                      │
│ Email:            Resend / SendGrid                      │
│ WebSocket:        Socket.io / WS                         │
├──────────────────────────────────────────────────────────┤
│ Monitoring:       Sentry (Errors)                        │
│ Logging:          Winston / Pino                         │
│ APM:              New Relic / Datadog                    │
├──────────────────────────────────────────────────────────┤
│ Deployment:       Railway / Fly.io / AWS ECS             │
│ CI/CD:            GitHub Actions                         │
│ Containerization: Docker + Docker Compose                │
└──────────────────────────────────────────────────────────┘
```

### 2.2 Why This Stack?

**Node.js + TypeScript**

- ✅ Same language as frontend (code sharing)
- ✅ Excellent async I/O performance
- ✅ Large ecosystem
- ✅ Type safety with TypeScript

**PostgreSQL**

- ✅ ACID compliance
- ✅ JSON support (flexible schema)
- ✅ Full-text search built-in
- ✅ Mature and reliable
- ✅ Better for structured data than MongoDB

**Redis**

- ✅ Sub-millisecond latency
- ✅ Perfect for caching
- ✅ Session storage
- ✅ Rate limiting

**Prisma ORM**

- ✅ Type-safe database client
- ✅ Auto-generated types
- ✅ Migration system
- ✅ Excellent developer experience

---

## 3. DATABASE DESIGN

### 3.1 Schema Design (PostgreSQL)

```sql
-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    subscription_tier VARCHAR(50) DEFAULT 'free',
    ai_tokens_used INTEGER DEFAULT 0,
    ai_tokens_limit INTEGER DEFAULT 100000
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- ============================================
-- EMAIL VERIFICATION TABLE
-- ============================================
CREATE TABLE email_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_email_verifications_token ON email_verifications(token);
CREATE INDEX idx_email_verifications_user ON email_verifications(user_id);

-- ============================================
-- PASSWORD RESET TABLE
-- ============================================
CREATE TABLE password_resets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_password_resets_token ON password_resets(token);

-- ============================================
-- FOLDERS TABLE
-- ============================================
CREATE TABLE folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(7),
    icon VARCHAR(50),
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT unique_user_folder_name UNIQUE(user_id, name, deleted_at)
);

CREATE INDEX idx_folders_user ON folders(user_id);
CREATE INDEX idx_folders_deleted ON folders(deleted_at);

-- ============================================
-- NOTES TABLE
-- ============================================
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
    title VARCHAR(500) NOT NULL,
    content TEXT,
    content_plain TEXT, -- For search
    word_count INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_favorite BOOLEAN DEFAULT FALSE,
    tags TEXT[], -- PostgreSQL array
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    version INTEGER DEFAULT 1, -- For conflict resolution
    client_updated_at TIMESTAMP WITH TIME ZONE, -- Client timestamp
    sync_status VARCHAR(20) DEFAULT 'synced' -- synced, pending, conflict
);

CREATE INDEX idx_notes_user ON notes(user_id);
CREATE INDEX idx_notes_folder ON notes(folder_id);
CREATE INDEX idx_notes_created ON notes(created_at);
CREATE INDEX idx_notes_updated ON notes(updated_at);
CREATE INDEX idx_notes_deleted ON notes(deleted_at);
CREATE INDEX idx_notes_pinned ON notes(is_pinned);
CREATE INDEX idx_notes_tags ON notes USING GIN(tags);

-- Full-text search index
CREATE INDEX idx_notes_search ON notes USING GIN(
    to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(content_plain, ''))
);

-- ============================================
-- NOTE VERSIONS (For History)
-- ============================================
CREATE TABLE note_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500),
    content TEXT,
    version INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_note_versions_note ON note_versions(note_id);
CREATE INDEX idx_note_versions_created ON note_versions(created_at);

-- ============================================
-- ATTACHMENTS TABLE
-- ============================================
CREATE TABLE attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    storage_key TEXT NOT NULL, -- S3 key
    storage_url TEXT NOT NULL,
    thumbnail_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_attachments_note ON attachments(note_id);
CREATE INDEX idx_attachments_user ON attachments(user_id);

-- ============================================
-- SYNC LOG TABLE (For debugging sync issues)
-- ============================================
CREATE TABLE sync_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    device_id VARCHAR(255),
    action VARCHAR(50), -- sync_start, sync_end, conflict_detected
    notes_synced INTEGER DEFAULT 0,
    conflicts_resolved INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sync_logs_user ON sync_logs(user_id);
CREATE INDEX idx_sync_logs_created ON sync_logs(created_at);

-- ============================================
-- AI USAGE TABLE (For tracking costs)
-- ============================================
CREATE TABLE ai_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    note_id UUID REFERENCES notes(id) ON DELETE SET NULL,
    action VARCHAR(100), -- generate, summarize, improve, translate
    prompt_tokens INTEGER NOT NULL,
    completion_tokens INTEGER NOT NULL,
    total_tokens INTEGER NOT NULL,
    model VARCHAR(50),
    cost_usd DECIMAL(10, 6),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ai_usage_user ON ai_usage(user_id);
CREATE INDEX idx_ai_usage_created ON ai_usage(created_at);

-- ============================================
-- SESSIONS TABLE (For device management)
-- ============================================
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    device_name VARCHAR(255),
    device_type VARCHAR(50),
    ip_address INET,
    user_agent TEXT,
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token_hash);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);
```

### 3.2 Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                String    @id @default(uuid())
  email             String    @unique
  passwordHash      String    @map("password_hash")
  fullName          String?   @map("full_name")
  avatarUrl         String?   @map("avatar_url")
  emailVerified     Boolean   @default(false) @map("email_verified")
  createdAt         DateTime  @default(now()) @map("created_at")
  updatedAt         DateTime  @updatedAt @map("updated_at")
  lastLoginAt       DateTime? @map("last_login_at")
  isActive          Boolean   @default(true) @map("is_active")
  subscriptionTier  String    @default("free") @map("subscription_tier")
  aiTokensUsed      Int       @default(0) @map("ai_tokens_used")
  aiTokensLimit     Int       @default(100000) @map("ai_tokens_limit")

  // Relations
  folders           Folder[]
  notes             Note[]
  attachments       Attachment[]
  sessions          Session[]
  aiUsage           AIUsage[]
  syncLogs          SyncLog[]
  noteVersions      NoteVersion[]

  @@index([email])
  @@index([createdAt])
  @@map("users")
}

model Folder {
  id        String    @id @default(uuid())
  userId    String    @map("user_id")
  name      String
  color     String?
  icon      String?
  position  Int       @default(0)
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")
  deletedAt DateTime? @map("deleted_at")

  // Relations
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  notes     Note[]

  @@unique([userId, name, deletedAt])
  @@index([userId])
  @@index([deletedAt])
  @@map("folders")
}

model Note {
  id               String    @id @default(uuid())
  userId           String    @map("user_id")
  folderId         String?   @map("folder_id")
  title            String
  content          String?   @db.Text
  contentPlain     String?   @map("content_plain") @db.Text
  wordCount        Int       @default(0) @map("word_count")
  isPinned         Boolean   @default(false) @map("is_pinned")
  isFavorite       Boolean   @default(false) @map("is_favorite")
  tags             String[]
  createdAt        DateTime  @default(now()) @map("created_at")
  updatedAt        DateTime  @updatedAt @map("updated_at")
  deletedAt        DateTime? @map("deleted_at")
  version          Int       @default(1)
  clientUpdatedAt  DateTime? @map("client_updated_at")
  syncStatus       String    @default("synced") @map("sync_status")

  // Relations
  user             User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  folder           Folder?     @relation(fields: [folderId], references: [id], onDelete: SetNull)
  attachments      Attachment[]
  versions         NoteVersion[]
  aiUsage          AIUsage[]

  @@index([userId])
  @@index([folderId])
  @@index([createdAt])
  @@index([updatedAt])
  @@index([deletedAt])
  @@index([isPinned])
  @@map("notes")
}

model NoteVersion {
  id        String   @id @default(uuid())
  noteId    String   @map("note_id")
  userId    String   @map("user_id")
  title     String?
  content   String?  @db.Text
  version   Int
  createdAt DateTime @default(now()) @map("created_at")

  // Relations
  note      Note     @relation(fields: [noteId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([noteId])
  @@index([createdAt])
  @@map("note_versions")
}

model Attachment {
  id           String   @id @default(uuid())
  noteId       String   @map("note_id")
  userId       String   @map("user_id")
  filename     String
  fileSize     BigInt   @map("file_size")
  mimeType     String   @map("mime_type")
  storageKey   String   @map("storage_key")
  storageUrl   String   @map("storage_url")
  thumbnailUrl String?  @map("thumbnail_url")
  createdAt    DateTime @default(now()) @map("created_at")

  // Relations
  note         Note     @relation(fields: [noteId], references: [id], onDelete: Cascade)
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([noteId])
  @@index([userId])
  @@map("attachments")
}

model Session {
  id            String   @id @default(uuid())
  userId        String   @map("user_id")
  tokenHash     String   @map("token_hash")
  deviceName    String?  @map("device_name")
  deviceType    String?  @map("device_type")
  ipAddress     String?  @map("ip_address")
  userAgent     String?  @map("user_agent") @db.Text
  lastActiveAt  DateTime @default(now()) @map("last_active_at")
  expiresAt     DateTime @map("expires_at")
  createdAt     DateTime @default(now()) @map("created_at")

  // Relations
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([tokenHash])
  @@index([expiresAt])
  @@map("sessions")
}

model AIUsage {
  id               String   @id @default(uuid())
  userId           String   @map("user_id")
  noteId           String?  @map("note_id")
  action           String
  promptTokens     Int      @map("prompt_tokens")
  completionTokens Int      @map("completion_tokens")
  totalTokens      Int      @map("total_tokens")
  model            String?
  costUsd          Decimal? @map("cost_usd") @db.Decimal(10, 6)
  createdAt        DateTime @default(now()) @map("created_at")

  // Relations
  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  note             Note?    @relation(fields: [noteId], references: [id], onDelete: SetNull)

  @@index([userId])
  @@index([createdAt])
  @@map("ai_usage")
}

model SyncLog {
  id                 String   @id @default(uuid())
  userId             String   @map("user_id")
  deviceId           String?  @map("device_id")
  action             String
  notesSynced        Int      @default(0) @map("notes_synced")
  conflictsResolved  Int      @default(0) @map("conflicts_resolved")
  errorMessage       String?  @map("error_message") @db.Text
  createdAt          DateTime @default(now()) @map("created_at")

  // Relations
  user               User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([createdAt])
  @@map("sync_logs")
}
```

### 3.3 Database Indexes Strategy

**Query Patterns:**

1. Get all notes for a user (most common)
2. Search notes by text
3. Get notes in a folder
4. Get pinned/favorite notes
5. Sync changes since timestamp

**Optimization:**

```sql
-- Composite index for common queries
CREATE INDEX idx_notes_user_updated ON notes(user_id, updated_at DESC);
CREATE INDEX idx_notes_user_folder ON notes(user_id, folder_id);
CREATE INDEX idx_notes_user_pinned ON notes(user_id, is_pinned) WHERE is_pinned = TRUE;

-- Partial index for deleted notes
CREATE INDEX idx_notes_deleted_user ON notes(user_id, deleted_at) WHERE deleted_at IS NOT NULL;
```

---

## 4. API ARCHITECTURE

### 4.1 RESTful API Endpoints

```
BASE URL: https://api.notesapp.com/v1

┌─────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION                           │
├─────────────────────────────────────────────────────────────┤
POST   /auth/register          - Register new user
POST   /auth/login             - Login user
POST   /auth/logout            - Logout (invalidate token)
POST   /auth/refresh           - Refresh access token
POST   /auth/verify-email      - Verify email with token
POST   /auth/forgot-password   - Request password reset
POST   /auth/reset-password    - Reset password with token
GET    /auth/me                - Get current user
├─────────────────────────────────────────────────────────────┤
│                        FOLDERS                              │
├─────────────────────────────────────────────────────────────┤
GET    /folders                - Get all folders
POST   /folders                - Create folder
GET    /folders/:id            - Get folder by ID
PUT    /folders/:id            - Update folder
DELETE /folders/:id            - Delete folder (soft)
POST   /folders/:id/restore    - Restore deleted folder
├─────────────────────────────────────────────────────────────┤
│                         NOTES                               │
├─────────────────────────────────────────────────────────────┤
GET    /notes                  - Get all notes (paginated)
POST   /notes                  - Create note
GET    /notes/:id              - Get note by ID
PUT    /notes/:id              - Update note
DELETE /notes/:id              - Delete note (soft delete)
POST   /notes/:id/restore      - Restore deleted note
PATCH  /notes/:id/pin          - Toggle pin status
PATCH  /notes/:id/favorite     - Toggle favorite status
GET    /notes/:id/versions     - Get note version history
POST   /notes/:id/revert       - Revert to specific version
├─────────────────────────────────────────────────────────────┤
│                      SYNC API                               │
├─────────────────────────────────────────────────────────────┤
POST   /sync/pull              - Pull changes from server
POST   /sync/push              - Push changes to server
GET    /sync/status            - Get sync status
POST   /sync/resolve-conflict  - Resolve sync conflict
├─────────────────────────────────────────────────────────────┤
│                      SEARCH                                 │
├─────────────────────────────────────────────────────────────┤
GET    /search                 - Full-text search notes
GET    /search/suggestions     - Search suggestions
├─────────────────────────────────────────────────────────────┤
│                      AI PROXY                               │
├─────────────────────────────────────────────────────────────┤
POST   /ai/generate            - Generate content
POST   /ai/improve             - Improve text
POST   /ai/summarize           - Summarize text
POST   /ai/translate           - Translate text
POST   /ai/answer              - Answer question
GET    /ai/usage               - Get AI usage stats
├─────────────────────────────────────────────────────────────┤
│                      ATTACHMENTS                            │
├─────────────────────────────────────────────────────────────┤
POST   /attachments/upload     - Upload file
GET    /attachments/:id        - Get attachment
DELETE /attachments/:id        - Delete attachment
GET    /attachments/note/:id   - Get all note attachments
├─────────────────────────────────────────────────────────────┤
│                      USER SETTINGS                          │
├─────────────────────────────────────────────────────────────┤
GET    /user/profile           - Get user profile
PUT    /user/profile           - Update profile
GET    /user/settings          - Get settings
PUT    /user/settings          - Update settings
GET    /user/sessions          - Get active sessions
DELETE /user/sessions/:id      - Revoke session
POST   /user/export            - Export all data
DELETE /user/account           - Delete account
└─────────────────────────────────────────────────────────────┘
```

### 4.2 API Request/Response Format

**Standard Response Structure:**

```typescript
// Success Response
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful",
  "timestamp": "2024-01-24T10:30:00Z"
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "timestamp": "2024-01-24T10:30:00Z"
}

// Paginated Response
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### 4.3 Example API Implementations

```typescript
// src/routes/notes.routes.ts
import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import { createNoteSchema, updateNoteSchema } from "../schemas/note.schema";
import * as notesController from "../controllers/notes.controller";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get all notes with pagination and filters
router.get("/", notesController.getAllNotes);

// Create new note
router.post("/", validate(createNoteSchema), notesController.createNote);

// Get note by ID
router.get("/:id", notesController.getNoteById);

// Update note
router.put("/:id", validate(updateNoteSchema), notesController.updateNote);

// Delete note (soft delete)
router.delete("/:id", notesController.deleteNote);

// Restore deleted note
router.post("/:id/restore", notesController.restoreNote);

// Toggle pin status
router.patch("/:id/pin", notesController.togglePin);

// Get version history
router.get("/:id/versions", notesController.getVersions);

export default router;
```

```typescript
// src/controllers/notes.controller.ts
import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { stripHtml } from "../utils/htmlUtils";

export const getAllNotes = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const {
      page = 1,
      limit = 20,
      folderId,
      pinned,
      favorite,
      search,
      sortBy = "updatedAt",
      sortOrder = "desc",
    } = req.query;

    // Build where clause
    const where: any = {
      userId,
      deletedAt: null,
    };

    if (folderId) where.folderId = folderId as string;
    if (pinned === "true") where.isPinned = true;
    if (favorite === "true") where.isFavorite = true;
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: "insensitive" } },
        { contentPlain: { contains: search as string, mode: "insensitive" } },
      ];
    }

    // Execute query with pagination
    const [notes, total] = await Promise.all([
      prisma.note.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { [sortBy as string]: sortOrder },
        select: {
          id: true,
          title: true,
          contentPlain: true,
          wordCount: true,
          isPinned: true,
          isFavorite: true,
          tags: true,
          createdAt: true,
          updatedAt: true,
          folder: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
        },
      }),
      prisma.note.count({ where }),
    ]);

    return res.json(
      new ApiResponse({
        data: {
          items: notes,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit)),
            hasNext: Number(page) * Number(limit) < total,
            hasPrev: Number(page) > 1,
          },
        },
        message: "Notes fetched successfully",
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const createNote = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const { title, content, folderId, tags } = req.body;

    // Strip HTML for plain text search
    const contentPlain = stripHtml(content || "");
    const wordCount = contentPlain.split(/\s+/).filter(Boolean).length;

    const note = await prisma.note.create({
      data: {
        userId,
        title: title || "Untitled Note",
        content,
        contentPlain,
        wordCount,
        folderId,
        tags: tags || [],
        version: 1,
      },
      include: {
        folder: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });

    return res.status(201).json(
      new ApiResponse({
        data: note,
        message: "Note created successfully",
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { title, content, folderId, tags } = req.body;

    // Check if note exists and belongs to user
    const existingNote = await prisma.note.findFirst({
      where: { id, userId, deletedAt: null },
    });

    if (!existingNote) {
      throw new ApiError(404, "Note not found");
    }

    // Create version history
    await prisma.noteVersion.create({
      data: {
        noteId: id,
        userId,
        title: existingNote.title,
        content: existingNote.content,
        version: existingNote.version,
      },
    });

    // Update note
    const contentPlain = content
      ? stripHtml(content)
      : existingNote.contentPlain;
    const wordCount = contentPlain
      ? contentPlain.split(/\s+/).filter(Boolean).length
      : 0;

    const updatedNote = await prisma.note.update({
      where: { id },
      data: {
        title,
        content,
        contentPlain,
        wordCount,
        folderId,
        tags,
        version: existingNote.version + 1,
      },
      include: {
        folder: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });

    return res.json(
      new ApiResponse({
        data: updatedNote,
        message: "Note updated successfully",
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const note = await prisma.note.findFirst({
      where: { id, userId, deletedAt: null },
    });

    if (!note) {
      throw new ApiError(404, "Note not found");
    }

    // Soft delete
    await prisma.note.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return res.json(
      new ApiResponse({
        data: { id },
        message: "Note deleted successfully",
      }),
    );
  } catch (error) {
    next(error);
  }
};
```

---

## 5. AUTHENTICATION & AUTHORIZATION

### 5.1 JWT-Based Authentication

```typescript
// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/ApiError";

interface JWTPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Authentication required");
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        isActive: true,
        subscriptionTier: true,
        aiTokensUsed: true,
        aiTokensLimit: true,
      },
    });

    if (!user || !user.isActive) {
      throw new ApiError(401, "Invalid authentication");
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new ApiError(401, "Invalid token"));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new ApiError(401, "Token expired"));
    } else {
      next(error);
    }
  }
};
```

### 5.2 Registration & Login

```typescript
// src/controllers/auth.controller.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { sendVerificationEmail } from "../services/email.service";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password, fullName } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ApiError(409, "Email already registered");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        emailVerified: false,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        createdAt: true,
      },
    });

    // Create default folder
    await prisma.folder.create({
      data: {
        userId: user.id,
        name: "Notes",
        position: 0,
      },
    });

    // Generate verification token
    const verificationToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" },
    );

    // Save verification token
    await prisma.$executeRaw`
      INSERT INTO email_verifications (user_id, token, expires_at)
      VALUES (${user.id}, ${verificationToken}, NOW() + INTERVAL '24 hours')
    `;

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    // Generate access token
    const accessToken = generateAccessToken(user.id, email);
    const refreshToken = generateRefreshToken(user.id);

    return res.status(201).json(
      new ApiResponse({
        data: {
          user,
          tokens: {
            accessToken,
            refreshToken,
          },
        },
        message: "Registration successful. Please verify your email.",
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      throw new ApiError(401, "Invalid credentials");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid credentials");
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate tokens
    const accessToken = generateAccessToken(user.id, email);
    const refreshToken = generateRefreshToken(user.id);

    // Create session
    await prisma.session.create({
      data: {
        userId: user.id,
        tokenHash: await bcrypt.hash(refreshToken, 10),
        deviceName: req.headers["user-agent"] || "Unknown",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    return res.json(
      new ApiResponse({
        data: {
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            avatarUrl: user.avatarUrl,
            emailVerified: user.emailVerified,
          },
          tokens: {
            accessToken,
            refreshToken,
          },
        },
        message: "Login successful",
      }),
    );
  } catch (error) {
    next(error);
  }
};

// Token generation helpers
const generateAccessToken = (userId: string, email: string): string => {
  return jwt.sign({ userId, email }, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "30d",
  });
};
```

---

## 6. REAL-TIME SYNCHRONIZATION

### 6.1 Sync Architecture

```
Client (IndexedDB) ⟷ Server (PostgreSQL)

Sync Flow:
1. Client tracks local changes with timestamps
2. Periodically sends changes to server (PUSH)
3. Receives server changes since last sync (PULL)
4. Conflict resolution based on timestamps
5. Update local IndexedDB with merged data
```

### 6.2 Sync API Implementation

```typescript
// src/controllers/sync.controller.ts
import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { ApiResponse } from "../utils/ApiResponse";

export const pullChanges = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const { lastSyncAt, deviceId } = req.body;

    const lastSync = lastSyncAt ? new Date(lastSyncAt) : new Date(0);

    // Get all changes since last sync
    const [notes, folders] = await Promise.all([
      prisma.note.findMany({
        where: {
          userId,
          updatedAt: { gt: lastSync },
        },
        orderBy: { updatedAt: "asc" },
      }),
      prisma.folder.findMany({
        where: {
          userId,
          updatedAt: { gt: lastSync },
        },
        orderBy: { updatedAt: "asc" },
      }),
    ]);

    // Log sync
    await prisma.syncLog.create({
      data: {
        userId,
        deviceId,
        action: "pull",
        notesSynced: notes.length,
      },
    });

    return res.json(
      new ApiResponse({
        data: {
          notes,
          folders,
          syncedAt: new Date(),
        },
        message: "Changes pulled successfully",
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const pushChanges = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const { notes, folders, deviceId } = req.body;

    let conflicts = 0;
    const results = {
      notes: [],
      folders: [],
      conflicts: [],
    };

    // Process notes
    for (const clientNote of notes || []) {
      const serverNote = await prisma.note.findFirst({
        where: { id: clientNote.id, userId },
      });

      if (!serverNote) {
        // New note - create
        const created = await prisma.note.create({
          data: {
            ...clientNote,
            userId,
            version: 1,
          },
        });
        results.notes.push(created);
      } else {
        // Conflict detection
        const clientTime = new Date(clientNote.updatedAt);
        const serverTime = serverNote.updatedAt;

        if (serverTime > clientTime) {
          // Server is newer - conflict
          conflicts++;
          results.conflicts.push({
            id: clientNote.id,
            type: "note",
            serverVersion: serverNote,
            clientVersion: clientNote,
          });
        } else {
          // Client is newer - update
          const updated = await prisma.note.update({
            where: { id: clientNote.id },
            data: {
              ...clientNote,
              version: serverNote.version + 1,
            },
          });
          results.notes.push(updated);
        }
      }
    }

    // Process folders (similar logic)
    // ... folder sync logic ...

    // Log sync
    await prisma.syncLog.create({
      data: {
        userId,
        deviceId,
        action: "push",
        notesSynced: results.notes.length,
        conflictsResolved: conflicts,
      },
    });

    return res.json(
      new ApiResponse({
        data: results,
        message: "Changes pushed successfully",
      }),
    );
  } catch (error) {
    next(error);
  }
};
```

### 6.3 Conflict Resolution Strategy

```typescript
// src/utils/conflictResolver.ts
interface ConflictResolution {
  strategy: "server-wins" | "client-wins" | "manual" | "merge";
  resolvedData: any;
}

export const resolveConflict = (
  serverData: any,
  clientData: any,
  strategy: string = "server-wins",
): ConflictResolution => {
  switch (strategy) {
    case "server-wins":
      return {
        strategy: "server-wins",
        resolvedData: serverData,
      };

    case "client-wins":
      return {
        strategy: "client-wins",
        resolvedData: clientData,
      };

    case "merge":
      // Intelligent merge (e.g., merge content)
      return {
        strategy: "merge",
        resolvedData: {
          ...serverData,
          content: mergeContent(serverData.content, clientData.content),
          version: Math.max(serverData.version, clientData.version) + 1,
        },
      };

    default:
      return {
        strategy: "server-wins",
        resolvedData: serverData,
      };
  }
};

const mergeContent = (serverContent: string, clientContent: string): string => {
  // Simple merge strategy: append client changes
  // In production, use operational transforms or CRDT
  return `${serverContent}\n\n--- Client Changes ---\n${clientContent}`;
};
```

---

## 7. AI SERVICE INTEGRATION

### 7.1 OpenAI Proxy Service

```typescript
// src/services/ai.service.ts
import OpenAI from "openai";
import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/ApiError";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface AIRequest {
  userId: string;
  noteId?: string;
  action: string;
  prompt: string;
  context?: string;
  model?: string;
}

export const generateContent = async (request: AIRequest): Promise<string> => {
  const {
    userId,
    noteId,
    action,
    prompt,
    context,
    model = "gpt-4o-mini",
  } = request;

  // Check user's AI token limit
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      aiTokensUsed: true,
      aiTokensLimit: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.aiTokensUsed >= user.aiTokensLimit) {
    throw new ApiError(
      429,
      "AI token limit exceeded. Please upgrade your plan.",
    );
  }

  // Build messages
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: getSystemPrompt(action),
    },
    {
      role: "user",
      content: context ? `${prompt}\n\nContext: ${context}` : prompt,
    },
  ];

  try {
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 2000,
    });

    const response = completion.choices[0].message.content || "";
    const usage = completion.usage;

    if (!usage) {
      throw new ApiError(500, "Failed to get token usage from OpenAI");
    }

    // Calculate cost (approximate)
    const costPer1kTokens = model === "gpt-4o" ? 0.005 : 0.0005;
    const cost = (usage.total_tokens / 1000) * costPer1kTokens;

    // Log AI usage
    await prisma.aIUsage.create({
      data: {
        userId,
        noteId,
        action,
        promptTokens: usage.prompt_tokens,
        completionTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens,
        model,
        costUsd: cost,
      },
    });

    // Update user's token usage
    await prisma.user.update({
      where: { id: userId },
      data: {
        aiTokensUsed: {
          increment: usage.total_tokens,
        },
      },
    });

    return response;
  } catch (error: any) {
    if (error?.status === 429) {
      throw new ApiError(
        429,
        "OpenAI rate limit exceeded. Please try again later.",
      );
    }
    throw new ApiError(500, `AI service error: ${error.message}`);
  }
};

const getSystemPrompt = (action: string): string => {
  const prompts: Record<string, string> = {
    generate:
      "You are a helpful assistant for note-taking. Generate clear, well-structured content based on user requests.",
    improve:
      "You are an expert editor. Improve the given text while maintaining its core message. Make it more professional, clear, and concise.",
    summarize:
      "You are a summarization expert. Create concise, accurate summaries that capture key points.",
    translate:
      "You are a professional translator. Translate the text accurately while maintaining tone and context.",
    answer:
      "You are a knowledgeable assistant. Answer questions based on the provided context clearly and accurately.",
  };

  return prompts[action] || prompts.generate;
};
```

### 7.2 AI Controller

```typescript
// src/controllers/ai.controller.ts
import { Request, Response, NextFunction } from "express";
import { generateContent } from "../services/ai.service";
import { ApiResponse } from "../utils/ApiResponse";

export const handleAIGenerate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const { prompt, context, noteId, model } = req.body;

    const content = await generateContent({
      userId,
      noteId,
      action: "generate",
      prompt,
      context,
      model,
    });

    return res.json(
      new ApiResponse({
        data: { content },
        message: "Content generated successfully",
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const handleAIImprove = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const { text, noteId } = req.body;

    const content = await generateContent({
      userId,
      noteId,
      action: "improve",
      prompt: "Improve this text:",
      context: text,
    });

    return res.json(
      new ApiResponse({
        data: { content },
        message: "Text improved successfully",
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const getAIUsageStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;

    const [user, usage] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          aiTokensUsed: true,
          aiTokensLimit: true,
        },
      }),
      prisma.aIUsage.aggregate({
        where: { userId },
        _sum: {
          totalTokens: true,
          costUsd: true,
        },
        _count: true,
      }),
    ]);

    return res.json(
      new ApiResponse({
        data: {
          tokensUsed: user?.aiTokensUsed || 0,
          tokensLimit: user?.aiTokensLimit || 0,
          totalRequests: usage._count,
          totalCost: usage._sum.costUsd || 0,
        },
        message: "AI usage stats retrieved",
      }),
    );
  } catch (error) {
    next(error);
  }
};
```

---

## 8. FILE STORAGE SYSTEM

### 8.1 S3 Integration

```typescript
// src/services/storage.service.ts
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";
import sharp from "sharp";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME!;

export const uploadFile = async (
  file: Express.Multer.File,
  userId: string,
): Promise<{ url: string; key: string; thumbnailUrl?: string }> => {
  const fileExtension = file.originalname.split(".").pop();
  const fileKey = `uploads/${userId}/${nanoid()}.${fileExtension}`;

  // Upload to S3
  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "private",
    }),
  );

  const fileUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${fileKey}`;

  // Generate thumbnail for images
  let thumbnailUrl;
  if (file.mimetype.startsWith("image/")) {
    const thumbnailKey = `thumbnails/${userId}/${nanoid()}.jpg`;
    const thumbnail = await sharp(file.buffer)
      .resize(300, 300, { fit: "inside" })
      .jpeg({ quality: 80 })
      .toBuffer();

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: thumbnailKey,
        Body: thumbnail,
        ContentType: "image/jpeg",
        ACL: "private",
      }),
    );

    thumbnailUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${thumbnailKey}`;
  }

  return {
    url: fileUrl,
    key: fileKey,
    thumbnailUrl,
  };
};

export const deleteFile = async (fileKey: string): Promise<void> => {
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
    }),
  );
};

export const getSignedDownloadUrl = async (
  fileKey: string,
  expiresIn: number = 3600,
): Promise<string> => {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
};
```

---

## 9. CACHING STRATEGY

### 9.1 Redis Caching

```typescript
// src/services/cache.service.ts
import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD,
  db: 0,
});

export class CacheService {
  // Cache note list
  static async cacheNotes(userId: string, notes: any[]): Promise<void> {
    const key = `notes:${userId}`;
    await redis.setex(key, 300, JSON.stringify(notes)); // 5 min TTL
  }

  static async getCachedNotes(userId: string): Promise<any[] | null> {
    const key = `notes:${userId}`;
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  static async invalidateNotes(userId: string): Promise<void> {
    const key = `notes:${userId}`;
    await redis.del(key);
  }

  // Cache AI responses
  static async cacheAIResponse(
    prompt: string,
    response: string,
  ): Promise<void> {
    const key = `ai:${Buffer.from(prompt).toString("base64")}`;
    await redis.setex(key, 3600, response); // 1 hour TTL
  }

  static async getCachedAIResponse(prompt: string): Promise<string | null> {
    const key = `ai:${Buffer.from(prompt).toString("base64")}`;
    return await redis.get(key);
  }
}
```

---

## 10. SECURITY IMPLEMENTATION

### 10.1 Security Middleware

```typescript
// src/middleware/security.middleware.ts
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import { Express } from "express";

export const applySecurity = (app: Express) => {
  // Helmet - Security headers
  app.use(helmet());

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP",
  });
  app.use("/api/", limiter);

  // Sanitize inputs
  app.use(mongoSanitize());

  // CORS
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
  });
};
```

---

## 11. RATE LIMITING & THROTTLING

```typescript
// src/middleware/rateLimiter.ts
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!);

// General API rate limit
export const apiLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: "rl:api:",
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});

// AI endpoint rate limit (stricter)
export const aiLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: "rl:ai:",
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 requests per hour
  message: "AI rate limit exceeded. Please try again later.",
});

// Auth rate limit (very strict)
export const authLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: "rl:auth:",
  }),
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts per 15 minutes
  message: "Too many login attempts. Please try again later.",
});
```

---

## 12. BACKUP & RECOVERY

### 12.1 Automated Backups

```bash
#!/bin/bash
# scripts/backup.sh

# Database backup
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/postgres"

pg_dump $DATABASE_URL | gzip > $BACKUP_DIR/backup_$TIMESTAMP.sql.gz

# Upload to S3
aws s3 cp $BACKUP_DIR/backup_$TIMESTAMP.sql.gz \
  s3://notesapp-backups/postgres/backup_$TIMESTAMP.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed: backup_$TIMESTAMP.sql.gz"
```

### 12.2 Backup Cron Job

```
# Crontab entry
0 2 * * * /app/scripts/backup.sh >> /var/log/backup.log 2>&1
```

---

## 13. MONITORING & LOGGING

### 13.1 Logger Setup

```typescript
// src/utils/logger.ts
import winston from "winston";

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}

export default logger;
```

### 13.2 Error Tracking (Sentry)

```typescript
// src/utils/sentry.ts
import * as Sentry from "@sentry/node";

export const initSentry = (app: Express) => {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
  });

  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
};

export const sentryErrorHandler = Sentry.Handlers.errorHandler();
```

---

## 14. DEPLOYMENT ARCHITECTURE

### 14.1 Docker Setup

```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD node healthcheck.js || exit 1

# Run app
CMD ["node", "dist/index.js"]
```

```yaml
# docker-compose.yml
version: "3.8"

services:
  app:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/notesdb
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=notesdb
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### 14.2 Environment Variables

```bash
# .env.production
NODE_ENV=production
PORT=8000

# Database
DATABASE_URL=postgresql://user:pass@host:5432/notesdb

# Redis
REDIS_URL=redis://host:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_REFRESH_SECRET=your-refresh-secret-key-change-this

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key

# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET_NAME=notesapp-uploads

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Sentry
SENTRY_DSN=https://your-sentry-dsn

# Frontend
FRONTEND_URL=https://app.notesapp.com
```

---

## 15. API DOCUMENTATION

### 15.1 Swagger/OpenAPI Setup

```typescript
// src/docs/swagger.ts
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Notes App API",
      version: "1.0.0",
      description: "AI-Powered Note Taking Application API",
    },
    servers: [
      {
        url: "http://localhost:8000/api/v1",
        description: "Development server",
      },
      {
        url: "https://api.notesapp.com/v1",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.ts"],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
```

### 15.2 Complete Server Setup

```typescript
// src/index.ts
import express from "express";
import cors from "cors";
import { applySecurity } from "./middleware/security.middleware";
import { initSentry, sentryErrorHandler } from "./utils/sentry";
import { setupSwagger } from "./docs/swagger";
import authRoutes from "./routes/auth.routes";
import notesRoutes from "./routes/notes.routes";
import foldersRoutes from "./routes/folders.routes";
import syncRoutes from "./routes/sync.routes";
import aiRoutes from "./routes/ai.routes";
import { errorHandler } from "./middleware/error.middleware";
import logger from "./utils/logger";

const app = express();
const PORT = process.env.PORT || 8000;

// Initialize Sentry
initSentry(app);

// Security
applySecurity(app);

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

// API Documentation
setupSwagger(app);

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/notes", notesRoutes);
app.use("/api/v1/folders", foldersRoutes);
app.use("/api/v1/sync", syncRoutes);
app.use("/api/v1/ai", aiRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handlers
app.use(sentryErrorHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📚 API Docs: http://localhost:${PORT}/api-docs`);
});

export default app;
```

---

## APPENDIX

### A. Database Migration Commands

```bash
# Create migration
npx prisma migrate dev --name initial_schema

# Apply migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Seed database
npx prisma db seed
```

### B. Common API Errors

```typescript
export const ERROR_CODES = {
  // Authentication (401)
  INVALID_TOKEN: "Invalid or expired token",
  INVALID_CREDENTIALS: "Invalid email or password",

  // Authorization (403)
  FORBIDDEN: "You do not have permission to perform this action",

  // Not Found (404)
  NOTE_NOT_FOUND: "Note not found",
  USER_NOT_FOUND: "User not found",

  // Validation (400)
  VALIDATION_ERROR: "Invalid input data",
  MISSING_FIELD: "Required field is missing",

  // Rate Limiting (429)
  RATE_LIMIT_EXCEEDED: "Too many requests",
  AI_LIMIT_EXCEEDED: "AI token limit exceeded",

  // Server (500)
  INTERNAL_ERROR: "Internal server error",
  DATABASE_ERROR: "Database operation failed",
};
```

### C. Performance Benchmarks

```
Target Metrics:
- API Response Time: < 100ms (p95)
- Database Query Time: < 50ms (average)
- AI Response Time: < 2s (first token)
- Sync Operation: < 500ms for 100 notes
- Concurrent Users: 10,000+
- Requests per Second: 5,000+
```

---

## FINAL NOTES

Yeh **BACKEND.md** document aapke Notium note-taking application ke liye complete backend specification provide karta hai. Implementation ke liye:

1. **Setup Phase**
   - PostgreSQL aur Redis install karein
   - Environment variables configure karein
   - Prisma migrations run karein

2. **Development Phase**
   - Controllers aur routes implement karein
   - Authentication middleware setup karein
   - AI service integrate karein

3. **Testing Phase**
   - Unit tests likhein (Jest/Vitest)
   - Integration tests (Supertest)
   - Load testing (k6/Artillery)

4. **Deployment Phase**
   - Docker containers build karein
   - Railway/Fly.io pe deploy karein
   - Monitoring setup karein (Sentry, Datadog)

5. **Production Optimization**
   - Database indexes optimize karein
   - Redis caching implement karein
   - CDN setup karein

**Best Practices:**

- ✅ Always use TypeScript for type safety
- ✅ Implement proper error handling
- ✅ Use environment variables for secrets
- ✅ Enable HTTPS in production
- ✅ Regular database backups
- ✅ Monitor API performance
- ✅ Rate limit all endpoints
- ✅ Validate all inputs
- ✅ Log all errors

Happy Coding! 🚀
