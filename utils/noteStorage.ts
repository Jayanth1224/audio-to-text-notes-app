import * as FileSystem from 'expo-file-system';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  folderId?: string;
}

export class NoteStorage {
  private static readonly NOTES_DIR = `${FileSystem.documentDirectory}notes/`;
  private static readonly METADATA_FILE = `${FileSystem.documentDirectory}metadata.json`;

  static async initialize(): Promise<void> {
    const dirInfo = await FileSystem.getInfoAsync(this.NOTES_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(this.NOTES_DIR, { intermediates: true });
    }
  }

  static async saveNote(note: Note): Promise<void> {
    const notePath = `${this.NOTES_DIR}${note.id}.json`;
    await FileSystem.writeAsStringAsync(notePath, JSON.stringify(note));
    await this.updateMetadata(note);
  }

  static async getNote(id: string): Promise<Note | null> {
    try {
      const notePath = `${this.NOTES_DIR}${id}.json`;
      const content = await FileSystem.readAsStringAsync(notePath);
      return JSON.parse(content);
    } catch (error) {
      console.error('Error reading note:', error);
      return null;
    }
  }

  private static async updateMetadata(note: Note): Promise<void> {
    try {
      const metadata = await this.getMetadata();
      metadata[note.id] = {
        title: note.title,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
        folderId: note.folderId
      };
      await FileSystem.writeAsStringAsync(this.METADATA_FILE, JSON.stringify(metadata));
    } catch (error) {
      console.error('Error updating metadata:', error);
    }
  }

  private static async getMetadata(): Promise<Record<string, any>> {
    try {
      const content = await FileSystem.readAsStringAsync(this.METADATA_FILE);
      return JSON.parse(content);
    } catch {
      return {};
    }
  }
} 