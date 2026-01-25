import { Menu, Search, Plus, Sparkles, Settings } from 'lucide-react';
import { useStore } from '../../store';

interface HeaderProps {
  onMenuClick?: () => void;
  onSettingsClick?: () => void;
}

export function Header({ onMenuClick, onSettingsClick }: HeaderProps) {
  const { setSearchQuery, toggleAIPanel, addNote } = useStore();

  const handleNewNote = () => {
    addNote({
      title: 'Untitled Note',
      content: '',
      folderId: 'default',
      isPinned: false,
      wordCount: 0,
    });
  };

  return (
    <header className="h-[60px] px-6 flex items-center gap-3 border-b border-border bg-background">
      <button
        onClick={onMenuClick}
        className="p-2 rounded-md hover:bg-surface transition md:hidden"
        aria-label="Menu"
      >
        <Menu size={20} />
      </button>

      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={16} />
        <input
          type="text"
          className="w-full h-9 pl-10 pr-4 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Search notes..."
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <button
        onClick={handleNewNote}
        className="h-9 px-4 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition flex items-center gap-2"
      >
        <Plus size={16} />
        <span className="hidden sm:inline">New Note</span>
      </button>

      <button
        onClick={toggleAIPanel}
        className="h-9 w-9 rounded-lg bg-ai-primary text-white hover:opacity-90 transition flex items-center justify-center"
        aria-label="AI Assistant"
      >
        <Sparkles size={16} />
      </button>

      <button
        onClick={onSettingsClick}
        className="h-9 w-9 rounded-lg hover:bg-surface transition flex items-center justify-center"
        aria-label="Settings"
      >
        <Settings size={20} />
      </button>
    </header>
  );
}
