import { Book } from "@/lib/api";
import { motion } from "framer-motion";
import { Star, Download, BookOpen } from "lucide-react";
import { Link } from "wouter";

interface BookCardProps {
  book: Book;
  rank?: number;
  variant?: "default" | "trending";
}

export function BookCard({ book, rank, variant = "default" }: BookCardProps) {
  const coverUrl = book.formats["image/jpeg"] || "/placeholder-book.png";
  const author = book.authors[0]?.name.replace(/, /g, " ").split(" ").reverse().join(" ") || "Unknown Author";

  if (variant === "trending") {
    return (
      <Link href={`/book/${book.id}`}>
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="flex gap-4 items-center p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer group"
          data-testid={`card-trending-${book.id}`}
        >
          {rank && (
             <span className="text-4xl font-serif font-bold text-muted-foreground/20 group-hover:text-primary/50 transition-colors min-w-[40px]">
              {rank}
             </span>
          )}
          <div className="relative h-20 w-14 shrink-0 rounded overflow-hidden shadow-sm">
            <img src={coverUrl} alt={book.title} className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold truncate text-sm leading-tight mb-1" title={book.title}>{book.title}</h4>
            <p className="text-xs text-muted-foreground truncate">{author}</p>
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
               <span className="flex items-center gap-0.5"><Download className="w-3 h-3" /> {book.download_count}</span>
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link href={`/book/${book.id}`}>
      <motion.div 
        whileHover={{ y: -5 }}
        className="w-full cursor-pointer group"
        data-testid={`card-book-${book.id}`}
      >
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-md mb-3 bg-muted">
          <img 
            src={coverUrl} 
            alt={book.title} 
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>
        <h3 className="font-serif font-bold text-base leading-tight line-clamp-2 mb-1 group-hover:text-primary transition-colors" title={book.title}>
          {book.title}
        </h3>
        <p className="text-sm text-muted-foreground truncate">{author}</p>
        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
           <span className="flex items-center gap-1"><Download className="w-3 h-3" /> {book.download_count}</span>
           {/* Mock rating for visual consistency */}
           <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> 4.5</span>
        </div>
      </motion.div>
    </Link>
  );
}
