export interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string;
  isPinned: boolean;
  isFavorite?: boolean;
  createdAt: number;
  updatedAt: number;
  wordCount: number;
  tags?: string[];
  syncStatus?: string;
}

export interface Folder {
  id: string;
  name: string;
  createdAt: number;
  color?: string;
  icon?: string;
  position?: number;
}

export interface AppState {
  notes: Note[];
  folders: Folder[];
  activeNoteId: string | null;
  activeFolderId: string;
  searchQuery: string;
  isAIPanelOpen: boolean;
  theme: 'light' | 'dark';
}
