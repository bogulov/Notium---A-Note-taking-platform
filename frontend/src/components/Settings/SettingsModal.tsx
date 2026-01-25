import { useState } from 'react';
import { X, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store';
import { ImportExportModal } from '../ImportExport/ImportExportModal';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme, setTheme } = useStore();
  const [showImportExport, setShowImportExport] = useState(false);

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
  ] as const;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-background rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-semibold text-text-primary">Settings</h2>
                <button onClick={onClose} className="p-1 hover:bg-surface rounded-md transition">
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 space-y-6">
                {/* Theme Section */}
                <div>
                  <h3 className="text-sm font-medium text-text-secondary mb-3">Appearance</h3>
                  <div className="flex gap-2">
                    {themeOptions.map(option => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.value}
                          onClick={() => setTheme(option.value)}
                          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border transition ${
                            theme === option.value
                              ? 'bg-primary text-white border-primary'
                              : 'bg-surface border-border hover:border-primary'
                          }`}
                        >
                          <Icon size={18} />
                          <span className="text-sm font-medium">{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* App Info */}
                <div>
                  <h3 className="text-sm font-medium text-text-secondary mb-3">About</h3>
                  <div className="bg-surface rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">N</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-text-primary">Notium</h4>
                        <p className="text-xs text-text-secondary">Version 1.0.0</p>
                      </div>
                    </div>
                    <p className="text-sm text-text-secondary">
                      AI-powered note-taking application for modern productivity.
                    </p>
                  </div>
                </div>

                {/* Data Section */}
                <div>
                  <h3 className="text-sm font-medium text-text-secondary mb-3">Data</h3>
                  <button
                    onClick={() => {
                      onClose();
                      setShowImportExport(true);
                    }}
                    className="w-full text-left px-4 py-3 bg-surface rounded-lg hover:bg-surface-hover transition text-sm text-text-primary"
                  >
                    Import / Export Notes
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ImportExportModal isOpen={showImportExport} onClose={() => setShowImportExport(false)} />
    </>
  );
}
