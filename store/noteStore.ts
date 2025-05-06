import { create } from 'zustand';
import { generateId } from '@/utils/idGenerator';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  folderId: string;
}

export type NoteStoreState = {
  notes: Note[];
};

type NoteStoreActions = {
  getNoteById: (id: string) => Note | undefined;
  getNotesByFolderId: (folderId: string) => Note[];
  createNote: (data: { title: string; content: string; folderId: string }) => Note;
  updateNote: (id: string, data: Partial<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteNote: (id: string) => void;
};

// Sample data
const initialNotes: Note[] = [
  {
    id: '1',
    title: 'Welcome to Notes',
    content: 'This is your first note. You can edit, delete, or create new notes.',
    createdAt: new Date('2023-01-10T12:00:00'),
    updatedAt: new Date('2023-01-10T12:00:00'),
    folderId: 'notes',
  },
  {
    id: '2',
    title: 'Chicken Pasta Recipe',
    content: 'Ingredients:\n- 250g pasta\n- 2 chicken breasts\n- 1 onion\n- 2 cloves garlic\n- 150ml cream\n- Salt and pepper to taste\n\nDirections:\n1. Cook pasta according to package instructions.\n2. Dice chicken and sauté until golden.\n3. Add diced onion and garlic, cook until soft.\n4. Pour in cream, simmer until thickened.\n5. Mix with pasta and season with salt and pepper.',
    createdAt: new Date('2023-01-15T15:30:00'),
    updatedAt: new Date('2023-01-15T15:30:00'),
    folderId: 'notes',
  },
  {
    id: '3',
    title: 'Quick Note',
    content: 'Remember to call mom tomorrow',
    createdAt: new Date('2023-02-01T09:15:00'),
    updatedAt: new Date('2023-02-01T09:15:00'),
    folderId: 'quick-notes',
  },
  {
    id: '4',
    title: 'Project Ideas',
    content: '1. Mobile app for recipe sharing\n2. Task manager with AI prioritization\n3. Social platform for book lovers',
    createdAt: new Date('2023-02-10T17:45:00'),
    updatedAt: new Date('2023-02-10T17:45:00'),
    folderId: 'notes',
  },
  {
    id: '5',
    title: 'Team Meeting Notes',
    content: 'Date: March 15, 2023\nAttendees: John, Sarah, Mike, Lisa\n\nAgenda:\n- Project status update\n- Timeline review\n- Budget discussion\n- Next steps\n\nAction items:\n- John: Prepare status report\n- Sarah: Contact vendors\n- Mike: Update timeline\n- Lisa: Review budget',
    createdAt: new Date('2023-03-15T14:00:00'),
    updatedAt: new Date('2023-03-15T16:30:00'),
    folderId: 'shared',
  },
];

type Store = NoteStoreState & NoteStoreActions;

export const useNoteStore = create<Store>((set, get) => ({
  notes: initialNotes,
  
  getNoteById: (id: string) => {
    return get().notes.find((note: Note) => note.id === id);
  },
  
  getNotesByFolderId: (folderId: string) => {
    return get().notes.filter((note: Note) => note.folderId === folderId);
  },
  
  createNote: (data: { title: string; content: string; folderId: string }) => {
    const newNote: Note = {
      id: generateId(),
      title: data.title,
      content: data.content,
      createdAt: new Date(),
      updatedAt: new Date(),
      folderId: data.folderId,
    };
    
    set((state: NoteStoreState) => ({
      notes: [newNote, ...state.notes],
    }));
    
    return newNote;
  },
  
  updateNote: (id: string, data: Partial<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>>) => {
    set((state: NoteStoreState) => ({
      notes: state.notes.map((note: Note) => 
        note.id === id 
          ? { 
              ...note, 
              ...data, 
              updatedAt: new Date() 
            } 
          : note
      ),
    }));
  },
  
  deleteNote: (id: string) => {
    set((state: NoteStoreState) => ({
      notes: state.notes.filter((note: Note) => note.id !== id),
    }));
  },
}));