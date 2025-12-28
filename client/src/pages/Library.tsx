import { useBookStore } from "@/lib/store";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BookCard } from "@/components/books/BookCard";
import { useRoute } from "wouter";

export default function Library() {
  const [match, params] = useRoute("/library/:type");
  const { lists } = useBookStore();
  
  const type = params?.type as keyof typeof lists;
  const books = lists[type] || [];
  
  const titles = {
    favorites: "Favorites",
    readNow: "Reading Now",
    dontWant: "Finished",
    readLater: "Read Later"
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />
      <main className="container px-4 py-12 flex-1">
        <h1 className="text-4xl font-serif font-bold mb-8 capitalize">
          {titles[type] || "My Library"}
        </h1>
        
        {books.length === 0 ? (
          <div className="text-center py-20 bg-secondary/20 rounded-2xl border border-dashed">
            <p className="text-xl text-muted-foreground">No books in this list yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
