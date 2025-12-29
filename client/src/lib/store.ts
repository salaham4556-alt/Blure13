import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type BookStatus = 'favorites' | 'reading_now' | 'wont_read' | 'read_later' | 'want_to_read';

export interface SavedBook {
  id: number | string;
  title: string;
  author: string;
  cover: string;
  status: BookStatus;
  addedAt: number;
}

interface AppState {
  clickedBooks: Record<string, boolean>;
  setBookClicked: (id: string | number) => void;
  
  savedBooks: SavedBook[];
  saveBook: (book: Omit<SavedBook, 'addedAt'>) => void;
  removeBook: (id: number | string) => void;
  getBookStatus: (id: number | string) => BookStatus | undefined;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      clickedBooks: {},
      setBookClicked: (id) => set((state) => ({
        clickedBooks: { ...state.clickedBooks, [id.toString()]: true }
      })),

      savedBooks: [],
      saveBook: (book) => set((state) => {
        const existing = state.savedBooks.find(b => b.id === book.id);
        if (existing) {
          return {
            savedBooks: state.savedBooks.map(b => 
              b.id === book.id ? { ...b, status: book.status } : b
            )
          };
        }
        return {
          savedBooks: [...state.savedBooks, { ...book, addedAt: Date.now() }]
        };
      }),
      removeBook: (id) => set((state) => ({
        savedBooks: state.savedBooks.filter(b => b.id !== id)
      })),
      getBookStatus: (id) => {
        return get().savedBooks.find(b => b.id === id)?.status;
      }
    }),
    {
      name: 'blure-books-storage',
    }
  )
);

export const AD_LINK = "https://www.effectivegatecpm.com/pay5egb0?key=7dcca204dbc8850b48e7c1b230f3b3d2";

export const handleBookAdInterception = (bookId: string | number, clickedBooks: Record<string, boolean>, setBookClicked: (id: string | number) => void, callback: () => void) => {
  if (!clickedBooks[bookId.toString()]) {
    setBookClicked(bookId);
    window.open(AD_LINK, '_blank');
  } else {
    callback();
  }
};
