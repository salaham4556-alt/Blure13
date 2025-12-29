import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Book } from '@/lib/books';
import { BookCard } from '@/components/ui/book-card';
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface HeroSliderProps {
  books: Book[];
}

export function HeroSlider({ books }: HeroSliderProps) {
  // Use first 5 books for the hero slider
  const heroBooks = books.slice(0, 5);

  return (
    <section className="relative w-full py-8 md:py-12 bg-gradient-to-b from-primary/5 to-background overflow-hidden">
      <div className="container mx-auto px-4">
        <Carousel 
          className="w-full"
          plugins={[
            Autoplay({
              delay: 4000,
            }),
          ]}
        >
          <CarouselContent>
            {heroBooks.map((book) => (
              <CarouselItem key={book.id} className="md:basis-1/2 lg:basis-1/2 xl:basis-1/3 pl-4">
                <div className="p-1 h-full">
                  <BookCard book={book} featured />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="left-0 -ml-4" />
            <CarouselNext className="right-0 -mr-4" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}