export const GUTENDEX_API = 'https://gutendex.com/books';

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

export type GutendexResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Book[];
};

export const fetchBooks = async (params: Record<string, string | number> = {}) => {
  const url = new URL(GUTENDEX_API);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error('Failed to fetch books');
  }
  return res.json() as Promise<GutendexResponse>;
};

export const fetchBookById = async (id: number) => {
  const res = await fetch(`${GUTENDEX_API}/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch book');
  }
  return res.json() as Promise<Book>;
};
