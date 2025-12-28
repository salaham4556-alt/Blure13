import { Book } from "@/lib/api";
import { BookCard } from "@/components/books/BookCard";

interface TrendingListProps {
  books?: Book[];
  isLoading?: boolean;
}

export function TrendingList({ books, isLoading }: TrendingListProps) {
  if (isLoading) return <div className="h-96 bg-muted animate-pulse rounded-lg" />;

  const trendingBooks = books?.slice(0, 5) || [];

  return (
    <div className="bg-card border rounded-xl p-6 h-full sticky top-24">
      <h3 className="text-xl font-serif font-bold mb-6 flex items-center gap-2">
        <span className="text-primary">🔥</span> Trending Now
      </h3>
      <div className="flex flex-col gap-2">
        {trendingBooks.map((book, idx) => (
          <BookCard key={book.id} book={book} rank={idx + 1} variant="trending" />
        ))}
      </div>
    </div>
  );
}
