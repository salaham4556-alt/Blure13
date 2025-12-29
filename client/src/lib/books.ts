
const GUTENDEX_BASE = "https://gutendex.com/books";
const OPENLIBRARY_SEARCH = "https://openlibrary.org/search.json";

export interface Book {
  id: number | string;
  title: string;
  authors: { name: string; birth_year?: number | null; death_year?: number | null }[];
  languages: string[];
  formats: Record<string, string>;
  download_count: number;
  subjects?: string[];
  bookshelves?: string[];
  source?: 'gutendex' | 'openlibrary';
}

export interface BookResponse {
  count: number;
  results: Book[];
}

export const fetchBooks = async (params: string = "") => {
  const urlParams = new URLSearchParams(params);
  const searchParam = urlParams.get('search');
  const langParam = urlParams.get('languages');
  
  // Prepare Gutendex request
  const gPromise = fetch(`${GUTENDEX_BASE}${params ? `?${params}` : ''}`).then(res => res.json());
  
  // Prepare OpenLibrary request
  let olQuery = "";
  if (searchParam) {
    olQuery = `q=${encodeURIComponent(searchParam)}`;
  } else if (langParam) {
    // OpenLibrary uses language codes like 'ara', 'eng', etc.
    const langMap: Record<string, string> = {
      'ar': 'ara',
      'en': 'eng',
      'fr': 'fre',
      'es': 'spa',
      'de': 'ger',
      'it': 'ita',
      'zh': 'chi'
    };
    olQuery = `language:${langMap[langParam] || langParam}`;
  }

  let olPromise = Promise.resolve({ docs: [], numFound: 0 });
  if (olQuery) {
    olPromise = fetch(`${OPENLIBRARY_SEARCH}?${olQuery}&limit=15`).then(res => res.json());
  }

  const [gData, olData] = await Promise.all([gPromise, olPromise]);

  const gResults: Book[] = (gData.results || []).map((b: any) => ({ ...b, source: 'gutendex' }));
  
  const olResults: Book[] = (olData.docs || []).map((doc: any) => ({
    id: doc.key.replace('/works/', ''),
    title: doc.title,
    authors: (doc.author_name || []).map((name: string) => ({ name })),
    languages: doc.language || [],
    formats: {
      'image/jpeg': doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : 'https://via.placeholder.com/300x450?text=No+Cover'
    },
    download_count: doc.edition_count || 0,
    source: 'openlibrary'
  }));

  return {
    count: (gData.count || 0) + (olData.numFound || olResults.length),
    results: [...gResults, ...olResults]
  };
};

export const fetchBookDetails = async (id: string) => {
  if (!isNaN(Number(id))) {
    try {
      const res = await fetch(`${GUTENDEX_BASE}/${id}`);
      if (res.ok) {
        const data = await res.json();
        return { ...data, id: Number(data.id), source: 'gutendex' };
      }
    } catch (e) {}
  }

  try {
    const res = await fetch(`https://openlibrary.org/works/${id}.json`);
    const data = await res.json();
    
    const authorNames: string[] = [];
    if (data.authors && data.authors.length > 0) {
      authorNames.push("OpenLibrary Author");
    }

    return {
      id: id,
      title: data.title,
      authors: authorNames.map(name => ({ name })),
      formats: {
        'image/jpeg': data.covers ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg` : 'https://via.placeholder.com/300x450?text=No+Cover'
      },
      languages: [],
      download_count: 0,
      subjects: data.subjects || [],
      bookshelves: [],
      source: 'openlibrary'
    } as Book;
  } catch (e) {
    throw new Error("Failed to fetch book details");
  }
};

export const getBookCover = (book: Book) => {
  return book.formats['image/jpeg'] || book.formats['image/png'] || 'https://via.placeholder.com/300x450?text=No+Cover';
};

export const getAuthorsString = (book: Book) => {
  return book.authors.map(a => a.name).join(', ') || 'Unknown Author';
};
