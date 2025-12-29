import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { fetchBookDetails, getBookCover, getAuthorsString, fetchBooks } from '@/lib/books';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useTranslation } from 'react-i18next';
import { Loader2, Download, BookOpen, Heart, Plus, Sparkles, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore, handleBookAdInterception, BookStatus } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import { BookCard } from '@/components/ui/book-card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export default function BookDetails() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { clickedBooks, setBookClicked, saveBook, getBookStatus } = useStore();

  const { data: book, isLoading } = useQuery({
    queryKey: ['book', id],
    queryFn: () => fetchBookDetails(id || '0'),
    enabled: !!id
  });

  const { data: recommendations } = useQuery({
    queryKey: ['recommendations', book?.subjects?.[0]],
    queryFn: () => fetchBooks(`topic=${book?.subjects?.[0] || 'fiction'}`),
    enabled: !!book
  });

  if (isLoading || !book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const handleAction = (action: () => void) => {
    handleBookAdInterception(book.id, clickedBooks, setBookClicked, action);
  };

  const handleSave = (status: BookStatus) => {
    saveBook({
      id: book.id,
      title: book.title,
      author: getAuthorsString(book),
      cover: getBookCover(book),
      status
    });
    toast({
      title: t('saved'),
      description: `Book added to ${t(status)}`,
    });
  };

  const currentStatus = getBookStatus(book.id);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20 dark:opacity-10">
         <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary rounded-full blur-[120px]" />
         <div className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] bg-blue-400 rounded-full blur-[100px]" />
      </div>

      <main className="flex-1 container mx-auto px-4 py-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-12"
        >
          <div className="md:col-span-4 lg:col-span-3">
            <div className="sticky top-24">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] aspect-[2/3] relative group border border-white/10"
              >
                <img 
                  src={getBookCover(book)} 
                  alt={book.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </motion.div>
              
              <div className="mt-8 flex flex-col gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full text-lg h-14 gap-3 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-xl" 
                      onClick={(e) => {
                        if (!clickedBooks[book.id.toString()]) {
                          e.preventDefault();
                          handleAction(() => {});
                        }
                      }}
                    >
                      <BookOpen className="h-6 w-6" />
                      {t('read_now')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md backdrop-blur-xl bg-card/80">
                    <DialogHeader>
                      <DialogTitle className="font-serif text-2xl">{t('formats_available')}</DialogTitle>
                      <DialogDescription>{t('click_to_read')}</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-3 mt-4">
                      {Object.entries(book.formats)
                        .filter(([mime]) => mime.includes('text/html') || mime.includes('text/plain'))
                        .map(([mime, url]) => (
                          <Button key={mime} variant="secondary" asChild className="w-full justify-between h-12 px-6 rounded-xl hover:bg-primary hover:text-white transition-all">
                             <a href={url} target="_blank" rel="noreferrer">
                               <span className="font-bold tracking-widest">{mime.split('/')[1].toUpperCase()}</span>
                               <Sparkles className="h-4 w-4" />
                             </a>
                          </Button>
                        ))}
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="secondary" 
                      className="w-full text-lg h-14 gap-3 bg-secondary/80 backdrop-blur-md hover:bg-secondary border border-white/10 rounded-xl"
                      onClick={(e) => {
                        if (!clickedBooks[book.id.toString()]) {
                          e.preventDefault();
                          handleAction(() => {});
                        }
                      }}
                    >
                      <Download className="h-6 w-6" />
                      {t('download')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md backdrop-blur-xl bg-card/80">
                    <DialogHeader>
                      <DialogTitle className="font-serif text-2xl">{t('formats_available')}</DialogTitle>
                      <DialogDescription>{t('click_to_download')}</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-3 mt-4">
                      {Object.entries(book.formats)
                        .filter(([mime]) => mime.includes('epub') || mime.includes('mobi') || mime.includes('zip') || mime.includes('pdf'))
                        .map(([mime, url]) => (
                          <Button key={mime} variant="secondary" asChild className="w-full justify-between h-12 px-6 rounded-xl hover:bg-primary hover:text-white transition-all">
                             <a href={url} target="_blank" rel="noreferrer">
                               <span className="font-bold tracking-widest">{mime.split('/')[1].toUpperCase()}</span>
                               <Download className="h-4 w-4" />
                             </a>
                          </Button>
                        ))}
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex-1 h-12 gap-2 border-white/10 bg-white/5 backdrop-blur-sm rounded-xl">
                        {currentStatus ? <Heart className="h-4 w-4 fill-primary text-primary" /> : <Plus className="h-4 w-4" />}
                        {currentStatus ? t(currentStatus) : t('save')}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 backdrop-blur-xl bg-card/80 border-white/10">
                      <DropdownMenuItem onClick={() => handleSave('favorites')}>{t('favorites')}</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSave('reading_now')}>{t('reading_now')}</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSave('want_to_read')}>{t('want_to_read')}</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSave('read_later')}>{t('read_later')}</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSave('wont_read')}>{t('wont_read')}</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="outline" size="icon" className="h-12 w-12 border-white/10 bg-white/5 backdrop-blur-sm rounded-xl">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-8 lg:col-span-9 space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase">
                   {book.source?.toUpperCase() || 'GUTENDEX'}
                 </Badge>
              </div>
              <h1 className="font-serif text-5xl md:text-7xl font-bold text-foreground leading-[1.1] tracking-tight">
                {book.title}
              </h1>
              <div className="flex flex-wrap gap-6 items-center text-xl text-muted-foreground font-serif italic">
                <span className="text-primary not-italic font-sans font-bold uppercase tracking-wider text-sm">{getAuthorsString(book)}</span>
                <div className="h-1.5 w-1.5 rounded-full bg-border" />
                <span>{book.download_count.toLocaleString()} Downloads</span>
                <div className="h-1.5 w-1.5 rounded-full bg-border" />
                <span className="uppercase tracking-widest text-sm font-sans font-bold">{book.languages[0]}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {book.bookshelves?.map((shelf: string) => (
                <Badge key={shelf} variant="secondary" className="bg-secondary/40 hover:bg-primary/20 hover:text-primary border border-white/5 px-4 py-2 rounded-lg transition-all cursor-pointer text-xs font-medium backdrop-blur-sm">
                  {shelf.replace('Browsing: ', '')}
                </Badge>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-6">
              <div className="space-y-6">
                <h3 className="font-serif text-3xl font-bold flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-primary" />
                  The Synopsis
                </h3>
                <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed text-muted-foreground/90 font-light">
                  <p>
                    Discover a masterpiece of human thought and storytelling. This eBook, curated from global archives, 
                    offers a deep dive into the essence of its era. Available in multiple high-quality digital formats 
                    for the modern reader.
                  </p>
                </div>
              </div>
              <div className="bg-card/40 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-xl">
                 <h3 className="font-serif text-2xl font-bold mb-6">Subject Matter</h3>
                 <ul className="space-y-4">
                  {book.subjects?.slice(0, 6).map((subject: string) => (
                    <li key={subject} className="flex items-start gap-4 text-muted-foreground/80 group">
                      <div className="mt-2 w-2 h-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors shrink-0" />
                      <span className="text-sm font-medium group-hover:text-foreground transition-colors leading-snug">{subject}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        <section className="mt-24 pt-16 border-t border-white/5">
           <div className="flex items-center justify-between mb-10">
              <div className="space-y-1">
                <h2 className="font-serif text-4xl font-bold tracking-tight">You Might Also Like</h2>
                <p className="text-muted-foreground text-lg">Curated recommendations based on this title</p>
              </div>
           </div>
           
           <div className="relative group">
              <div className="flex overflow-x-auto gap-8 pb-10 scrollbar-hide -mx-4 px-4 snap-x">
                 {recommendations?.results?.filter((b: any) => b.id !== book.id).slice(0, 8).map((recBook: any) => (
                    <div key={recBook.id} className="min-w-[280px] md:min-w-[320px] snap-start">
                       <BookCard book={recBook} />
                    </div>
                 ))}
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}