import { Plus } from 'lucide-react';
import { useStore } from '../../store';
import { FolderItem } from './FolderItem';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true }: SidebarProps) {
  const { folders, activeFolderId, setActiveFolder, addFolder } = useStore();

  const handleNewFolder = () => {
    const name = prompt('Enter folder name:');
    if (name) {
      addFolder(name);
    }
  };

  return (
    <aside
      className={`w-[200px] p-4 bg-surface border-r border-border overflow-y-auto transition-all ${
        !isOpen ? 'hidden md:block' : ''
      }`}
    >
      <div className="flex flex-col gap-1">
        {folders.map((folder) => (
          <FolderItem
            key={folder.id}
            folder={folder}
            isActive={folder.id === activeFolderId}
            onClick={() => folder.id && setActiveFolder(folder.id)}
          />
        ))}
      </div>

      <button
        onClick={handleNewFolder}
        className="w-full mt-3 h-9 px-3 border border-dashed border-border rounded-lg text-text-secondary text-sm hover:border-primary hover:text-primary hover:bg-primary-light transition flex items-center gap-2"
      >
        <Plus size={16} />
        <span>New Folder</span>
      </button>
    </aside>
  );
}
