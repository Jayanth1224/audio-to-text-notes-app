import { create } from 'zustand';
import { generateId } from '@/utils/idGenerator';

export interface Folder {
  id: string;
  name: string;
  icon: 'folder' | 'pencil' | 'user' | 'trash';
  isSystem: boolean;
}

interface FolderStore {
  folders: Folder[];
  getFolderById: (id: string) => Folder | undefined;
  createFolder: (data: { name: string }) => Folder;
  updateFolder: (id: string, data: Partial<Omit<Folder, 'id' | 'isSystem'>>) => void;
  deleteFolder: (id: string) => void;
}

// Sample data with system folders
const initialFolders: Folder[] = [
  {
    id: 'quick-notes',
    name: 'Quick Notes',
    icon: 'pencil',
    isSystem: true,
  },
  {
    id: 'shared',
    name: 'Shared',
    icon: 'user',
    isSystem: true,
  },
  {
    id: 'notes',
    name: 'Notes',
    icon: 'folder',
    isSystem: true,
  },
  {
    id: 'recently-deleted',
    name: 'Recently Deleted',
    icon: 'trash',
    isSystem: true,
  },
];

export const useFolderStore = create<FolderStore>((set, get) => ({
  folders: initialFolders,
  
  getFolderById: (id) => {
    return get().folders.find((folder) => folder.id === id);
  },
  
  createFolder: (data) => {
    const newFolder: Folder = {
      id: generateId(),
      name: data.name,
      icon: 'folder',
      isSystem: false,
    };
    
    set((state) => ({
      folders: [...state.folders, newFolder],
    }));
    
    return newFolder;
  },
  
  updateFolder: (id, data) => {
    set((state) => ({
      folders: state.folders.map((folder) => 
        folder.id === id && !folder.isSystem
          ? { ...folder, ...data } 
          : folder
      ),
    }));
  },
  
  deleteFolder: (id) => {
    set((state) => ({
      folders: state.folders.filter((folder) => folder.id !== id || folder.isSystem),
    }));
  },
}));