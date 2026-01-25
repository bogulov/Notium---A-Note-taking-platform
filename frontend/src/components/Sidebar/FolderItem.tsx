import { Folder } from 'lucide-react';
import type { Folder as FolderType } from '../../types';

interface FolderItemProps {
  folder: FolderType;
  isActive: boolean;
  onClick: () => void;
}

export function FolderItem({ folder, isActive, onClick }: FolderItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-3 py-2 rounded-lg text-left text-sm transition flex items-center gap-2 ${
        isActive
          ? 'bg-primary-light text-primary font-medium'
          : 'text-text-primary hover:bg-surface-hover'
      }`}
    >
      <Folder size={18} className={isActive ? 'text-primary' : 'text-text-secondary'} />
      <span className="flex-1 truncate">{folder.name}</span>
    </button>
  );
}
