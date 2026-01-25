import { useEffect, useMemo, useState } from 'react';
import { Download, FileDown } from 'lucide-react';
import { useStore } from '../../store';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { exportNoteAsMarkdown, exportNoteAsText } from '../../utils/export';

export function Editor() {
  const notes = useStore(state => state.notes);
  const activeNoteId = useStore(state => state.activeNoteId);
  const updateNote = useStore(state => state.updateNote);
  const [showExportMenu, setShowExportMenu] = useState(false);

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

  const handleExportMarkdown = () => {
    if (activeNote) {
      exportNoteAsMarkdown(activeNote);
      setShowExportMenu(false);
    }
  };

  const handleExportText = () => {
    if (activeNote) {
      exportNoteAsText(activeNote);
      setShowExportMenu(false);
    }
  };

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
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 pt-4">
          <input
            type="text"
            value={activeNote.title}
            onChange={e => {
              if (activeNote.id) {
                updateNote(activeNote.id, { title: e.target.value });
              }
            }}
            className="flex-1 text-2xl font-semibold border-none outline-none bg-transparent text-text-primary"
            placeholder="Untitled Note"
          />

          {/* Export Button */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface rounded-lg transition"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Export</span>
            </button>

            {showExportMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowExportMenu(false)} />
                <div className="absolute right-0 top-full mt-1 w-48 bg-background border border-border rounded-lg shadow-lg z-20 overflow-hidden">
                  <button
                    onClick={handleExportMarkdown}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-text-primary hover:bg-surface transition"
                  >
                    <FileDown size={16} />
                    Export as Markdown
                  </button>
                  <button
                    onClick={handleExportText}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-text-primary hover:bg-surface transition border-t border-border"
                  >
                    <FileDown size={16} />
                    Export as Text
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
