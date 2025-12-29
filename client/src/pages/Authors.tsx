import { useQuery } from '@tanstack/react-query';
import { fetchBooks } from '@/lib/books';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useTranslation } from 'react-i18next';
import { Loader2, User, Book as BookIcon, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BookCard } from '@/components/ui/book-card';

export default function Authors() {
  const { t } = useTranslation();
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['authors'],
    queryFn: async () => {
      const [p1, p2] = await Promise.all([
        fetchBooks('sort=popular'),
        fetchBooks('search=classic')
      ]);
      return { results: [...p1.results, ...p2.results] };
    }
  });

  // Extract unique authors and their books
  const authorsMap = new Map();
  data?.results.forEach(book => {
    book.authors.forEach(author => {
      if (!authorsMap.has(author.name)) {
        authorsMap.set(author.name, {
          name: author.name,
          birth: author.birth_year,
          death: author.death_year,
          books: []
        });
      }
      const existing = authorsMap.get(author.name);
      if (!existing.books.find((b: any) => b.id === book.id)) {
        existing.books.push(book);
      }
    });
  });

  const authorsList = Array.from(authorsMap.values());
  const activeAuthor = selectedAuthor ? authorsMap.get(selectedAuthor) : null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="flex flex-col gap-4 mb-12">
          <h1 className="font-serif text-4xl font-bold">{t('authors')}</h1>
          <p className="text-muted-foreground">Discover the brilliant minds behind world-class literature.</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Authors List */}
            <div className={`lg:col-span-4 space-y-4 ${selectedAuthor ? 'hidden lg:block' : 'block'}`}>
              {authorsList.map((author, idx) => (
                <motion.div
                  key={author.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(idx * 0.05, 1) }}
                  onClick={() => setSelectedAuthor(author.name)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${
                    selectedAuthor === author.name 
                    ? 'bg-primary text-primary-foreground border-primary shadow-lg ring-2 ring-primary/20' 
                    : 'bg-card hover:border-primary/50 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      selectedAuthor === author.name ? 'bg-white/20' : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground'
                    }`}>
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm leading-tight">{author.name}</h3>
                      <p className={`text-[10px] ${selectedAuthor === author.name ? 'text-white/70' : 'text-muted-foreground'}`}>
                        {author.books.length} {t('Books')}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={`h-4 w-4 transition-transform ${selectedAuthor === author.name ? 'rotate-90' : ''}`} />
                </motion.div>
              ))}
            </div>

            {/* Author Works Detail */}
            <div className={`lg:col-span-8 ${selectedAuthor ? 'block' : 'hidden lg:flex items-center justify-center border-2 border-dashed rounded-2xl min-h-[400px] text-muted-foreground'}`}>
              <AnimatePresence mode="wait">
                {activeAuthor ? (
                  <motion.div
                    key={activeAuthor.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b">
                      <div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="lg:hidden mb-4 -ml-2" 
                          onClick={() => setSelectedAuthor(null)}
                        >
                          <ChevronRight className="rotate-180 mr-1 h-4 w-4" /> Back
                        </Button>
                        <h2 className="font-serif text-3xl font-bold text-primary">{activeAuthor.name}</h2>
                        <p className="text-muted-foreground">
                          {activeAuthor.birth ? `${activeAuthor.birth} - ${activeAuthor.death || 'Present'}` : 'Classical Author'}
                        </p>
                      </div>
                      <div className="bg-secondary/50 px-4 py-2 rounded-full text-sm font-medium">
                        {activeAuthor.books.length} Works Found
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                      {activeAuthor.books.map((book: any, idx: number) => (
                        <motion.div
                          key={book.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <BookCard book={book} />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center space-y-4">
                    <User className="h-12 w-12 mx-auto opacity-20" />
                    <p className="font-serif text-xl">Select an author to view their works</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}