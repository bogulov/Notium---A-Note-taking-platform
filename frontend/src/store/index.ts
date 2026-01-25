import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { nanoid } from 'nanoid';
import type { Note, Folder } from '../types';

interface AppState {
  // State
  notes: Note[];
  folders: Folder[];
  activeNoteId: string | null;
  activeFolderId: string;
  searchQuery: string;
  isAIPanelOpen: boolean;
  theme: 'light' | 'dark';

  // Actions - Notes
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
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
  setTheme: (theme: 'light' | 'dark') => void;

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
        folders: [{ id: 'default', name: 'Notes', createdAt: Date.now() }],
        activeNoteId: null,
        activeFolderId: 'default',
        searchQuery: '',
        isAIPanelOpen: false,
        theme: 'light',

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
            state.notes.forEach((note) => {
              if (note.folderId === id) note.folderId = 'default';
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
                n.content.toLowerCase().includes(query)
            );
          }

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
        name: 'notes-storage',
        partialize: (state) => ({
          notes: state.notes,
          folders: state.folders,
          theme: state.theme,
        }),
      }
    )
  )
);
