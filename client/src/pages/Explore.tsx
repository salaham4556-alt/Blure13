import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchBooks } from '@/lib/books';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BookCard } from '@/components/ui/book-card';
import { useTranslation } from 'react-i18next';
import { Loader2, Filter, ChevronLeft, ChevronRight, Search, X, Sparkles, Book as BookIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { motion, AnimatePresence } from 'framer-motion';

export default function Explore() {
  const { t } = useTranslation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialSearch = searchParams.get('search') || '';
  const initialTopic = searchParams.get('topic') || '';
  const initialLang = searchParams.get('languages') || '';

  const [search, setSearch] = useState(initialSearch);
  const [selectedTopic] = useState(initialTopic);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(initialLang ? [initialLang] : []);
  const [yearRange, setYearRange] = useState([1800, 2025]);
  const [page, setPage] = useState(1);

  const buildQuery = () => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (selectedTopic) params.append('topic', selectedTopic);
    if (selectedLanguages.length) params.append('languages', selectedLanguages.join(','));
    if (yearRange[0] > 1800 || yearRange[1] < 2025) {
        params.append('author_year_start', yearRange[0].toString());
        params.append('author_year_end', yearRange[1].toString());
    }
    params.append('page', page.toString());
    return params.toString();
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['books', 'explore', search, selectedTopic, selectedLanguages, yearRange, page],
    queryFn: () => fetchBooks(buildQuery()),
    placeholderData: (prev) => prev
  });

  const handleApply = () => {
    setPage(1);
    refetch();
  };

  const totalPages = Math.ceil((data?.count || 0) / 32);

  const FilterSidebar = () => (
    <div className="space-y-8 py-4">
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <h3 className="font-serif text-2xl font-bold flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          {t('apply')}
        </h3>
        {(search || selectedLanguages.length > 0) && (
          <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setSelectedLanguages([]); setPage(1); }} className="text-xs">
            Reset
          </Button>
        )}
      </div>

      <Accordion type="multiple" className="w-full">
        <AccordionItem value="languages" className="border-white/5">
          <AccordionTrigger className="font-serif text-lg hover:text-primary transition-colors">{t('languages')}</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 gap-3 pt-2">
              {[
                {id: 'en', label: 'English', flag: '🇺🇸'},
                {id: 'ar', label: 'Arabic', flag: '🇸🇦'},
                {id: 'fr', label: 'French', flag: '🇫🇷'},
                {id: 'es', label: 'Spanish', flag: '🇪🇸'},
                {id: 'de', label: 'German', flag: '🇩🇪'},
                {id: 'it', label: 'Italian', flag: '🇮🇹'},
              ].map(lang => (
                <label key={lang.id} className="flex items-center gap-3 group cursor-pointer p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <Checkbox 
                    id={`lang-${lang.id}`}
                    checked={selectedLanguages.includes(lang.id)}
                    onCheckedChange={(checked) => {
                      if (checked) setSelectedLanguages([...selectedLanguages, lang.id]);
                      else setSelectedLanguages(selectedLanguages.filter(l => l !== lang.id));
                    }}
                    className="border-white/20 data-[state=checked]:bg-primary"
                  />
                  <span className="text-xl">{lang.flag}</span>
                  <span className="text-sm font-medium group-hover:text-primary transition-colors">{lang.label}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="years" className="border-white/5">
            <AccordionTrigger className="font-serif text-lg hover:text-primary transition-colors">{t('years')}</AccordionTrigger>
            <AccordionContent>
                <div className="px-2 pt-6 pb-2 space-y-4">
                    <Slider 
                        defaultValue={[1800, 2025]} 
                        min={1000} 
                        max={2025} 
                        step={10}
                        value={yearRange}
                        onValueChange={setYearRange}
                        className="py-4"
                    />
                    <div className="flex justify-between text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                        <div className="bg-secondary/50 px-3 py-1 rounded-md">{yearRange[0]}</div>
                        <div className="bg-secondary/50 px-3 py-1 rounded-md">{yearRange[1]}</div>
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button className="w-full h-12 shadow-lg shadow-primary/20 rounded-xl font-bold tracking-wide" onClick={handleApply}>
        Refine Search
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
         <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--color-primary),_transparent_50%)]" />
      </div>

      <main className="flex-1 container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col md:flex-row gap-12">
            <aside className="hidden md:block w-72 shrink-0 h-[calc(100vh-120px)] sticky top-24 overflow-y-auto pr-6 custom-scrollbar">
                <FilterSidebar />
            </aside>

            <div className="md:hidden flex items-center gap-4 mb-8">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="secondary" className="flex-1 h-14 rounded-2xl gap-3 bg-card/50 backdrop-blur-md border border-white/5 font-bold">
                            <Filter className="h-5 w-5 text-primary" />
                            Filters & Settings
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] backdrop-blur-2xl bg-card/80 border-white/10">
                        <FilterSidebar />
                    </SheetContent>
                </Sheet>
            </div>

            <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="space-y-2">
                       <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight flex items-center gap-3">
                         <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                         Explore Results
                       </h1>
                       <p className="text-muted-foreground text-lg italic">
                          Discovering {data?.count?.toLocaleString()} titles across our global archives
                       </p>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-secondary/30 backdrop-blur-md p-1.5 rounded-2xl border border-white/5 shadow-inner">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        disabled={page === 1}
                        onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                        className="h-10 w-10 rounded-xl hover:bg-primary hover:text-white transition-all"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <span className="text-xs font-bold tracking-widest uppercase px-4 border-x border-white/5">
                        PAGE {page} <span className="text-primary/40 mx-1">/</span> {totalPages || 1}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        disabled={page >= totalPages}
                        onClick={() => { setPage(p => p + 1); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                        className="h-10 w-10 rounded-xl hover:bg-primary hover:text-white transition-all"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                </div>

                <AnimatePresence mode="popLayout">
                  {isLoading ? (
                    <motion.div 
                      key="loader"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center h-[50vh] space-y-6"
                    >
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                           <BookIcon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <p className="font-serif italic text-lg text-muted-foreground animate-pulse">Curating your collection...</p>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="content"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-16"
                    >
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {data?.results.map((book: any, idx: number) => (
                                <motion.div
                                  key={book.id}
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: (idx % 8) * 0.05 }}
                                >
                                  <BookCard book={book} />
                                </motion.div>
                            ))}
                        </div>

                        {data?.results.length === 0 && (
                            <div className="text-center py-32 space-y-6 bg-secondary/20 rounded-3xl border-2 border-dashed border-white/5">
                                <X className="h-16 w-16 mx-auto text-muted-foreground/20" />
                                <div className="space-y-2">
                                  <h3 className="font-serif text-2xl font-bold">No Books Found</h3>
                                  <p className="text-muted-foreground max-w-md mx-auto">We couldn't find any titles matching your current filters. Try broadening your search or adjusting the birth year.</p>
                                </div>
                                <Button variant="outline" onClick={() => { setSearch(''); setSelectedLanguages([]); setPage(1); }} className="rounded-xl border-white/10 hover:bg-primary hover:text-white">
                                  Clear All Filters
                                </Button>
                            </div>
                        )}

                        {totalPages > 1 && (
                          <div className="flex flex-col md:flex-row justify-center items-center gap-8 mt-16 pt-12 border-t border-white/5">
                              <Button 
                                variant="outline" 
                                size="lg"
                                disabled={page === 1}
                                onClick={() => {
                                  setPage(p => Math.max(1, p - 1));
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="h-16 px-8 rounded-2xl gap-3 border-white/10 hover:bg-primary hover:text-white transition-all group"
                              >
                                <ChevronLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
                                <span className="font-bold tracking-widest uppercase">Previous Chapter</span>
                              </Button>
                              
                              <div className="flex flex-col items-center">
                                <span className="text-sm uppercase tracking-[0.3em] font-bold text-muted-foreground/40 mb-2">Current Position</span>
                                <div className="h-12 w-32 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.1)]">
                                  <span className="font-serif font-bold text-2xl text-primary">
                                    {page}
                                  </span>
                                  <span className="mx-2 text-primary/30">/</span>
                                  <span className="font-serif font-bold text-lg text-primary/60">
                                    {totalPages}
                                  </span>
                                </div>
                              </div>

                              <Button 
                                variant="outline"
                                size="lg"
                                disabled={page >= totalPages}
                                onClick={() => {
                                  setPage(p => p + 1);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="h-16 px-8 rounded-2xl gap-3 border-white/10 hover:bg-primary hover:text-white transition-all group"
                              >
                                <span className="font-bold tracking-widest uppercase">Next Chapter</span>
                                <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                              </Button>
                          </div>
                        )}
                    </motion.div>
                  )}
                </AnimatePresence>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}