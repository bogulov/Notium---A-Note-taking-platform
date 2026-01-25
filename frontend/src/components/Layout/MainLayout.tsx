import { useState, useEffect } from 'react';
import { Header } from '../Header/Header';
import { Sidebar } from '../Sidebar/Sidebar';
import { NoteList } from '../NoteList/NoteList';
import { Editor } from '../Editor/Editor';
import { AIPanel } from '../AIPanel/AIPanel';
import { SettingsModal } from '../Settings/SettingsModal';
import { useStore } from '../../store';

export function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const theme = useStore(state => state.theme);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-background flex flex-col">
      <Header
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        onSettingsClick={() => setIsSettingsOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <NoteList />
        <Editor />
      </div>

      <AIPanel />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}
