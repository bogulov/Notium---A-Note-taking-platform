import { useState, useMemo } from 'react';
import { X, Send, Copy, RotateCw, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store';
import { aiService } from '../../services/openai';

export function AIPanel() {
  const isOpen = useStore(state => state.isAIPanelOpen);
  const togglePanel = useStore(state => state.toggleAIPanel);
  const notes = useStore(state => state.notes);
  const activeNoteId = useStore(state => state.activeNoteId);

  const activeNote = useMemo(() => {
    return notes.find(n => n.id === activeNoteId) || null;
  }, [notes, activeNoteId]);

  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    setError(null);
    setResponse('');

    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error(
          'OpenAI API key not configured. Please set VITE_OPENAI_API_KEY in your .env file.'
        );
      }

      if (!(aiService as any).client) {
        aiService.initialize(apiKey);
      }

      const context = activeNote?.content || '';
      const result = await aiService.generateContent(input, context);
      setResponse(result);
      setInput('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
  };

  const handleInsert = () => {
    if (activeNote && response) {
      // This would insert into the editor
      // For now, just copy to clipboard
      handleCopy();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 right-6 w-[400px] max-h-[600px] bg-background border border-ai-border rounded-t-xl shadow-2xl flex flex-col z-50"
        >
          <div className="flex items-center justify-between p-4 border-b border-border bg-ai-background">
            <div className="flex items-center gap-2">
              <Sparkles className="text-ai-primary" size={20} />
              <h3 className="font-semibold text-ai-primary">AI Assistant</h3>
            </div>
            <button onClick={togglePanel} className="p-1 hover:bg-surface rounded-md transition">
              <X size={20} />
            </button>
          </div>

          <div className="p-4 border-b border-border">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask AI or type a command..."
              className="w-full min-h-[80px] p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ai-primary"
              onKeyDown={e => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handleSubmit();
                }
              }}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-text-secondary">Cmd+Enter to send</span>
              <button
                onClick={handleSubmit}
                disabled={isLoading || !input.trim()}
                className="px-4 py-2 bg-ai-primary text-white rounded-md hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? (
                  'Generating...'
                ) : (
                  <>
                    <Send size={14} />
                    Send
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {isLoading && !response && (
              <div className="flex items-center gap-2 text-text-secondary">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-ai-primary rounded-full animate-pulse" />
                  <span className="w-2 h-2 bg-ai-primary rounded-full animate-pulse delay-100" />
                  <span className="w-2 h-2 bg-ai-primary rounded-full animate-pulse delay-200" />
                </div>
                <span>AI is thinking...</span>
              </div>
            )}

            {error && <div className="text-error text-sm">{error}</div>}

            {response && (
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap">{response}</pre>
              </div>
            )}
          </div>

          {response && (
            <div className="p-4 border-t border-border flex gap-2">
              <button
                onClick={handleInsert}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition"
              >
                Insert
              </button>
              <button
                onClick={handleCopy}
                className="px-4 py-2 border border-border rounded-md hover:bg-surface transition"
              >
                <Copy size={16} />
              </button>
              <button
                onClick={() => {
                  setResponse('');
                  handleSubmit();
                }}
                className="px-4 py-2 border border-border rounded-md hover:bg-surface transition"
              >
                <RotateCw size={16} />
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
