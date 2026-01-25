import { useState } from 'react';
import { Pin, Trash2 } from 'lucide-react';
import { useStore } from '../../store';
import type { Note } from '../../types';
import { formatTimestamp } from '../../utils/formatters';

interface NoteItemProps {
  note: Note;
}

export function NoteItem({ note }: NoteItemProps) {
  const { activeNoteId, setActiveNote, updateNote, deleteNote } = useStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isActive = note.id === activeNoteId;

  const preview = note.content
    .replace(/<[^>]*>/g, '')
    .substring(0, 100)
    .trim();

  const handlePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (note.id) {
      updateNote(note.id, { isPinned: !note.isPinned });
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const confirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (note.id) {
      deleteNote(note.id);
    }
    setShowDeleteConfirm(false);
  };

  const cancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  return (
    <div
      onClick={() => note.id && setActiveNote(note.id)}
      className={`group relative min-h-[80px] px-4 py-3 border-b border-border-light cursor-pointer transition ${
        isActive ? 'bg-primary-light border-l-[3px] border-l-primary' : 'hover:bg-surface'
      }`}
    >
      {/* Delete Confirmation Overlay */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-white/95 dark:bg-gray-900/95 z-10 flex items-center justify-center gap-2 p-2">
          <span className="text-sm text-text-secondary">Delete note?</span>
          <button
            onClick={confirmDelete}
            className="px-3 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Delete
          </button>
          <button
            onClick={cancelDelete}
            className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handlePin}
          className={`p-1.5 rounded-md transition ${
            note.isPinned ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
          }`}
          title={note.isPinned ? 'Unpin note' : 'Pin note'}
        >
          <Pin size={14} />
        </button>
        <button
          onClick={handleDelete}
          className="p-1.5 rounded-md bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-500 transition"
          title="Delete note"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="flex items-center justify-between mb-1 pr-16">
        <h3 className="text-base font-semibold text-text-primary truncate flex-1">
          {note.title || 'Untitled Note'}
        </h3>
        {note.isPinned && <Pin size={16} className="text-primary flex-shrink-0 ml-2" />}
      </div>

      {preview && <p className="text-sm text-text-secondary line-clamp-2 mb-2">{preview}</p>}

      <div className="flex items-center gap-2 text-xs text-text-tertiary">
        <span>{formatTimestamp(note.updatedAt)}</span>
        <span>·</span>
        <span>{note.wordCount || 0} words</span>
      </div>
    </div>
  );
}
