import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { Book, getBookCover, getAuthorsString } from '@/lib/books';
import { useStore, handleBookAdInterception } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import { Star, Download, BookOpen } from 'lucide-react';

interface BookCardProps {
  book: Book;
  rank?: number;
  featured?: boolean;
}

export function BookCard({ book, rank, featured = false }: BookCardProps) {
  const [, setLocation] = useLocation();
  const { clickedBooks, setBookClicked } = useStore();
  const coverUrl = getBookCover(book);
  const authors = getAuthorsString(book);

  const handleClick = () => {
    handleBookAdInterception(book.id, clickedBooks, setBookClicked, () => {
      setLocation(`/book/${book.id}`);
    });
  };

  if (featured) {
    return (
      <motion.div 
        whileHover={{ y: -8, scale: 1.01 }}
        className="group relative flex flex-col md:flex-row bg-card/40 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl hover:shadow-primary/20 transition-all border border-white/10 cursor-pointer h-full"
        onClick={handleClick}
      >
        <div className="w-full md:w-2/5 aspect-[2/3] overflow-hidden relative">
          <img 
            src={coverUrl} 
            alt={book.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
        </div>
        <div className="p-8 flex flex-col justify-between flex-1 bg-gradient-to-br from-transparent to-primary/5">
          <div>
            <div className="flex items-center gap-2 mb-4">
               <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 backdrop-blur-sm px-3 py-1 uppercase tracking-wider text-[10px]">
                 {book.languages[0] || 'EN'}
               </Badge>
               <Badge variant="outline" className="bg-white/5 text-muted-foreground border-white/10 backdrop-blur-sm px-3 py-1 text-[10px]">
                 {book.source?.toUpperCase()}
               </Badge>
            </div>
            <h3 className="font-serif text-2xl md:text-3xl font-bold mb-3 leading-tight group-hover:text-primary transition-colors">
              {book.title}
            </h3>
            <p className="text-muted-foreground text-lg mb-6 line-clamp-2 italic font-serif opacity-80">{authors}</p>
            <div className="flex items-center gap-1.5 text-yellow-500/90 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current drop-shadow-[0_0_8px_rgba(234,179,8,0.3)]" />
              ))}
              <span className="text-xs text-muted-foreground/60 ml-3 font-medium tracking-tight">
                {book.download_count.toLocaleString()} READERS
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <BookOpen className="h-5 w-5" />
             </div>
             <span className="text-sm font-semibold tracking-wide uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">Discover Now</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -12, scale: 1.02 }}
      className="group relative flex flex-col bg-card/30 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all border border-white/5 cursor-pointer h-full"
      onClick={handleClick}
    >
      {rank && (
        <div className="absolute top-3 left-3 z-20 bg-primary/90 backdrop-blur-md text-white w-9 h-9 rounded-full flex items-center justify-center font-bold font-serif shadow-xl border border-white/20">
          {rank}
        </div>
      )}
      <div className="aspect-[2/3] overflow-hidden bg-muted relative">
        <img 
          src={coverUrl} 
          alt={book.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-115"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-5">
          <div className="flex gap-2 mb-3">
            <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <Download className="h-4 w-4" />
            </div>
            <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <BookOpen className="h-4 w-4" />
            </div>
          </div>
          <p className="text-white text-xs font-serif italic line-clamp-1 opacity-80">{authors}</p>
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col bg-gradient-to-b from-transparent to-primary/5">
        <h3 className="font-serif font-bold text-base mb-1.5 line-clamp-1 group-hover:text-primary transition-colors leading-tight" title={book.title}>
          {book.title}
        </h3>
        <div className="flex items-center justify-between mt-auto pt-2">
           <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">{book.languages[0] || 'EN'}</span>
           <div className="flex items-center gap-1 text-yellow-500/70">
              <Star className="h-3 w-3 fill-current" />
              <span className="text-[10px] font-bold">4.9</span>
           </div>
        </div>
      </div>
    </motion.div>
  );
}