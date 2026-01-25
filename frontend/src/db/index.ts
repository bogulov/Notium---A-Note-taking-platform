import Dexie, { type Table } from 'dexie';

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
  syncStatus?: string;
}

export interface Folder {
  id?: string;
  name: string;
  createdAt: number;
  color?: string;
  icon?: string;
  position?: number;
}

export interface Settings {
  id?: number;
  theme: 'light' | 'dark';
  openAIKey?: string;
  aiModel: string;
  autoSaveDelay: number;
}

export class NotesDatabase extends Dexie {
  notes!: Table<Note, string>;
  folders!: Table<Folder, string>;
  settings!: Table<Settings, number>;

  constructor() {
    super('NotesDatabase');

    this.version(1).stores({
      notes: 'id, folderId, createdAt, updatedAt, isPinned',
      folders: 'id, createdAt',
      settings: '++id',
    });
  }
}

export const db = new NotesDatabase();
