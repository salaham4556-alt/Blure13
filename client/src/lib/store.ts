import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Book = {
  id: number;
  title: string;
  authors: { name: string; birth_year: number | null; death_year: number | null }[];
  translators: { name: string; birth_year: number | null; death_year: number | null }[];
  subjects: string[];
  bookshelves: string[];
  languages: string[];
  copyright: boolean | null;
  media_type: string;
  formats: Record<string, string>;
  download_count: number;
};

type BookListType = 'favorites' | 'readNow' | 'dontWant' | 'readLater';

interface BookStore {
  lists: Record<BookListType, Book[]>;
  addBook: (list: BookListType, book: Book) => void;
  removeBook: (list: BookListType, bookId: number) => void;
  isInList: (list: BookListType, bookId: number) => boolean;
}

export const useBookStore = create<BookStore>()(
  persist(
    (set, get) => ({
      lists: {
        favorites: [],
        readNow: [],
        dontWant: [],
        readLater: [],
      },
      addBook: (list, book) => {
        set((state) => {
          // Check if already in list to avoid duplicates
          if (state.lists[list].some((b) => b.id === book.id)) {
            return state;
          }
          return {
            lists: {
              ...state.lists,
              [list]: [...state.lists[list], book],
            },
          };
        });
      },
      removeBook: (list, bookId) => {
        set((state) => ({
          lists: {
            ...state.lists,
            [list]: state.lists[list].filter((b) => b.id !== bookId),
          },
        }));
      },
      isInList: (list, bookId) => {
        return get().lists[list].some((b) => b.id === bookId);
      },
    }),
    {
      name: 'blure-books-storage',
    }
  )
);
