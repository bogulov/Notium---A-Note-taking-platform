import { useState, useRef } from 'react';
import { X, Download, Upload, FileText, FileJson } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store';
import { exportNoteAsMarkdown, exportNoteAsText } from '../../utils/export';
import type { Note } from '../../types';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportExportModal({ isOpen, onClose }: ImportExportModalProps) {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const notes = useStore(state => state.notes);
  const activeNoteId = useStore(state => state.activeNoteId);
  const addNote = useStore(state => state.addNote);

  const activeNote = notes.find(n => n.id === activeNoteId);

  const handleExportMarkdown = () => {
    if (activeNote) {
      exportNoteAsMarkdown(activeNote);
      onClose();
    }
  };

  const handleExportText = () => {
    if (activeNote) {
      exportNoteAsText(activeNote);
      onClose();
    }
  };

  const handleExportAllJSON = () => {
    const data = JSON.stringify(notes, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notium-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onClose();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const content = event.target?.result as string;
        const importedNotes = JSON.parse(content) as Note[];

        if (!Array.isArray(importedNotes)) {
          throw new Error('Invalid format: expected array of notes');
        }

        let imported = 0;
        importedNotes.forEach(note => {
          if (note.title && note.content !== undefined) {
            addNote({
              title: note.title,
              content: note.content,
              folderId: note.folderId || 'default',
              isPinned: note.isPinned || false,
              wordCount: note.wordCount || 0,
              tags: note.tags,
            });
            imported++;
          }
        });

        setImportStatus(`Successfully imported ${imported} note(s)`);
        setTimeout(() => {
          setImportStatus(null);
          onClose();
        }, 2000);
      } catch (error) {
        setImportStatus('Error: Invalid file format');
        setTimeout(() => setImportStatus(null), 3000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-background rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-text-primary">Import / Export</h2>
              <button onClick={onClose} className="p-1 hover:bg-surface rounded-md transition">
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border">
              <button
                onClick={() => setActiveTab('export')}
                className={`flex-1 py-3 text-sm font-medium transition ${
                  activeTab === 'export'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <Download size={16} className="inline mr-2" />
                Export
              </button>
              <button
                onClick={() => setActiveTab('import')}
                className={`flex-1 py-3 text-sm font-medium transition ${
                  activeTab === 'import'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <Upload size={16} className="inline mr-2" />
                Import
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              {activeTab === 'export' ? (
                <div className="space-y-3">
                  {activeNote ? (
                    <>
                      <p className="text-sm text-text-secondary mb-4">
                        Export "{activeNote.title || 'Untitled Note'}"
                      </p>
                      <button
                        onClick={handleExportMarkdown}
                        className="w-full flex items-center gap-3 p-3 bg-surface rounded-lg hover:bg-surface-hover transition"
                      >
                        <FileText size={20} className="text-primary" />
                        <div className="text-left">
                          <div className="text-sm font-medium text-text-primary">
                            Markdown (.md)
                          </div>
                          <div className="text-xs text-text-secondary">
                            With frontmatter metadata
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={handleExportText}
                        className="w-full flex items-center gap-3 p-3 bg-surface rounded-lg hover:bg-surface-hover transition"
                      >
                        <FileText size={20} className="text-text-secondary" />
                        <div className="text-left">
                          <div className="text-sm font-medium text-text-primary">
                            Plain Text (.txt)
                          </div>
                          <div className="text-xs text-text-secondary">Text content only</div>
                        </div>
                      </button>
                    </>
                  ) : (
                    <p className="text-sm text-text-secondary text-center py-4">
                      Select a note to export
                    </p>
                  )}

                  <hr className="border-border my-4" />

                  <button
                    onClick={handleExportAllJSON}
                    className="w-full flex items-center gap-3 p-3 bg-surface rounded-lg hover:bg-surface-hover transition"
                    disabled={notes.length === 0}
                  >
                    <FileJson size={20} className="text-success" />
                    <div className="text-left">
                      <div className="text-sm font-medium text-text-primary">
                        Export All Notes (.json)
                      </div>
                      <div className="text-xs text-text-secondary">
                        {notes.length} notes as backup
                      </div>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-text-secondary">
                    Import notes from a JSON backup file.
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <button
                    onClick={handleImportClick}
                    className="w-full flex flex-col items-center gap-2 p-8 border-2 border-dashed border-border rounded-lg hover:border-primary transition"
                  >
                    <Upload size={32} className="text-text-secondary" />
                    <span className="text-sm text-text-primary font-medium">Choose JSON File</span>
                    <span className="text-xs text-text-secondary">or drag and drop</span>
                  </button>

                  {importStatus && (
                    <div
                      className={`text-sm text-center py-2 rounded-lg ${
                        importStatus.startsWith('Error')
                          ? 'bg-red-100 text-red-600'
                          : 'bg-green-100 text-green-600'
                      }`}
                    >
                      {importStatus}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
