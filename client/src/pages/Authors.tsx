import { useQuery } from "@tanstack/react-query";
import { fetchBooks } from "@/lib/api";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Search, User, Filter } from "lucide-react";

export default function Authors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  const { data: booksData, isLoading } = useQuery({
    queryKey: ["authors-list"],
    queryFn: () => fetchBooks({ sort: "popular" }),
  });

  // Extract unique authors from the books
  const authors = useMemo(() => {
    if (!booksData) return [];
    const authorMap = new Map();
    
    booksData.results.forEach(book => {
      book.authors.forEach(author => {
        if (!authorMap.has(author.name)) {
          authorMap.set(author.name, author);
        }
      });
    });
    
    let result = Array.from(authorMap.values());
    
    if (searchTerm) {
      result = result.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    
    if (yearFilter) {
      const year = parseInt(yearFilter);
      result = result.filter(a => (a.birth_year && a.birth_year === year) || (a.death_year && a.death_year === year));
    }
    
    return result;
  }, [booksData, searchTerm, yearFilter]);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />
      
      <main className="container px-4 py-12 flex-1">
        <div className="mb-12 space-y-4">
          <h1 className="text-4xl font-serif font-bold text-foreground">Discover Authors</h1>
          <p className="text-muted-foreground text-lg">Browse through the brilliant minds behind your favorite classics.</p>
          
          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search authors..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative w-full md:w-48">
              <Filter className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                type="number"
                placeholder="Filter by year..." 
                className="pl-10"
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="animate-pulse h-32" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {authors.map((author, idx) => (
              <Link key={idx} href={`/?author=${encodeURIComponent(author.name)}`}>
                <Card className="hover:border-primary transition-all cursor-pointer group">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {author.name.replace(/, /g, " ").split(" ").reverse().join(" ")}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {author.birth_year ? `${author.birth_year} - ` : ""}
                        {author.death_year || ""}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
        
        {!isLoading && authors.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-xl">No authors found matching your criteria.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
