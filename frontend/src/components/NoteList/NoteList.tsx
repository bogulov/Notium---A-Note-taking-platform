import { useMemo } from 'react';
import { useStore } from '../../store';
import { NoteItem } from './NoteItem';

export function NoteList() {
  const notes = useStore(state => state.notes);
  const activeFolderId = useStore(state => state.activeFolderId);
  const searchQuery = useStore(state => state.searchQuery);

  const filteredNotes = useMemo(() => {
    let filtered = notes.filter(n => n.folderId === activeFolderId);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        n => n.title.toLowerCase().includes(query) || n.content.toLowerCase().includes(query)
      );
    }

    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.updatedAt - a.updatedAt;
    });
  }, [notes, activeFolderId, searchQuery]);

  return (
    <div className="w-[280px] bg-background border-r border-border flex flex-col overflow-hidden">
      <div className="h-12 px-4 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">Notes</h2>
        <span className="text-sm text-text-secondary">{filteredNotes.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredNotes.length === 0 ? (
          <div className="p-8 text-center text-text-secondary">
            <p>No notes yet</p>
            <p className="text-sm mt-2">Create your first note to get started</p>
          </div>
        ) : (
          filteredNotes.map(note => <NoteItem key={note.id} note={note} />)
        )}
      </div>
    </div>
  );
}
