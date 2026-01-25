import { useState } from 'react';
import { Header } from '../Header/Header';
import { Sidebar } from '../Sidebar/Sidebar';
import { NoteList } from '../NoteList/NoteList';
import { Editor } from '../Editor/Editor';
import { AIPanel } from '../AIPanel/AIPanel';

export function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [, setIsSettingsOpen] = useState(false);

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
    </div>
  );
}
