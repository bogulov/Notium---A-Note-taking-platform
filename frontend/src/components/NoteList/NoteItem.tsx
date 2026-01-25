import { Pin } from 'lucide-react';
import { useStore } from '../../store';
import type { Note } from '../../types';
import { formatTimestamp } from '../../utils/formatters';

interface NoteItemProps {
  note: Note;
}

export function NoteItem({ note }: NoteItemProps) {
  const { activeNoteId, setActiveNote } = useStore();
  const isActive = note.id === activeNoteId;

  const preview = note.content
    .replace(/<[^>]*>/g, '')
    .substring(0, 100)
    .trim();

  return (
    <div
      onClick={() => note.id && setActiveNote(note.id)}
      className={`min-h-[80px] px-4 py-3 border-b border-border-light cursor-pointer transition ${
        isActive
          ? 'bg-primary-light border-l-[3px] border-l-primary'
          : 'hover:bg-surface'
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-base font-semibold text-text-primary truncate flex-1">
          {note.title || 'Untitled Note'}
        </h3>
        {note.isPinned && <Pin size={16} className="text-primary flex-shrink-0 ml-2" />}
      </div>

      {preview && (
        <p className="text-sm text-text-secondary line-clamp-2 mb-2">{preview}</p>
      )}

      <div className="flex items-center gap-2 text-xs text-text-tertiary">
        <span>{formatTimestamp(note.updatedAt)}</span>
        <span>·</span>
        <span>{note.wordCount || 0} words</span>
      </div>
    </div>
  );
}
