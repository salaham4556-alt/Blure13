import { Book } from "@/lib/api";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  books?: Book[];
  isLoading?: boolean;
}

export function Hero({ books, isLoading }: HeroProps) {
  // Autoplay needs to be configured correctly for looping
  const [emblaRef] = useEmblaCarousel(
    { 
      loop: true, 
      align: 'start',
      skipSnaps: false,
      duration: 30
    }, 
    [Autoplay({ delay: 5000, stopOnInteraction: false, playOnInit: true })]
  );

  if (isLoading || !books || books.length === 0) {
    return <div className="w-full h-[400px] bg-muted animate-pulse rounded-xl mb-8" />;
  }

  // Ensure we have enough slides for smooth looping
  const featuredBooks = books.length < 5 ? [...books, ...books] : books.slice(0, 10);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 to-transparent mb-12 border shadow-sm">
      <div className="embla overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {featuredBooks.map((book) => {
             const coverUrl = book.formats["image/jpeg"] || "/placeholder-book.png";
             const author = book.authors[0]?.name.replace(/, /g, " ").split(" ").reverse().join(" ") || "Unknown Author";
             
             return (
              <div key={book.id} className="flex-[0_0_100%] min-w-0 relative">
                <div className="grid md:grid-cols-2 gap-8 p-6 md:p-12 lg:p-16 items-center">
                  <div className="space-y-4 md:space-y-6 z-10 text-center md:text-left">
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-medium">
                      Featured Book
                    </span>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight text-foreground line-clamp-2">
                      {book.title}
                    </h1>
                    <p className="text-base md:text-lg text-muted-foreground md:w-3/4">
                      {author}
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                      <Link href={`/book/${book.id}`}>
                        <Button size="lg" className="rounded-full px-8 text-base md:text-lg font-serif">
                          Read Now
                        </Button>
                      </Link>
                      <Link href={`/book/${book.id}`}>
                        <Button variant="outline" size="lg" className="rounded-full">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="flex justify-center md:justify-end relative">
                    <div className="relative w-40 md:w-56 lg:w-64 aspect-[2/3] shadow-2xl rounded-lg rotate-2 hover:rotate-0 transition-transform duration-500 z-10">
                      <img 
                        src={coverUrl} 
                        alt={book.title} 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    {/* Decorative blurred background */}
                    <div 
                      className="absolute inset-0 bg-primary/20 blur-3xl -z-10 transform scale-125"
                      style={{ 
                        backgroundImage: `url(${coverUrl})`,
                        backgroundSize: 'cover',
                        opacity: 0.2
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
