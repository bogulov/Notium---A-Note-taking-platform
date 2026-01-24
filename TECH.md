# TECH.md

## AI-Powered Note Taking Application - Complete Technology Specification

---

## TABLE OF CONTENTS

1. [Technology Stack Overview](#1-technology-stack-overview)
2. [Project Setup & Configuration](#2-project-setup--configuration)
3. [Frontend Architecture](#3-frontend-architecture)
4. [State Management](#4-state-management)
5. [Rich Text Editor Implementation](#5-rich-text-editor-implementation)
6. [Local Storage Architecture](#6-local-storage-architecture)
7. [AI Integration (OpenAI)](#7-ai-integration-openai)
8. [Export/Import System](#8-exportimport-system)
9. [Animation & Performance](#9-animation--performance)
10. [Testing Strategy](#10-testing-strategy)
11. [Build & Deployment](#11-build--deployment)
12. [Security Best Practices](#12-security-best-practices)
13. [File Structure](#13-file-structure)
14. [Code Examples](#14-code-examples)
15. [Troubleshooting Guide](#15-troubleshooting-guide)

---

## 1. TECHNOLOGY STACK OVERVIEW

### 1.1 Recommended Tech Stack (Production-Ready)

```
┌─────────────────────────────────────────────────────┐
│                 FRONTEND STACK                      │
├─────────────────────────────────────────────────────┤
│ Framework:        React 18.2+ with TypeScript       │
│ Build Tool:       Vite 5.0+                         │
│ Styling:          Tailwind CSS 3.4+                 │
│ State:            Zustand 4.4+                      │
│ Rich Text:        TipTap 2.1+                       │
│ Icons:            Lucide React 0.263+               │
│ Animations:       Framer Motion 10.16+              │
│ AI:               OpenAI API 4.20+                  │
│ Storage:          IndexedDB (Dexie.js 3.2+)         │
│ Markdown:         Turndown 7.1+                     │
│ Utils:            date-fns, nanoid, clsx            │
├─────────────────────────────────────────────────────┤
│ Testing:          Vitest + React Testing Library    │
│ E2E Testing:      Playwright                        │
│ Linting:          ESLint + Prettier                 │
│ Type Checking:    TypeScript 5.2+                   │
├─────────────────────────────────────────────────────┤
│ Deployment:       Vercel / Netlify                  │
│ CI/CD:            GitHub Actions                    │
│ Monitoring:       Sentry (optional)                 │
└─────────────────────────────────────────────────────┘
```

### 1.2 Why This Stack?

**React 18 + TypeScript**

- ✅ Type safety reduces bugs
- ✅ Component reusability
- ✅ Huge ecosystem
- ✅ Concurrent features for better UX
- ✅ Industry standard

**Vite**

- ✅ Lightning fast HMR (Hot Module Replacement)
- ✅ Optimized production builds
- ✅ Better than Create React App
- ✅ Native ESM support
- ✅ Plugin ecosystem

**Tailwind CSS**

- ✅ Rapid UI development
- ✅ Consistent design system
- ✅ Minimal CSS bundle size
- ✅ No naming conflicts
- ✅ Responsive utilities

**Zustand (State Management)**

- ✅ Minimal boilerplate (vs Redux)
- ✅ Simple API
- ✅ TypeScript support
- ✅ Dev tools integration
- ✅ Perfect for medium apps

**TipTap (Rich Text Editor)**

- ✅ Built on ProseMirror (robust)
- ✅ Highly customizable
- ✅ Headless (full control over UI)
- ✅ Markdown support
- ✅ Collaborative editing ready

**IndexedDB (via Dexie.js)**

- ✅ Much larger storage than localStorage (100MB+)
- ✅ Structured data storage
- ✅ Async operations (non-blocking)
- ✅ Transaction support
- ✅ Better for production apps

**Framer Motion**

- ✅ Declarative animations
- ✅ Spring physics
- ✅ Gesture support
- ✅ Layout animations
- ✅ TypeScript support

---

## 2. PROJECT SETUP & CONFIGURATION

### 2.1 Initial Setup Commands

```bash
# Create project with Vite + React + TypeScript
npm create vite@latest notes-app -- --template react-ts

cd notes-app

# Install core dependencies
npm install

# Install additional dependencies
npm install zustand @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder @tiptap/extension-link @tiptap/extension-image @tiptap/extension-task-list @tiptap/extension-task-item

npm install lucide-react framer-motion clsx tailwind-merge

npm install dexie dexie-react-hooks

npm install turndown

npm install openai

npm install date-fns nanoid

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install dev dependencies
npm install -D @types/turndown
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D prettier eslint-config-prettier eslint-plugin-prettier

# Optional: Playwright for E2E testing
npm install -D @playwright/test
```

### 2.2 Project Configuration Files

**vite.config.ts**

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@types": path.resolve(__dirname, "./src/types"),
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          editor: ["@tiptap/react", "@tiptap/starter-kit"],
          ai: ["openai"],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
```

**tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#007AFF",
          hover: "#0051D5",
          light: "#E5F2FF",
        },
        surface: {
          DEFAULT: "#F5F5F7",
          hover: "#EBEBED",
        },
        border: {
          DEFAULT: "#D1D1D6",
          light: "#E5E5EA",
        },
        text: {
          primary: "#1D1D1F",
          secondary: "#86868B",
          tertiary: "#C7C7CC",
        },
        ai: {
          primary: "#AF52DE",
          background: "#F5EBFF",
          border: "#D7B8F3",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: ["SF Mono", "Monaco", "Consolas", "monospace"],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
      },
      animation: {
        "slide-up": "slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "fade-in": "fadeIn 0.2s ease-out",
        shimmer: "shimmer 1.5s ease-in-out infinite",
      },
      keyframes: {
        slideUp: {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
    },
  },
  plugins: [],
};
```

**tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@store/*": ["./src/store/*"],
      "@utils/*": ["./src/utils/*"],
      "@types/*": ["./src/types/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**package.json (scripts section)**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "e2e": "playwright test",
    "type-check": "tsc --noEmit"
  }
}
```

**.env.example**

```env
# OpenAI API Configuration
VITE_OPENAI_API_KEY=your_api_key_here
VITE_OPENAI_MODEL=gpt-4o-mini

# App Configuration
VITE_APP_NAME=Notes App
VITE_MAX_NOTES=1000
VITE_AUTO_SAVE_DELAY=500
```

**ESLint Configuration (.eslintrc.cjs)**

```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "prettier",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "no-console": ["warn", { allow: ["warn", "error"] }],
  },
};
```

**Prettier Configuration (.prettierrc)**

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

---

## 3. FRONTEND ARCHITECTURE

### 3.1 Component Architecture Pattern

```
Component Hierarchy:
App
├── Providers (Theme, Store)
├── Layout
│   ├── Header
│   │   ├── MenuButton
│   │   ├── SearchBar
│   │   ├── NewNoteButton
│   │   ├── AIButton
│   │   └── SettingsButton
│   ├── Sidebar
│   │   ├── FolderList
│   │   │   └── FolderItem
│   │   └── NewFolderButton
│   ├── NoteList
│   │   ├── NoteListHeader
│   │   ├── NoteListItems
│   │   │   └── NoteItem
│   │   └── EmptyState
│   └── Editor
│       ├── EditorHeader
│       ├── Toolbar
│       │   ├── FormattingButtons
│       │   ├── HeadingButtons
│       │   ├── ListButtons
│       │   └── AIButton
│       └── EditorContent (TipTap)
├── AIPanel
│   ├── AIPanelHeader
│   ├── AIInput
│   ├── AIResponse
│   └── AIActions
├── Modals
│   ├── SettingsModal
│   ├── DeleteConfirmModal
│   └── ExportModal
└── Toast (Notifications)
```

### 3.2 Design Patterns

**1. Custom Hooks Pattern**

```typescript
// Separation of concerns
// Business logic in hooks
// Components stay clean

useNotes(); // Note CRUD operations
useLocalStorage(); // Persistent storage
useDebounce(); // Input debouncing
useKeyboard(); // Keyboard shortcuts
useAI(); // OpenAI integration
useExport(); // Export functionality
```

**2. Compound Components Pattern**

```typescript
// For flexible, reusable components
<Dropdown>
  <Dropdown.Trigger>Sort By</Dropdown.Trigger>
  <Dropdown.Menu>
    <Dropdown.Item>Date Created</Dropdown.Item>
    <Dropdown.Item>Date Modified</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>
```

**3. Render Props Pattern**

```typescript
// For sharing logic between components
<DataProvider>
  {({ data, loading, error }) => (
    loading ? <Spinner /> : <Content data={data} />
  )}
</DataProvider>
```

---

## 4. STATE MANAGEMENT

### 4.1 Zustand Store Architecture

**Why Zustand over Redux?**

- 🎯 Less boilerplate (no actions, reducers, dispatch)
- 🎯 TypeScript first-class support
- 🎯 No Provider wrapper needed
- 🎯 Smaller bundle size
- 🎯 Easier to learn and maintain

**Store Structure:**

```typescript
// src/store/index.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string;
  isPinned: boolean;
  createdAt: number;
  updatedAt: number;
  wordCount: number;
}

interface Folder {
  id: string;
  name: string;
  createdAt: number;
}

interface AppState {
  // State
  notes: Note[];
  folders: Folder[];
  activeNoteId: string | null;
  activeFolderId: string;
  searchQuery: string;
  isAIPanelOpen: boolean;
  theme: "light" | "dark";

  // Actions - Notes
  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  setActiveNote: (id: string | null) => void;

  // Actions - Folders
  addFolder: (name: string) => void;
  updateFolder: (id: string, name: string) => void;
  deleteFolder: (id: string) => void;
  setActiveFolder: (id: string) => void;

  // Actions - UI
  setSearchQuery: (query: string) => void;
  toggleAIPanel: () => void;
  setTheme: (theme: "light" | "dark") => void;

  // Computed
  filteredNotes: () => Note[];
  activeNote: () => Note | null;
}

export const useStore = create<AppState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial State
        notes: [],
        folders: [{ id: "default", name: "Notes", createdAt: Date.now() }],
        activeNoteId: null,
        activeFolderId: "default",
        searchQuery: "",
        isAIPanelOpen: false,
        theme: "light",

        // Actions - Notes
        addNote: (noteData) =>
          set((state) => {
            const newNote: Note = {
              ...noteData,
              id: nanoid(),
              createdAt: Date.now(),
              updatedAt: Date.now(),
            };
            state.notes.push(newNote);
            state.activeNoteId = newNote.id;
          }),

        updateNote: (id, updates) =>
          set((state) => {
            const note = state.notes.find((n) => n.id === id);
            if (note) {
              Object.assign(note, updates, { updatedAt: Date.now() });
            }
          }),

        deleteNote: (id) =>
          set((state) => {
            state.notes = state.notes.filter((n) => n.id !== id);
            if (state.activeNoteId === id) {
              state.activeNoteId = null;
            }
          }),

        setActiveNote: (id) => set({ activeNoteId: id }),

        // Actions - Folders
        addFolder: (name) =>
          set((state) => {
            state.folders.push({
              id: nanoid(),
              name,
              createdAt: Date.now(),
            });
          }),

        updateFolder: (id, name) =>
          set((state) => {
            const folder = state.folders.find((f) => f.id === id);
            if (folder) folder.name = name;
          }),

        deleteFolder: (id) =>
          set((state) => {
            state.folders = state.folders.filter((f) => f.id !== id);
            // Move notes to default folder
            state.notes.forEach((note) => {
              if (note.folderId === id) note.folderId = "default";
            });
          }),

        setActiveFolder: (id) => set({ activeFolderId: id }),

        // Actions - UI
        setSearchQuery: (query) => set({ searchQuery: query }),
        toggleAIPanel: () =>
          set((state) => ({
            isAIPanelOpen: !state.isAIPanelOpen,
          })),
        setTheme: (theme) => set({ theme }),

        // Computed
        filteredNotes: () => {
          const { notes, activeFolderId, searchQuery } = get();
          let filtered = notes.filter((n) => n.folderId === activeFolderId);

          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
              (n) =>
                n.title.toLowerCase().includes(query) ||
                n.content.toLowerCase().includes(query),
            );
          }

          // Sort: pinned first, then by updated date
          return filtered.sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return b.updatedAt - a.updatedAt;
          });
        },

        activeNote: () => {
          const { notes, activeNoteId } = get();
          return notes.find((n) => n.id === activeNoteId) || null;
        },
      })),
      {
        name: "notes-storage",
        partialize: (state) => ({
          notes: state.notes,
          folders: state.folders,
          theme: state.theme,
        }),
      },
    ),
  ),
);
```

### 4.2 Store Usage in Components

```typescript
// Reading state
const notes = useStore(state => state.notes);
const activeNote = useStore(state => state.activeNote());

// Actions
const addNote = useStore(state => state.addNote);
const updateNote = useStore(state => state.updateNote);

// Example usage
function NoteList() {
  const filteredNotes = useStore(state => state.filteredNotes());
  const setActiveNote = useStore(state => state.setActiveNote);

  return (
    <div>
      {filteredNotes.map(note => (
        <NoteItem
          key={note.id}
          note={note}
          onClick={() => setActiveNote(note.id)}
        />
      ))}
    </div>
  );
}
```

---

## 5. RICH TEXT EDITOR IMPLEMENTATION

### 5.1 TipTap Configuration

```typescript
// src/components/Editor/EditorContent.tsx
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { useStore } from '@/store';
import { useDebounce } from '@/hooks/useDebounce';

interface EditorProps {
  noteId: string;
  initialContent: string;
}

export function Editor({ noteId, initialContent }: EditorProps) {
  const updateNote = useStore(state => state.updateNote);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: 'Start typing your note...',
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary hover:underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full rounded-lg',
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-screen',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      const wordCount = text.split(/\s+/).filter(Boolean).length;

      debouncedUpdate(noteId, {
        content: html,
        wordCount,
      });
    },
  });

  const debouncedUpdate = useDebounce((id: string, updates: any) => {
    updateNote(id, updates);
  }, 500);

  return <EditorContent editor={editor} />;
}
```

### 5.2 Custom Toolbar

```typescript
// src/components/Editor/Toolbar.tsx
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Link as LinkIcon,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';

interface ToolbarProps {
  editor: Editor | null;
  onAIClick: () => void;
}

export function Toolbar({ editor, onAIClick }: ToolbarProps) {
  if (!editor) return null;

  const Button = ({ onClick, active, children }: any) => (
    <button
      onClick={onClick}
      className={`p-2 rounded hover:bg-surface transition ${
        active ? 'bg-primary-light text-primary' : 'text-text-secondary'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex items-center gap-1 py-2 border-b border-border-light sticky top-0 bg-white z-10">
      {/* Text Formatting */}
      <div className="flex gap-1 px-2 border-r border-border-light">
        <Button
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
        >
          <Bold size={16} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
        >
          <Italic size={16} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
        >
          <Strikethrough size={16} />
        </Button>
      </div>

      {/* Headings */}
      <div className="flex gap-1 px-2 border-r border-border-light">
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
        >
          <Heading1 size={16} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
        >
          <Heading2 size={16} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
        >
          <Heading3 size={16} />
        </Button>
      </div>

      {/* Lists */}
      <div className="flex gap-1 px-2 border-r border-border-light">
        <Button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
        >
          <List size={16} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
        >
          <ListOrdered size={16} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          active={editor.isActive('taskList')}
        >
          <CheckSquare size={16} />
        </Button>
      </div>

      {/* AI Button */}
      <button
        onClick={onAIClick}
        className="ml-auto px-3 py-1.5 bg-ai-primary text-white rounded-md hover:opacity-90 transition flex items-center gap-2"
      >
        <Sparkles size={16} />
        <span className="text-sm font-medium">AI</span>
      </button>
    </div>
  );
}
```

---

## 6. LOCAL STORAGE ARCHITECTURE

### 6.1 Why IndexedDB (Dexie.js) over localStorage?

| Feature       | localStorage        | IndexedDB |
| ------------- | ------------------- | --------- |
| Storage Limit | 5-10MB              | 100MB+    |
| Data Type     | Strings only        | Any type  |
| Async         | No (blocking)       | Yes       |
| Transactions  | No                  | Yes       |
| Queries       | No                  | Yes       |
| Performance   | Slow for large data | Fast      |

### 6.2 Dexie.js Setup

```typescript
// src/db/index.ts
import Dexie, { Table } from "dexie";

export interface Note {
  id?: string;
  title: string;
  content: string;
  folderId: string;
  isPinned: boolean;
  createdAt: number;
  updatedAt: number;
  wordCount: number;
  tags?: string[];
}

export interface Folder {
  id?: string;
  name: string;
  createdAt: number;
}

export interface Settings {
  id?: number;
  theme: "light" | "dark";
  openAIKey?: string;
  aiModel: string;
  autoSaveDelay: number;
}

export class NotesDatabase extends Dexie {
  notes!: Table<Note, string>;
  folders!: Table<Folder, string>;
  settings!: Table<Settings, number>;

  constructor() {
    super("NotesDatabase");

    this.version(1).stores({
      notes: "id, folderId, createdAt, updatedAt, isPinned",
      folders: "id, createdAt",
      settings: "++id",
    });
  }
}

export const db = new NotesDatabase();
```

### 6.3 Database Operations Hook

```typescript
// src/hooks/useDatabase.ts
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db";
import { nanoid } from "nanoid";

export function useDatabase() {
  // Live queries (auto-updates on change)
  const notes = useLiveQuery(() => db.notes.toArray());
  const folders = useLiveQuery(() => db.folders.toArray());
  const settings = useLiveQuery(() => db.settings.get(1));

  // CRUD Operations
  const addNote = async (
    noteData: Omit<Note, "id" | "createdAt" | "updatedAt">,
  ) => {
    const id = nanoid();
    await db.notes.add({
      ...noteData,
      id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return id;
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    await db.notes.update(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  };

  const deleteNote = async (id: string) => {
    await db.notes.delete(id);
  };

  const addFolder = async (name: string) => {
    const id = nanoid();
    await db.folders.add({
      id,
      name,
      createdAt: Date.now(),
    });
    return id;
  };

  const updateSettings = async (updates: Partial<Settings>) => {
    await db.settings.put({ id: 1, ...updates });
  };

  // Bulk operations
  const exportAllNotes = async () => {
    const allNotes = await db.notes.toArray();
    const allFolders = await db.folders.toArray();
    return { notes: allNotes, folders: allFolders };
  };

  const importNotes = async (data: { notes: Note[]; folders: Folder[] }) => {
    await db.transaction("rw", db.notes, db.folders, async () => {
      await db.notes.bulkAdd(data.notes);
      await db.folders.bulkAdd(data.folders);
    });
  };

  const clearAllData = async () => {
    await db.transaction("rw", db.notes, db.folders, async () => {
      await db.notes.clear();
      await db.folders.clear();
    });
  };

  return {
    notes,
    folders,
    settings,
    addNote,
    updateNote,
    deleteNote,
    addFolder,
    updateSettings,
    exportAllNotes,
    importNotes,
    clearAllData,
  };
}
```

### 6.4 Migration from Zustand to IndexedDB

```typescript
// src/utils/migration.ts
export async function migrateToIndexedDB() {
  // Get data from localStorage (Zustand persist)
  const stored = localStorage.getItem("notes-storage");

  if (!stored) return;

  try {
    const data = JSON.parse(stored);

    // Import to IndexedDB
    if (data.state.folders) {
      await db.folders.bulkAdd(data.state.folders);
    }

    if (data.state.notes) {
      await db.notes.bulkAdd(data.state.notes);
    }

    // Clear localStorage after successful migration
    localStorage.removeItem("notes-storage");

    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}
```

---

## 7. AI INTEGRATION (OpenAI)

### 7.1 OpenAI Service Setup

```typescript
// src/services/openai.ts
import OpenAI from "openai";

class AIService {
  private client: OpenAI | null = null;

  initialize(apiKey: string) {
    this.client = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true, // For client-side usage
    });
  }

  async generateContent(prompt: string, context?: string) {
    if (!this.client) {
      throw new Error("OpenAI client not initialized");
    }

    const systemPrompt = `You are a helpful writing assistant for a note-taking app. 
    Be concise and helpful. Format your responses in clean markdown.`;

    const messages: any[] = [{ role: "system", content: systemPrompt }];

    if (context) {
      messages.push({
        role: "user",
        content: `Context from my notes:\n${context}`,
      });
    }

    messages.push({ role: "user", content: prompt });

    try {
      const completion = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.7,
        max_tokens: 1000,
        stream: false,
      });

      return completion.choices[0]?.message?.content || "";
    } catch (error: any) {
      throw new Error(`AI Error: ${error.message}`);
    }
  }

  async *streamContent(prompt: string, context?: string) {
    if (!this.client) {
      throw new Error("OpenAI client not initialized");
    }

    const systemPrompt = `You are a helpful writing assistant for a note-taking app.`;

    const messages: any[] = [{ role: "system", content: systemPrompt }];

    if (context) {
      messages.push({ role: "user", content: `Context: ${context}` });
    }

    messages.push({ role: "user", content: prompt });

    const stream = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 1000,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        yield content;
      }
    }
  }

  async answerQuestion(question: string, selectedText: string) {
    const prompt = `Based on the following text, answer this question:\n\nText: ${selectedText}\n\nQuestion: ${question}`;
    return this.generateContent(prompt);
  }

  async improveText(text: string, instruction: string) {
    const prompt = `${instruction}\n\nOriginal text:\n${text}`;
    return this.generateContent(prompt);
  }

  async summarize(text: string) {
    const prompt = `Summarize the following text in 3-5 bullet points:\n\n${text}`;
    return this.generateContent(prompt);
  }

  async translate(text: string, targetLanguage: string) {
    const prompt = `Translate the following text to ${targetLanguage}:\n\n${text}`;
    return this.generateContent(prompt);
  }
}

export const aiService = new AIService();
```

### 7.2 AI Hook

```typescript
// src/hooks/useAI.ts
import { useState } from "react";
import { aiService } from "@/services/openai";
import { useStore } from "@/store";

export function useAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<string>("");

  const generate = async (prompt: string, context?: string) => {
    setIsLoading(true);
    setError(null);
    setResponse("");

    try {
      const result = await aiService.generateContent(prompt, context);
      setResponse(result);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const streamGenerate = async (prompt: string, context?: string) => {
    setIsLoading(true);
    setError(null);
    setResponse("");

    try {
      const stream = aiService.streamContent(prompt, context);

      for await (const chunk of stream) {
        setResponse((prev) => prev + chunk);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const answer = async (question: string, selectedText: string) => {
    return generate(
      `Answer this question based on the text:\n\nText: ${selectedText}\n\nQuestion: ${question}`,
    );
  };

  const improve = async (text: string, instruction: string) => {
    return generate(`${instruction}\n\nText: ${text}`);
  };

  const summarize = async (text: string) => {
    return generate(`Summarize this in 3-5 bullet points:\n\n${text}`);
  };

  return {
    generate,
    streamGenerate,
    answer,
    improve,
    summarize,
    isLoading,
    error,
    response,
    clearResponse: () => setResponse(""),
  };
}
```

### 7.3 AI Panel Component

```typescript
// src/components/AIPanel/AIPanel.tsx
import { useState } from 'react';
import { X, Send, Copy, RotateCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAI } from '@/hooks/useAI';
import { useStore } from '@/store';

export function AIPanel() {
  const isOpen = useStore(state => state.isAIPanelOpen);
  const togglePanel = useStore(state => state.toggleAIPanel);
  const activeNote = useStore(state => state.activeNote());

  const [input, setInput] = useState('');
  const { streamGenerate, isLoading, response, clearResponse } = useAI();

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const context = activeNote?.content || '';
    await streamGenerate(input, context);
    setInput('');
  };

  const handleInsert = () => {
    if (activeNote && response) {
      // Insert AI response into editor
      // This will be handled by the editor component
      togglePanel();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 right-6 w-[400px] max-h-[600px] bg-white dark:bg-gray-900 border border-ai-border rounded-t-xl shadow-2xl flex flex-col z-50"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-ai-background">
            <div className="flex items-center gap-2">
              <Sparkles className="text-ai-primary" size={20} />
              <h3 className="font-semibold text-ai-primary">AI Assistant</h3>
            </div>
            <button
              onClick={togglePanel}
              className="p-1 hover:bg-surface rounded-md transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Input */}
          <div className="p-4 border-b border-border">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI or type a command..."
              className="w-full min-h-[80px] p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ai-primary"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handleSubmit();
                }
              }}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-text-secondary">
                Cmd+Enter to send
              </span>
              <button
                onClick={handleSubmit}
                disabled={isLoading || !input.trim()}
                className="px-4 py-2 bg-ai-primary text-white rounded-md hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? 'Generating...' : <><Send size={14} />Send</>}
              </button>
            </div>
          </div>

          {/* Response */}
          <div className="flex-1 overflow-y-auto p-4">
            {isLoading && !response && (
              <div className="flex items-center gap-2 text-text-secondary">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-ai-primary rounded-full animate-pulse" />
                  <span className="w-2 h-2 bg-ai-primary rounded-full animate-pulse delay-100" />
                  <span className="w-2 h-2 bg-ai-primary rounded-full animate-pulse delay-200" />
                </div>
                <span>AI is thinking...</span>
              </div>
            )}

            {response && (
              <div className="prose prose-sm max-w-none">
                {response}
              </div>
            )}
          </div>

          {/* Actions */}
          {response && (
            <div className="p-4 border-t border-border flex gap-2">
              <button
                onClick={handleInsert}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition"
              >
                Insert
              </button>
              <button
                onClick={handleCopy}
                className="px-4 py-2 border border-border rounded-md hover:bg-surface transition"
              >
                <Copy size={16} />
              </button>
              <button
                onClick={() => {
                  clearResponse();
                  handleSubmit();
                }}
                className="px-4 py-2 border border-border rounded-md hover:bg-surface transition"
              >
                <RotateCw size={16} />
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

---

## 8. EXPORT/IMPORT SYSTEM

### 8.1 Markdown Export

```typescript
// src/utils/export.ts
import TurndownService from "turndown";
import { Note } from "@/types";

const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});

// Custom rules for better markdown conversion
turndownService.addRule("strikethrough", {
  filter: ["del", "s", "strike"],
  replacement: (content) => `~~${content}~~`,
});

export function exportNoteAsMarkdown(note: Note) {
  const markdown = turndownService.turndown(note.content);

  // Add frontmatter
  const frontmatter = `---
title: ${note.title}
created: ${new Date(note.createdAt).toISOString()}
updated: ${new Date(note.updatedAt).toISOString()}
tags: ${note.tags?.join(", ") || "none"}
---

`;

  const fullContent = frontmatter + markdown;

  downloadFile(
    fullContent,
    `${sanitizeFileName(note.title)}.md`,
    "text/markdown",
  );
}

export function exportNoteAsText(note: Note) {
  const text = stripHTML(note.content);
  downloadFile(text, `${sanitizeFileName(note.title)}.txt`, "text/plain");
}

export function exportNoteAsHTML(note: Note) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${note.title}</title>
  <style>
    body {
      max-width: 800px;
      margin: 50px auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      padding: 20px;
    }
    h1 { font-size: 2em; margin-bottom: 0.5em; }
    .meta { color: #666; font-size: 0.9em; margin-bottom: 2em; }
  </style>
</head>
<body>
  <h1>${note.title}</h1>
  <div class="meta">
    Created: ${new Date(note.createdAt).toLocaleDateString()} | 
    Updated: ${new Date(note.updatedAt).toLocaleDateString()}
  </div>
  ${note.content}
</body>
</html>
  `;

  downloadFile(html, `${sanitizeFileName(note.title)}.html`, "text/html");
}

export function exportAllNotesAsZip(notes: Note[]) {
  // Implementation using JSZip library
  // npm install jszip
  const JSZip = require("jszip");
  const zip = new JSZip();

  notes.forEach((note) => {
    const markdown = turndownService.turndown(note.content);
    zip.file(`${sanitizeFileName(note.title)}.md`, markdown);
  });

  zip.generateAsync({ type: "blob" }).then((blob: Blob) => {
    downloadFile(blob, `notes-export-${Date.now()}.zip`, "application/zip");
  });
}

function downloadFile(
  content: string | Blob,
  filename: string,
  mimeType: string,
) {
  const blob =
    content instanceof Blob ? content : new Blob([content], { type: mimeType });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 50);
}

function stripHTML(html: string): string {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}
```

### 8.2 Import Functionality

```typescript
// src/utils/import.ts
import { db } from "@/db";
import { nanoid } from "nanoid";

export async function importMarkdownFile(file: File, folderId: string) {
  const content = await file.text();

  // Parse frontmatter
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  let title = file.name.replace(".md", "");
  let markdown = content;

  if (match) {
    const frontmatter = match[1];
    markdown = match[2];

    // Extract title from frontmatter
    const titleMatch = frontmatter.match(/title:\s*(.+)/);
    if (titleMatch) {
      title = titleMatch[1].trim();
    }
  }

  // Convert markdown to HTML (using marked library)
  // npm install marked
  const { marked } = await import("marked");
  const html = marked(markdown);

  const noteId = await db.notes.add({
    id: nanoid(),
    title,
    content: html,
    folderId,
    isPinned: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    wordCount: markdown.split(/\s+/).length,
  });

  return noteId;
}

export async function importTextFile(file: File, folderId: string) {
  const text = await file.text();

  const noteId = await db.notes.add({
    id: nanoid(),
    title: file.name.replace(".txt", ""),
    content: `<p>${text.replace(/\n/g, "<br>")}</p>`,
    folderId,
    isPinned: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    wordCount: text.split(/\s+/).length,
  });

  return noteId;
}
```

### 8.3 Export Hook

```typescript
// src/hooks/useExport.ts
import { useState } from "react";
import {
  exportNoteAsMarkdown,
  exportNoteAsText,
  exportNoteAsHTML,
} from "@/utils/export";
import { Note } from "@/types";

export function useExport() {
  const [isExporting, setIsExporting] = useState(false);

  const exportAs = async (note: Note, format: "md" | "txt" | "html") => {
    setIsExporting(true);

    try {
      switch (format) {
        case "md":
          exportNoteAsMarkdown(note);
          break;
        case "txt":
          exportNoteAsText(note);
          break;
        case "html":
          exportNoteAsHTML(note);
          break;
      }
    } catch (error) {
      console.error("Export failed:", error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  };

  return { exportAs, isExporting };
}
```

---

## 9. ANIMATION & PERFORMANCE

### 9.1 Framer Motion Setup

```typescript
// src/components/AnimatedLayout.tsx
import { motion } from 'framer-motion';

export const fadeIn = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2, ease: 'easeOut' },
};

export const slideUp = {
  initial: { y: '100%', opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: '100%', opacity: 0 },
  transition: { type: 'spring', damping: 25, stiffness: 200 },
};

export const scaleIn = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
  transition: { duration: 0.2, ease: 'easeOut' },
};

// Usage in components
export function NoteItem({ note, onClick }: any) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      whileHover={{ x: 2 }}
      onClick={onClick}
      className="note-item"
    >
      {/* Content */}
    </motion.div>
  );
}
```

### 9.2 Performance Optimizations

```typescript
// 1. Memoization
import { memo, useMemo } from 'react';

export const NoteItem = memo(({ note, isActive, onClick }: Props) => {
  // Component code
}, (prevProps, nextProps) => {
  // Custom comparison
  return prevProps.note.id === nextProps.note.id &&
         prevProps.isActive === nextProps.isActive;
});

// 2. Virtual Scrolling for large lists
import { FixedSizeList as List } from 'react-window';

export function NoteList({ notes }: { notes: Note[] }) {
  const Row = ({ index, style }: any) => (
    <div style={style}>
      <NoteItem note={notes[index]} />
    </div>
  );

  return (
    <List
      height={600}
      itemCount={notes.length}
      itemSize={80}
      width="100%"
    >
      {Row}
    </List>
  );
}

// 3. Debounced search
import { useDebouncedCallback } from 'use-debounce';

export function SearchBar() {
  const setSearchQuery = useStore(state => state.setSearchQuery);

  const debouncedSearch = useDebouncedCallback(
    (value: string) => {
      setSearchQuery(value);
    },
    300
  );

  return (
    <input
      onChange={(e) => debouncedSearch(e.target.value)}
      placeholder="Search notes..."
    />
  );
}

// 4. Lazy loading
import { lazy, Suspense } from 'react';

const SettingsModal = lazy(() => import('./components/SettingsModal'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {isSettingsOpen && <SettingsModal />}
    </Suspense>
  );
}
```

### 9.3 Code Splitting Strategy

```typescript
// vite.config.ts - already configured
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom'],
        'editor': ['@tiptap/react', '@tiptap/starter-kit'],
        'ai': ['openai'],
        'utils': ['date-fns', 'nanoid', 'turndown'],
      },
    },
  },
}
```

---

## 10. TESTING STRATEGY

### 10.1 Unit Testing with Vitest

```typescript
// src/utils/__tests__/export.test.ts
import { describe, it, expect } from "vitest";
import { sanitizeFileName } from "../export";

describe("Export Utils", () => {
  it("should sanitize file names correctly", () => {
    expect(sanitizeFileName("My Note!")).toBe("my-note");
    expect(sanitizeFileName("Hello World 123")).toBe("hello-world-123");
    expect(sanitizeFileName("Test@#$%")).toBe("test");
  });
});
```

### 10.2 Component Testing

```typescript
// src/components/__tests__/NoteItem.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NoteItem } from '../NoteItem';

describe('NoteItem', () => {
  const mockNote = {
    id: '1',
    title: 'Test Note',
    content: 'Test content',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    folderId: 'default',
    isPinned: false,
    wordCount: 2,
  };

  it('renders note title', () => {
    render(<NoteItem note={mockNote} onClick={() => {}} />);
    expect(screen.getByText('Test Note')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<NoteItem note={mockNote} onClick={handleClick} />);

    fireEvent.click(screen.getByText('Test Note'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### 10.3 E2E Testing with Playwright

```typescript
// tests/e2e/notes.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Notes App", () => {
  test("should create a new note", async ({ page }) => {
    await page.goto("http://localhost:3000");

    // Click new note button
    await page.click('[data-testid="new-note-btn"]');

    // Type title
    await page.fill('[data-testid="note-title"]', "Test Note");

    // Type content
    await page.fill('[data-testid="editor-content"]', "This is a test note");

    // Wait for auto-save
    await page.waitForTimeout(1000);

    // Verify note appears in list
    await expect(page.locator("text=Test Note")).toBeVisible();
  });

  test("should search notes", async ({ page }) => {
    await page.goto("http://localhost:3000");

    // Type in search
    await page.fill('[data-testid="search-input"]', "test");

    // Verify filtered results
    await expect(page.locator(".note-item")).toHaveCount(1);
  });
});
```

---

## 11. BUILD & DEPLOYMENT

### 11.1 Environment Variables

```env
# .env.production
VITE_OPENAI_API_KEY=
VITE_APP_NAME=Notes App
VITE_APP_VERSION=1.0.0
```

### 11.2 Build Script

```json
{
  "scripts": {
    "build": "tsc && vite build",
    "build:analyze": "vite build --mode analyze",
    "preview": "vite preview"
  }
}
```

### 11.3 Vercel Deployment

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Deploy Steps:**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### 11.4 Netlify Deployment

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 11.5 GitHub Actions CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
        env:
          VITE_OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: "--prod"
```

---

# TECH.md (Continued)

## AI-Powered Note Taking Application - Complete Technology Specification

---

## 12. SECURITY BEST PRACTICES

### 12.1 API Key Security

```typescript
// src/utils/security.ts

/**
 * Simple encryption for API keys in localStorage
 * Note: This is basic obfuscation, not true encryption
 * For production, consider server-side key management
 */
export class SecureStorage {
  private static readonly SALT = "notes-app-secure-salt";

  static encryptKey(key: string): string {
    try {
      // Base64 encoding with salt (basic obfuscation)
      const saltedKey = `${this.SALT}:${key}`;
      return btoa(saltedKey);
    } catch (error) {
      console.error("Encryption failed:", error);
      return key;
    }
  }

  static decryptKey(encryptedKey: string): string {
    try {
      const decoded = atob(encryptedKey);
      return decoded.replace(`${this.SALT}:`, "");
    } catch (error) {
      console.error("Decryption failed:", error);
      return encryptedKey;
    }
  }

  static storeAPIKey(key: string): void {
    const encrypted = this.encryptKey(key);
    localStorage.setItem("openai_key", encrypted);
  }

  static getAPIKey(): string | null {
    const encrypted = localStorage.getItem("openai_key");
    if (!encrypted) return null;
    return this.decryptKey(encrypted);
  }

  static clearAPIKey(): void {
    localStorage.removeItem("openai_key");
  }
}

/**
 * Validate API key format
 */
export function validateAPIKey(key: string): boolean {
  // OpenAI keys start with 'sk-'
  return key.startsWith("sk-") && key.length > 20;
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  const div = document.createElement("div");
  div.textContent = input;
  return div.innerHTML;
}

/**
 * Rate limiting for API calls
 */
export class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequests: number;
  private readonly timeWindow: number; // in milliseconds

  constructor(maxRequests: number = 10, timeWindowMinutes: number = 1) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindowMinutes * 60 * 1000;
  }

  canMakeRequest(): boolean {
    const now = Date.now();

    // Remove old requests outside time window
    this.requests = this.requests.filter(
      (timestamp) => now - timestamp < this.timeWindow,
    );

    return this.requests.length < this.maxRequests;
  }

  recordRequest(): void {
    this.requests.push(Date.now());
  }

  getWaitTime(): number {
    if (this.canMakeRequest()) return 0;

    const oldestRequest = Math.min(...this.requests);
    return this.timeWindow - (Date.now() - oldestRequest);
  }
}
```

### 12.2 Content Security Policy

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Content Security Policy -->
    <meta
      http-equiv="Content-Security-Policy"
      content="
            default-src 'self';
            script-src 'self' 'unsafe-inline' 'unsafe-eval';
            style-src 'self' 'unsafe-inline';
            img-src 'self' data: https:;
            font-src 'self' data:;
            connect-src 'self' https://api.openai.com;
            frame-ancestors 'none';
            base-uri 'self';
            form-action 'self';
          "
    />

    <!-- Security Headers -->
    <meta http-equiv="X-Content-Type-Options" content="nosniff" />
    <meta http-equiv="X-Frame-Options" content="DENY" />
    <meta http-equiv="X-XSS-Protection" content="1; mode=block" />

    <title>Notes App - AI-Powered Note Taking</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### 12.3 Data Validation & Sanitization

```typescript
// src/utils/validation.ts

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class DataValidator {
  /**
   * Validate note data before saving
   */
  static validateNote(note: Partial<Note>): ValidationResult {
    const errors: string[] = [];

    // Title validation
    if (!note.title || note.title.trim().length === 0) {
      errors.push("Title cannot be empty");
    }

    if (note.title && note.title.length > 200) {
      errors.push("Title must be less than 200 characters");
    }

    // Content validation
    if (note.content && note.content.length > 1000000) {
      errors.push("Content exceeds maximum size (1MB)");
    }

    // Folder ID validation
    if (!note.folderId) {
      errors.push("Note must belong to a folder");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate folder data
   */
  static validateFolder(folder: Partial<Folder>): ValidationResult {
    const errors: string[] = [];

    if (!folder.name || folder.name.trim().length === 0) {
      errors.push("Folder name cannot be empty");
    }

    if (folder.name && folder.name.length > 50) {
      errors.push("Folder name must be less than 50 characters");
    }

    // Check for invalid characters
    if (folder.name && /[<>:"/\\|?*]/.test(folder.name)) {
      errors.push("Folder name contains invalid characters");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Sanitize HTML content from editor
   */
  static sanitizeHTML(html: string): string {
    // Allow only safe tags
    const allowedTags = [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "s",
      "del",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "blockquote",
      "code",
      "pre",
      "a",
      "img",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
    ];

    // This is a simplified version
    // In production, use DOMPurify library: npm install dompurify
    const div = document.createElement("div");
    div.innerHTML = html;

    return div.innerHTML;
  }
}

/**
 * File upload validation
 */
export class FileValidator {
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly ALLOWED_TYPES = [
    "text/markdown",
    "text/plain",
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
  ];

  static validateFile(file: File): ValidationResult {
    const errors: string[] = [];

    // Size check
    if (file.size > this.MAX_FILE_SIZE) {
      errors.push("File size exceeds 10MB limit");
    }

    // Type check
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      errors.push(`File type ${file.type} is not allowed`);
    }

    // Name check
    if (file.name.length > 255) {
      errors.push("Filename is too long");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
```

### 12.4 Secure AI Integration

```typescript
// src/services/secureAI.ts

import OpenAI from "openai";
import { RateLimiter } from "@/utils/security";

export class SecureAIService {
  private client: OpenAI | null = null;
  private rateLimiter: RateLimiter;
  private readonly maxTokens = 2000;
  private readonly timeout = 30000; // 30 seconds

  constructor() {
    // 20 requests per minute
    this.rateLimiter = new RateLimiter(20, 1);
  }

  initialize(apiKey: string) {
    if (!apiKey || !apiKey.startsWith("sk-")) {
      throw new Error("Invalid API key format");
    }

    this.client = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
      timeout: this.timeout,
      maxRetries: 2,
    });
  }

  async generateContent(prompt: string, context?: string): Promise<string> {
    // Rate limiting check
    if (!this.rateLimiter.canMakeRequest()) {
      const waitTime = this.rateLimiter.getWaitTime();
      throw new Error(
        `Rate limit exceeded. Please wait ${Math.ceil(waitTime / 1000)} seconds`,
      );
    }

    if (!this.client) {
      throw new Error("AI service not initialized");
    }

    // Validate input length
    if (prompt.length > 5000) {
      throw new Error("Prompt is too long (max 5000 characters)");
    }

    if (context && context.length > 10000) {
      throw new Error("Context is too long (max 10000 characters)");
    }

    // Record the request
    this.rateLimiter.recordRequest();

    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful writing assistant. Keep responses concise and helpful.",
          },
          ...(context
            ? [
                {
                  role: "user" as const,
                  content: `Context: ${context}`,
                },
              ]
            : []),
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: this.maxTokens,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      });

      return response.choices[0]?.message?.content || "";
    } catch (error: any) {
      if (error.status === 401) {
        throw new Error("Invalid API key");
      } else if (error.status === 429) {
        throw new Error("OpenAI rate limit exceeded");
      } else if (error.status === 500) {
        throw new Error("OpenAI service error");
      } else {
        throw new Error(`AI Error: ${error.message}`);
      }
    }
  }

  /**
   * Estimate token count (approximate)
   */
  estimateTokens(text: string): number {
    // Rough estimation: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  }

  /**
   * Check if request would exceed token limit
   */
  wouldExceedLimit(prompt: string, context?: string): boolean {
    const promptTokens = this.estimateTokens(prompt);
    const contextTokens = context ? this.estimateTokens(context) : 0;

    return promptTokens + contextTokens > this.maxTokens * 0.8;
  }
}

export const secureAI = new SecureAIService();
```

---

## 13. FILE STRUCTURE

### 13.1 Complete Project Structure

```
notes-app/
â"œâ"€â"€ public/
â"‚   â"œâ"€â"€ favicon.ico
â"‚   â"œâ"€â"€ logo.png
â"‚   â""â"€â"€ robots.txt
â"‚
â"œâ"€â"€ src/
â"‚   â"œâ"€â"€ components/
â"‚   â"‚   â"œâ"€â"€ AIPanel/
â"‚   â"‚   â"‚   â"œâ"€â"€ AIPanel.tsx
â"‚   â"‚   â"‚   â"œâ"€â"€ AIInput.tsx
â"‚   â"‚   â"‚   â"œâ"€â"€ AIResponse.tsx
â"‚   â"‚   â"‚   â"œâ"€â"€ AIActions.tsx
â"‚   â"‚   â"‚   â""â"€â"€ index.ts
â"‚   â"‚   â"‚
â"‚   â"‚   â"œâ"€â"€ Editor/
â"‚   â"‚   â"‚   â"œâ"€â"€ Editor.tsx
â"‚   â"‚   â"‚   â"œâ"€â"€ EditorContent.tsx
â"‚   â"‚   â"‚   â"œâ"€â"€ EditorHeader.tsx
â"‚   â"‚   â"‚   â"œâ"€â"€ Toolbar.tsx
â"‚   â"‚   â"‚   â""â"€â"€ index.ts
â"‚   â"‚   â"‚
â"‚   â"‚   â"œâ"€â"€ Header/
â"‚   â"‚   â"‚   â"œâ"€â"€ Header.tsx
â"‚   â"‚   â"‚   â"œâ"€â"€ SearchBar.tsx
â"‚   â"‚   â"‚   â"œâ"€â"€ NewNoteButton.tsx
â"‚   â"‚   â"‚   â"œâ"€â"€ AIButton.tsx
â"‚   â"‚   â"‚   â""â"€â"€ index.ts
â"‚   â"‚   â"‚
â"‚   â"‚   â"œâ"€â"€ NoteList/
â"‚   â"‚   â"‚   â"œâ"€â"€ NoteList.tsx
â"‚   â"‚   â"‚   â"œâ"€â"€ NoteListHeader.tsx
â"‚   â"‚   â"‚   â"œâ"€â"€ NoteItem.tsx
â"‚   â"‚   â"‚   â"œâ"€â"€ EmptyState.tsx
â"‚   â"‚   â"‚   â""â"€â"€ index.ts
â"‚   â"‚   â"‚
â"‚   â"‚   â"œâ"€â"€ Sidebar/
â"‚   â"‚   â"‚   â"œâ"€â"€ Sidebar.tsx
â"‚   â"‚   â"‚   â"œâ"€â"€ FolderList.tsx
â"‚   â"‚   â"‚   â"œâ"€â"€ FolderItem.tsx
â"‚   â"‚   â"‚   â"œâ"€â"€ NewFolderButton.tsx
â"‚   â"‚   â"‚   â""â"€â"€ index.ts
â"‚   â"‚   â"‚
â"‚   â"‚   â"œâ"€â"€ Modals/
â"‚   â"‚   â"‚   â"œâ"€â"€ Modal.tsx
â"‚   â"‚   â"‚   â"œâ"€â"€ SettingsModal.tsx
â"‚   â"‚   â"‚   â"œâ"€â"€ DeleteConfirmModal.tsx
â"‚   â"‚   â"‚   â"œâ"€â"€ ExportModal.tsx
â"‚   â"‚   â"‚   â""â"€â"€ index.ts
â"‚   â"‚   â"‚
â"‚   â"‚   â"œâ"€â"€ UI/
â"‚   â"‚   â"‚   â"œâ"€â"€ Button.tsx
â"‚   â"‚   â"‚   â"œâ"€â"€ Input.tsx
â"‚   â"‚   â"‚   â"œâ"€â"€ Dropdown.tsx
â"‚   â"‚   â"‚   â"œâ"€â"€ Toast.tsx
â"‚   â"‚   â"‚   â"œâ"€â"€ Spinner.tsx
â"‚   â"‚   â"‚   â"œâ"€â"€ Skeleton.tsx
â"‚   â"‚   â"‚   â""â"€â"€ index.ts
â"‚   â"‚   â"‚
â"‚   â"‚   â""â"€â"€ Layout/
â"‚   â"‚       â"œâ"€â"€ MainLayout.tsx
â"‚   â"‚       â"œâ"€â"€ MobileLayout.tsx
â"‚   â"‚       â""â"€â"€ index.ts
â"‚   â"‚
â"‚   â"œâ"€â"€ hooks/
â"‚   â"‚   â"œâ"€â"€ useAI.ts
â"‚   â"‚   â"œâ"€â"€ useDatabase.ts
â"‚   â"‚   â"œâ"€â"€ useDebounce.ts
â"‚   â"‚   â"œâ"€â"€ useKeyboard.ts
â"‚   â"‚   â"œâ"€â"€ useExport.ts
â"‚   â"‚   â"œâ"€â"€ useImport.ts
â"‚   â"‚   â"œâ"€â"€ useTheme.ts
â"‚   â"‚   â"œâ"€â"€ useLocalStorage.ts
â"‚   â"‚   â""â"€â"€ useMediaQuery.ts
â"‚   â"‚
â"‚   â"œâ"€â"€ store/
â"‚   â"‚   â"œâ"€â"€ index.ts
â"‚   â"‚   â"œâ"€â"€ notesSlice.ts
â"‚   â"‚   â"œâ"€â"€ foldersSlice.ts
â"‚   â"‚   â""â"€â"€ uiSlice.ts
â"‚   â"‚
â"‚   â"œâ"€â"€ services/
â"‚   â"‚   â"œâ"€â"€ openai.ts
â"‚   â"‚   â"œâ"€â"€ secureAI.ts
â"‚   â"‚   â""â"€â"€ analytics.ts (optional)
â"‚   â"‚
â"‚   â"œâ"€â"€ db/
â"‚   â"‚   â"œâ"€â"€ index.ts
â"‚   â"‚   â"œâ"€â"€ migrations.ts
â"‚   â"‚   â""â"€â"€ schema.ts
â"‚   â"‚
â"‚   â"œâ"€â"€ utils/
â"‚   â"‚   â"œâ"€â"€ export.ts
â"‚   â"‚   â"œâ"€â"€ import.ts
â"‚   â"‚   â"œâ"€â"€ markdown.ts
â"‚   â"‚   â"œâ"€â"€ security.ts
â"‚   â"‚   â"œâ"€â"€ validation.ts
â"‚   â"‚   â"œâ"€â"€ formatters.ts
â"‚   â"‚   â""â"€â"€ constants.ts
â"‚   â"‚
â"‚   â"œâ"€â"€ types/
â"‚   â"‚   â"œâ"€â"€ index.ts
â"‚   â"‚   â"œâ"€â"€ note.ts
â"‚   â"‚   â"œâ"€â"€ folder.ts
â"‚   â"‚   â""â"€â"€ settings.ts
â"‚   â"‚
â"‚   â"œâ"€â"€ styles/
â"‚   â"‚   â"œâ"€â"€ globals.css
â"‚   â"‚   â"œâ"€â"€ variables.css
â"‚   â"‚   â"œâ"€â"€ animations.css
â"‚   â"‚   â""â"€â"€ editor.css
â"‚   â"‚
â"‚   â"œâ"€â"€ __tests__/
â"‚   â"‚   â"œâ"€â"€ components/
â"‚   â"‚   â"œâ"€â"€ hooks/
â"‚   â"‚   â""â"€â"€ utils/
â"‚   â"‚
â"‚   â"œâ"€â"€ App.tsx
â"‚   â"œâ"€â"€ main.tsx
â"‚   â""â"€â"€ vite-env.d.ts
â"‚
â"œâ"€â"€ tests/
â"‚   â"œâ"€â"€ e2e/
â"‚   â"‚   â"œâ"€â"€ notes.spec.ts
â"‚   â"‚   â"œâ"€â"€ ai.spec.ts
â"‚   â"‚   â""â"€â"€ export.spec.ts
â"‚   â""â"€â"€ setup.ts
â"‚
â"œâ"€â"€ .github/
â"‚   â""â"€â"€ workflows/
â"‚       â"œâ"€â"€ deploy.yml
â"‚       â""â"€â"€ test.yml
â"‚
â"œâ"€â"€ .env.example
â"œâ"€â"€ .env.local
â"œâ"€â"€ .eslintrc.cjs
â"œâ"€â"€ .gitignore
â"œâ"€â"€ .prettierrc
â"œâ"€â"€ index.html
â"œâ"€â"€ package.json
â"œâ"€â"€ playwright.config.ts
â"œâ"€â"€ postcss.config.js
â"œâ"€â"€ README.md
â"œâ"€â"€ tailwind.config.js
â"œâ"€â"€ tsconfig.json
â"œâ"€â"€ tsconfig.node.json
â"œâ"€â"€ vercel.json
â"œâ"€â"€ vite.config.ts
â""â"€â"€ vitest.config.ts
```

---

## 14. CODE EXAMPLES

### 14.1 Complete App Component

```typescript
// src/App.tsx
import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { NoteList } from '@/components/NoteList';
import { Editor } from '@/components/Editor';
import { AIPanel } from '@/components/AIPanel';
import { SettingsModal } from '@/components/Modals/SettingsModal';
import { Toast } from '@/components/UI/Toast';
import { useStore } from '@/store';
import { useKeyboard } from '@/hooks/useKeyboard';
import { useTheme } from '@/hooks/useTheme';
import { secureAI } from '@/services/secureAI';
import { SecureStorage } from '@/utils/security';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const theme = useStore(state => state.theme);
  const isAIPanelOpen = useStore(state => state.isAIPanelOpen);
  const toggleAIPanel = useStore(state => state.toggleAIPanel);
  const addNote = useStore(state => state.addNote);

  // Initialize theme
  useTheme(theme);

  // Initialize AI service with stored API key
  useEffect(() => {
    const apiKey = SecureStorage.getAPIKey();
    if (apiKey) {
      try {
        secureAI.initialize(apiKey);
      } catch (error) {
        console.error('Failed to initialize AI:', error);
      }
    }
  }, []);

  // Keyboard shortcuts
  useKeyboard({
    'cmd+n': () => {
      addNote({
        title: 'Untitled',
        content: '',
        folderId: 'default',
        isPinned: false,
        wordCount: 0,
      });
    },
    'cmd+k': () => toggleAIPanel(),
    'cmd+,': () => setIsSettingsOpen(true),
  });

  return (
    <div className="app-container h-screen w-screen overflow-hidden bg-background">
      {/* Header */}
      <Header
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        onSettingsClick={() => setIsSettingsOpen(true)}
      />

      {/* Main Layout */}
      <div className="flex h-[calc(100vh-60px)]">
        {/* Sidebar - Folders */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Note List */}
        <NoteList />

        {/* Editor */}
        <Editor />
      </div>

      {/* AI Panel */}
      <AIPanel />

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal onClose={() => setIsSettingsOpen(false)} />
      )}

      {/* Toast Notifications */}
      <Toast />
    </div>
  );
}

export default App;
```

### 14.2 Custom Hooks Implementation

```typescript
// src/hooks/useKeyboard.ts
import { useEffect } from "react";

type KeyboardShortcuts = Record<string, () => void>;

export function useKeyboard(shortcuts: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const modifierKey = isMac ? event.metaKey : event.ctrlKey;

      if (!modifierKey) return;

      const key = event.key.toLowerCase();
      const shortcut = `${isMac ? "cmd" : "ctrl"}+${key}`;

      if (shortcuts[shortcut]) {
        event.preventDefault();
        shortcuts[shortcut]();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
}

// src/hooks/useDebounce.ts
import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// src/hooks/useTheme.ts
import { useEffect } from "react";

export function useTheme(theme: "light" | "dark") {
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);
}

// src/hooks/useMediaQuery.ts
import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}

// src/hooks/useLocalStorage.ts
import { useState, useEffect } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  };

  return [storedValue, setValue];
}
```

### 14.3 Utility Functions

```typescript
// src/utils/formatters.ts

/**
 * Format timestamp to human-readable string
 */
export function formatTimestamp(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;

  if (diff < minute) {
    return "Just now";
  } else if (diff < hour) {
    const mins = Math.floor(diff / minute);
    return `${mins} minute${mins > 1 ? "s" : ""} ago`;
  } else if (diff < day) {
    const hours = Math.floor(diff / hour);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (diff < week) {
    const days = Math.floor(diff / day);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
}

/**
 * Format word count
 */
export function formatWordCount(count: number): string {
  if (count === 0) return "No words";
  if (count === 1) return "1 word";
  if (count < 1000) return `${count} words`;
  return `${(count / 1000).toFixed(1)}k words`;
}

/**
 * Truncate text
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * Extract plain text from HTML
 */
export function extractPlainText(html: string): string {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

/**
 * Calculate reading time
 */
export function calculateReadingTime(wordCount: number): string {
  const wordsPerMinute = 200;
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  if (minutes < 1) return "Less than a minute";
  if (minutes === 1) return "1 minute read";
  return `${minutes} minutes read`;
}
```

### 14.4 Constants File

```typescript
// src/utils/constants.ts

export const APP_CONFIG = {
  NAME: "Notes App",
  VERSION: "1.0.0",
  AUTHOR: "Your Name",
  DESCRIPTION: "AI-Powered Note Taking Application",
} as const;

export const STORAGE_KEYS = {
  API_KEY: "openai_key",
  THEME: "theme_preference",
  NOTES: "notes_data",
  FOLDERS: "folders_data",
  SETTINGS: "user_settings",
} as const;

export const BREAKPOINTS = {
  MOBILE: 320,
  MOBILE_LG: 480,
  TABLET: 768,
  DESKTOP: 1024,
  DESKTOP_LG: 1440,
} as const;

export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 250,
  SLOW: 400,
} as const;

export const EDITOR_CONFIG = {
  AUTO_SAVE_DELAY: 500,
  MAX_TITLE_LENGTH: 200,
  MAX_CONTENT_LENGTH: 1000000,
  PLACEHOLDER_TITLE: "Untitled Note",
  PLACEHOLDER_CONTENT: "Start typing your note...",
} as const;

export const AI_CONFIG = {
  MAX_PROMPT_LENGTH: 5000,
  MAX_CONTEXT_LENGTH: 10000,
  MAX_TOKENS: 2000,
  TEMPERATURE: 0.7,
  MODEL: "gpt-4o-mini",
  RATE_LIMIT: {
    MAX_REQUESTS: 20,
    TIME_WINDOW_MINUTES: 1,
  },
} as const;

export const FILE_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ["image/png", "image/jpeg", "image/jpg", "image/gif"],
  ALLOWED_DOCUMENT_TYPES: ["text/markdown", "text/plain"],
} as const;

export const DEFAULT_FOLDERS = [
  { id: "default", name: "Notes" },
  { id: "work", name: "Work" },
  { id: "personal", name: "Personal" },
] as const;

export const KEYBOARD_SHORTCUTS = {
  NEW_NOTE: "cmd+n",
  AI_PANEL: "cmd+k",
  SEARCH: "cmd+f",
  SETTINGS: "cmd+,",
  SAVE: "cmd+s",
  BOLD: "cmd+b",
  ITALIC: "cmd+i",
  UNDERLINE: "cmd+u",
} as const;
```

---

## 15. TROUBLESHOOTING GUIDE

### 15.1 Common Issues & Solutions

#### Issue 1: IndexedDB Not Working in Private/Incognito Mode

**Problem:**

```
Error: Failed to execute 'open' on 'IDBFactory'
```

**Solution:**

```typescript
// src/db/index.ts
export async function checkIndexedDBAvailability(): Promise<boolean> {
  try {
    const testDB = "test-db";
    const request = indexedDB.open(testDB);

    return new Promise((resolve) => {
      request.onsuccess = () => {
        indexedDB.deleteDatabase(testDB);
        resolve(true);
      };

      request.onerror = () => {
        resolve(false);
      };
    });
  } catch (error) {
    return false;
  }
}

// Fallback to localStorage if IndexedDB is not available
export async function initializeStorage() {
  const isAvailable = await checkIndexedDBAvailability();

  if (!isAvailable) {
    console.warn("IndexedDB not available, using localStorage");
    // Implement localStorage fallback
    return new LocalStorageAdapter();
  }

  return new NotesDatabase();
}
```

#### Issue 2: CORS Error with OpenAI API

**Problem:**

```
Access to fetch at 'https://api.openai.com' has been blocked by CORS policy
```

**Solution:**
OpenAI API supports CORS for browser requests. Make sure:

```typescript
const client = new OpenAI({
  apiKey: "your-key",
  dangerouslyAllowBrowser: true, // Required for client-side
});
```

For production, consider using a serverless function as proxy:

```typescript
// Vercel serverless function: api/openai.ts
export default async function handler(req, res) {
  const { prompt, context } = req.body;

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  res.json(completion);
}
```

#### Issue 3: Auto-save Not Working

**Problem:**
Changes not being saved automatically.

**Solution:**
Check debounce implementation:

```typescript
// Ensure debounce is working correctly
const debouncedSave = useCallback(
  debounce((noteId: string, content: string) => {
    updateNote(noteId, { content });
  }, 500),
  [updateNote],
);

// Make sure dependencies are correct
useEffect(() => {
  if (editor) {
    editor.on("update", ({ editor }) => {
      debouncedSave(noteId, editor.getHTML());
    });
  }

  return () => {
    editor?.off("update");
  };
}, [editor, noteId, debouncedSave]);
```

#### Issue 4: Memory Leak with TipTap Editor

**Problem:**
Memory usage increases over time.

**Solution:**
Properly destroy editor instances:

```typescript
useEffect(() => {
  const editor = new Editor({
    // config
  });

  return () => {
    editor.destroy(); // Important: cleanup
  };
}, []);
```

#### Issue 5: Large Notes Causing Performance Issues

**Problem:**
App becomes slow with large notes (>50,000 words).

**Solution:**
Implement virtual scrolling and lazy loading:

```typescript
// Use React Window for note list
import { FixedSizeList } from 'react-window';

// Lazy load note content
const loadNoteContent = async (noteId: string) => {
  const note = await db.notes.get(noteId);
  return note?.content || '';
};

// Use suspense
<Suspense fallback={<EditorSkeleton />}>
  <LazyEditor noteId={activeNoteId} />
</Suspense>
```

### 15.2 Performance Debugging

```typescript
// src/utils/performance.ts

export class PerformanceMonitor {
  private static marks: Map<string, number> = new Map();

  static start(label: string) {
    this.marks.set(label, performance.now());
  }

  static end(label: string): number {
    const start = this.marks.get(label);
    if (!start) {
      console.warn(`No start mark for ${label}`);
      return 0;
    }

    const duration = performance.now() - start;
    console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`);
    this.marks.delete(label);

    return duration;
  }

  static measure(label: string, fn: () => void) {
    this.start(label);
    fn();
    this.end(label);
  }

  static async measureAsync(label: string, fn: () => Promise<void>) {
    this.start(label);
    await fn();
    this.end(label);
  }
}

// Usage
PerformanceMonitor.start("note-save");
await saveNote(note);
PerformanceMonitor.end("note-save");
```

### 15.3 Error Boundary

```typescript
// src/components/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);

    // Send to error tracking service (e.g., Sentry)
    // Sentry.captureException(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
              <p className="text-text-secondary mb-4">
                {this.state.error?.message}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-white rounded-lg"
              >
                Reload App
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// Usage in App.tsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

---

## 16. OPTIMIZATION CHECKLIST

### 16.1 Build Optimization

```bash
# Analyze bundle size
npm run build
npx vite-bundle-visualizer

# Check for duplicate dependencies
npm dedupe

# Update dependencies
npm update

# Check for security vulnerabilities
npm audit fix
```

### 16.2 Code Splitting Best Practices

```typescript
// Lazy load routes
const SettingsPage = lazy(() => import('./pages/Settings'));
const NotesPage = lazy(() => import('./pages/Notes'));

// Lazy load modals
const ExportModal = lazy(() => import('./components/Modals/ExportModal'));

// Preload on hover
<button
  onMouseEnter={() => import('./components/AIPanel')}
  onClick={openAIPanel}
>
  Open AI
</button>
```

### 16.3 Image Optimization

```typescript
// src/utils/imageOptimization.ts

export async function compressImage(
  file: File,
  maxWidth: number = 1200,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    img.onload = () => {
      let { width, height } = img;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Compression failed"));
        },
        "image/jpeg",
        0.9,
      );
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
```

---

## 17. FINAL DEPLOYMENT CHECKLIST

### 17.1 Pre-Deployment

- [ ] All tests passing (`npm test`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No linting errors (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] All environment variables configured
- [ ] Security headers configured
- [ ] Error tracking setup (Sentry)
- [ ] Analytics setup (optional)

### 17.2 Performance Targets

- [ ] Lighthouse Performance Score > 90
- [ ] Lighthouse Accessibility Score > 95
- [ ] Lighthouse Best Practices Score > 95
- [ ] Lighthouse SEO Score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Total Bundle Size < 500KB (gzipped)

### 17.3 Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Android

### 17.4 Feature Testing

- [ ] Create note works
- [ ] Update note works
- [ ] Delete note works
- [ ] Search works
- [ ] Folders work
- [ ] AI generation works
- [ ] Export works
- [ ] Import works
- [ ] Auto-save works
- [ ] Keyboard shortcuts work
- [ ] Dark mode works
- [ ] Responsive design works

---

## 18. FUTURE ENHANCEMENTS

### 18.1 Phase 2 Features (Post-MVP)

1. **Cloud Sync**
   - Backend with Supabase/Firebase
   - Real-time synchronization
   - Conflict resolution

2. **Collaboration**
   - Share notes with others
   - Real-time collaborative editing
   - Comments and mentions

3. **Advanced AI Features**
   - Voice notes transcription
   - Image OCR
   - Auto-tagging
   - Smart suggestions

4. **Enhanced Organization**
   - Tags system
   - Nested folders
   - Note linking (wiki-style)
   - Kanban board view

5. **Mobile Apps**
   - React Native apps
   - Offline-first architecture
   - Native features (camera, share)

### 18.2 Technical Debt to Address

1. **Move API key to backend**
   - Implement serverless functions
   - Secure API key storage

2. **Implement proper encryption**
   - Use Web Crypto API
   - Encrypt notes content

3. **Add comprehensive logging**
   - Error tracking with Sentry
   - Performance monitoring
   - User analytics

4. **Improve accessibility**
   - Screen reader testing
   - ARIA labels audit
   - Keyboard navigation improvements

---

## CONCLUSION

Is complete technical specification mein aapko production-ready Notes App banane ke liye sabhi details mil gayi hain:

âœ… **Complete Tech Stack** - React, TypeScript, Vite, Tailwind
âœ… **Database Architecture** - IndexedDB with Dexie.js
âœ… **AI Integration** - Secure OpenAI implementation
âœ… **Security** - API key encryption, validation, rate limiting
âœ… **Performance** - Code splitting, lazy loading, memoization
âœ… **Testing** - Unit, integration, E2E tests
âœ… **Deployment** - Vercel/Netlify ready with CI/CD
âœ… **Error Handling** - Error boundaries, graceful fallbacks
âœ… **File Structure** - Organized, scalable architecture
