import { useQuery } from "@tanstack/react-query";
import { fetchBooks } from "@/lib/api";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { GenreList } from "@/components/home/GenreList";
import { TrendingList } from "@/components/home/TrendingList";
import { BookGrid } from "@/components/books/BookGrid";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useSearch } from "wouter";

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
];

export default function Home() {
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const searchString = useSearch();
  
  const searchParams = useMemo(() => new URLSearchParams(searchString), [searchString]);
  const searchQuery = searchParams.get("search");
  const topicQuery = searchParams.get("topic");
  const authorQuery = searchParams.get("author");

  const { data: booksData, isLoading } = useQuery({
    queryKey: ["books", selectedLang, searchQuery, topicQuery, authorQuery],
    queryFn: () => {
      const params: any = {};
      if (selectedLang) params.languages = selectedLang;
      if (searchQuery) params.search = searchQuery;
      if (topicQuery) params.topic = topicQuery;
      if (authorQuery) params.search = authorQuery;
      return fetchBooks(params);
    },
  });

  const { data: popularData, isLoading: isPopularLoading } = useQuery({
    queryKey: ["books-popular"],
    queryFn: () => fetchBooks({ sort: "popular" }),
  });

  const pageTitle = searchQuery 
    ? `Search Results for "${searchQuery}"` 
    : topicQuery 
    ? `Books in ${topicQuery}`
    : authorQuery
    ? `Books by ${authorQuery}`
    : selectedLang 
    ? `Books in ${LANGUAGES.find(l => l.code === selectedLang)?.label}` 
    : "Top Rated Books";

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />
      
      <main className="container px-4 py-8 flex-1">
        {!searchQuery && !topicQuery && !authorQuery && (
          <>
            <Hero books={popularData?.results} isLoading={isPopularLoading} />
            <GenreList />
          </>
        )}
        
        <div className="py-8">
           <div className="flex flex-wrap gap-3 items-center">
              <span className="font-serif font-bold mr-2">Browse Language:</span>
              <Button 
                variant={selectedLang === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLang(null)}
                className="rounded-full"
              >
                All
              </Button>
              {LANGUAGES.map(lang => (
                <Button
                  key={lang.code}
                  variant={selectedLang === lang.code ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLang(lang.code)}
                  className={cn("rounded-full", selectedLang === lang.code && "bg-primary text-primary-foreground")}
                >
                  <span className="mr-2">{lang.flag}</span> {lang.label}
                </Button>
              ))}
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-9 space-y-12">
             <BookGrid 
                title={pageTitle} 
                books={booksData?.results} 
                isLoading={isLoading} 
             />
             
             {!searchQuery && !topicQuery && !authorQuery && (
               <>
                 <BookGrid 
                    title="Most Read Classics" 
                    books={popularData?.results.slice(5, 11)} 
                    isLoading={isPopularLoading} 
                 />

                 <BookGrid 
                    title="Global Hits" 
                    books={popularData?.results.slice(12, 18)} 
                    isLoading={isPopularLoading} 
                 />
               </>
             )}
          </div>
          
          <div className="lg:col-span-3">
             <TrendingList books={popularData?.results} isLoading={isPopularLoading} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
