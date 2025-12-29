import { useQuery } from '@tanstack/react-query';
import { fetchBooks, getBookCover } from '@/lib/books';
import { HeroSlider } from '@/components/home/hero-slider';
import { GenreSection } from '@/components/home/genre-section';
import { BookCard } from '@/components/ui/book-card';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useTranslation } from 'react-i18next';
import { Loader2, Globe, Sparkles, TrendingUp, Compass, Bookmark, Star, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { useEffect } from 'react';

const languages = [
  { code: 'ar', label: 'Arabic', flag: '🇸🇦' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'fr', label: 'French', flag: '🇫🇷' },
  { code: 'es', label: 'Spanish', flag: '🇪🇸' },
  { code: 'de', label: 'German', flag: '🇩🇪' },
  { code: 'it', label: 'Italian', flag: '🇮🇹' },
  { code: 'zh', label: 'Chinese', flag: '🇨🇳' },
];

export default function Home() {
  const { t, i18n } = useTranslation();
  const [, setLocation] = useLocation();

  useEffect(() => {
    const isRtl = i18n.language === 'ar';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const { data: trending, isLoading } = useQuery({ queryKey: ['books', 'trending'], queryFn: () => fetchBooks() });
  const { data: topRated } = useQuery({ queryKey: ['books', 'top_rated'], queryFn: () => fetchBooks('sort=popular') });
  const { data: philosophy } = useQuery({ queryKey: ['books', 'philosophy'], queryFn: () => fetchBooks('topic=philosophy') });
  const { data: poetry } = useQuery({ queryKey: ['books', 'poetry'], queryFn: () => fetchBooks('topic=poetry') });
  const { data: adventure } = useQuery({ queryKey: ['books', 'adventure'], queryFn: () => fetchBooks('topic=adventure') });
  const { data: drama } = useQuery({ queryKey: ['books', 'drama'], queryFn: () => fetchBooks('topic=drama') });
  const { data: science } = useQuery({ queryKey: ['books', 'science'], queryFn: () => fetchBooks('topic=science') });
  const { data: history } = useQuery({ queryKey: ['books', 'history'], queryFn: () => fetchBooks('topic=history') });
  const { data: mystery } = useQuery({ queryKey: ['books', 'mystery'], queryFn: () => fetchBooks('topic=mystery') });
  const { data: art } = useQuery({ queryKey: ['books', 'art'], queryFn: () => fetchBooks('topic=art') });
  const { data: psychology } = useQuery({ queryKey: ['books', 'psychology'], queryFn: () => fetchBooks('topic=psychology') });
  const { data: children } = useQuery({ queryKey: ['books', 'children'], queryFn: () => fetchBooks('topic=children') });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="relative">
          <Loader2 className="h-16 w-16 animate-spin text-primary opacity-20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const handleLanguageClick = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setLocation(`/explore?languages=${langCode}`);
  };

  const Section = ({ title, data, query, icon: Icon }: { title: string, data: any, query: string, icon?: any }) => (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-20"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h3 className="font-serif text-3xl md:text-4xl font-bold flex items-center gap-3 tracking-tight">
            {Icon && <Icon className="h-8 w-8 text-primary/60" />}
            {title}
          </h3>
          <div className="h-1 w-12 bg-primary/20 rounded-full" />
        </div>
        <Link href={`/explore?${query}`}>
          <Button variant="ghost" className="group text-primary hover:bg-primary/5 rounded-full px-6 font-bold tracking-wide">
            {t('more_details')}
            <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-8">
        {data?.results?.slice(0, 4).map((book: any) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary/30 selection:text-primary-foreground overflow-x-hidden">
      <Navbar />
      
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_20%_20%,_var(--color-primary),_transparent_40%)] opacity-[0.05]" />
        <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-[radial-gradient(circle_at_80%_80%,_var(--color-primary),_transparent_50%)] opacity-[0.03]" />
      </div>

      <main className="flex-1 relative z-10">
        {trending?.results && (
          <div className="relative">
            <HeroSlider books={trending.results} />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
          </div>
        )}

        <section className="py-12 md:py-20 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center mb-10 md:mb-16 space-y-4">
              <Badge className="bg-primary/10 text-primary border-none px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">{t('global_access')}</Badge>
              <h2 className="font-serif text-3xl md:text-6xl font-bold text-center tracking-tight flex items-center gap-4">
                <Globe className="h-8 w-8 md:h-10 md:h-10 text-primary/40 animate-[spin_10s_linear_infinite]" />
                {t('browse_by_tongue')}
              </h2>
              <p className="text-muted-foreground text-center max-w-xl text-sm md:text-lg font-light leading-relaxed px-4">
                {t('browse_subtitle')}
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-12">
              {languages.map((lang, idx) => (
                <motion.button
                  key={lang.code}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  onClick={() => handleLanguageClick(lang.code)}
                  className="flex flex-col items-center gap-2 md:gap-4 group"
                >
                  <div className="w-14 h-14 md:w-24 md:h-24 rounded-2xl md:rounded-3xl bg-card/40 backdrop-blur-xl shadow-lg border border-white/10 group-hover:border-primary/40 flex items-center justify-center text-2xl md:text-5xl transition-all duration-500">
                    {lang.flag}
                  </div>
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] opacity-60 group-hover:opacity-100 group-hover:text-primary transition-all">{lang.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        <GenreSection />

        <section className="py-12 md:py-24 container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-3 space-y-8 order-2 lg:order-1">
              <div className="lg:sticky lg:top-28 space-y-8">
                <div className="bg-card/40 backdrop-blur-2xl rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-white/10 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16" />
                  <h3 className="font-serif text-2xl md:text-3xl font-bold mb-6 md:mb-8 flex items-center gap-3">
                    <TrendingUp className="h-6 w-6 text-primary" />
                    {t('hot_now')}
                  </h3>
                  <div className="space-y-4 md:space-y-6">
                    {trending?.results.slice(0, 10).map((book, index) => (
                      <div key={book.id} className="flex gap-4 items-center group/item cursor-pointer hover:translate-x-1 transition-transform">
                         <span className="text-3xl md:text-5xl font-serif font-black text-primary/20 group-hover/item:text-primary transition-colors leading-none w-8 md:w-12 text-center order-1">
                            {index + 1}
                         </span>
                         <div className="flex-1 min-w-0 border-b border-white/5 pb-3 md:pb-4 last:border-0 order-2">
                           <Link href={`/book/${book.id}`}>
                            <h4 className="font-bold text-xs md:text-sm line-clamp-2 hover:text-primary transition-colors tracking-tight leading-tight">{book.title}</h4>
                           </Link>
                           <p className="text-[9px] md:text-[10px] uppercase font-black tracking-widest text-muted-foreground/50 mt-1">{book.authors[0]?.name}</p>
                         </div>
                         <div className="w-10 h-14 md:w-12 md:h-16 rounded-md overflow-hidden flex-shrink-0 order-3 shadow-md border border-white/5">
                            <img src={getBookCover(book)} alt={book.title} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" />
                         </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-primary/10 rounded-3xl p-6 border border-primary/20 flex flex-col items-center text-center space-y-4">
                   <Bookmark className="h-10 w-10 text-primary" />
                   <h4 className="font-bold uppercase tracking-widest text-xs">{t('curated_by')}</h4>
                   <p className="text-xs md:text-sm italic font-serif text-muted-foreground">"The more that you read, the more things you will know."</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-9 space-y-12 order-1 lg:order-2">
              <Section title={t('elite_popularity')} data={topRated} query="sort=popular" icon={Star} />
              <Section title={t('philosophy_thought')} data={philosophy} query="topic=philosophy" icon={Compass} />
              <Section title={t('poets_corner')} data={poetry} query="topic=poetry" icon={Sparkles} />
              <Section title={t('grand_adventures')} data={adventure} query="topic=adventure" />
              <Section title={t('dramatic_stage')} data={drama} query="topic=drama" />
              <Section title={t('scientific_horizons')} data={science} query="topic=science" />
              <Section title={t('ancient_chronology')} data={history} query="topic=history" />
              <Section title={t('arts_visuals')} data={art} query="topic=art" />
              <Section title={t('human_psyche')} data={psychology} query="topic=psychology" />
              <Section title={t('youthful_wonder')} data={children} query="topic=children" />
              <Section title={t('noir_mystery')} data={mystery} query="topic=mystery" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}