import { useEffect, useMemo } from 'react';
import { useStore } from '../../store';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

export function Editor() {
  const notes = useStore(state => state.notes);
  const activeNoteId = useStore(state => state.activeNoteId);
  const updateNote = useStore(state => state.updateNote);

  const activeNote = useMemo(() => {
    return notes.find(n => n.id === activeNoteId) || null;
  }, [notes, activeNoteId]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start typing your note...',
      }),
    ],
    content: activeNote?.content || '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[calc(100vh-200px)] p-6',
      },
    },
    onUpdate: ({ editor }) => {
      if (activeNote?.id) {
        const html = editor.getHTML();
        const text = editor.getText();
        const wordCount = text.split(/\s+/).filter(Boolean).length;

        updateNote(activeNote.id, {
          content: html,
          wordCount,
        });
      }
    },
  });

  useEffect(() => {
    if (editor && activeNote) {
      editor.commands.setContent(activeNote.content || '');
    }
  }, [activeNote?.id, editor]);

  if (!activeNote) {
    return (
      <div className="flex-1 flex items-center justify-center text-text-secondary">
        <div className="text-center">
          <p className="text-lg mb-2">No note selected</p>
          <p className="text-sm">Select a note from the list or create a new one</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="max-w-3xl mx-auto">
        <input
          type="text"
          value={activeNote.title}
          onChange={e => {
            if (activeNote.id) {
              updateNote(activeNote.id, { title: e.target.value });
            }
          }}
          className="w-full text-2xl font-semibold p-6 pb-2 border-none outline-none bg-transparent text-text-primary"
          placeholder="Untitled Note"
        />
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
