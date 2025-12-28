import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchBookById } from "@/lib/api";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Download, BookOpen, Bookmark, Share2, Languages, User } from "lucide-react";
import { useBookStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

export default function BookDetails() {
  const [match, params] = useRoute("/book/:id");
  const id = params?.id ? parseInt(params.id) : 0;
  const { toast } = useToast();
  const { addBook } = useBookStore();

  const { data: book, isLoading } = useQuery({
    queryKey: ["book", id],
    queryFn: () => fetchBookById(id),
    enabled: !!id,
  });

  if (isLoading || !book) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="container px-4 py-8 flex-1 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading Book Magic...</div>
        </main>
      </div>
    );
  }

  const coverUrl = book.formats["image/jpeg"] || "/placeholder-book.png";
  const author = book.authors[0]?.name.replace(/, /g, " ").split(" ").reverse().join(" ") || "Unknown";

  const handleSave = (listType: 'favorites' | 'readNow' | 'dontWant' | 'readLater') => {
    addBook(listType, book);
    toast({
      title: "Book Saved!",
      description: `Added "${book.title}" to your ${listType} list.`,
    });
  };

  const availableFormats = Object.entries(book.formats)
    .filter(([key]) => key.includes("text/html") || key.includes("epub") || key.includes("kindle") || key.includes("plain"))
    .map(([mime, url]) => ({
       format: mime.split("/")[1].toUpperCase(),
       url,
       mime
    }));

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />
      
      <main className="container px-4 py-12 flex-1">
        <div className="grid md:grid-cols-12 gap-12">
          {/* Left: Huge Cover */}
          <div className="md:col-span-4 lg:col-span-3">
             <div className="sticky top-24">
               <div className="relative aspect-[2/3] rounded-lg shadow-2xl overflow-hidden border-4 border-background ring-1 ring-muted">
                 <img src={coverUrl} alt={book.title} className="w-full h-full object-cover" />
               </div>
             </div>
          </div>

          {/* Right: Details */}
          <div className="md:col-span-8 lg:col-span-9 space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4 leading-tight">
                {book.title}
              </h1>
              <div className="flex flex-wrap gap-4 items-center text-lg text-muted-foreground">
                <span className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {author}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                <span className="flex items-center gap-2">
                  <Languages className="w-5 h-5" />
                  {book.languages.join(", ").toUpperCase()}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                <span>
                  {book.download_count.toLocaleString()} Downloads
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {book.subjects.slice(0, 5).map(subject => (
                <Badge key={subject} variant="secondary" className="px-3 py-1 rounded-full text-sm">
                  {subject.split(" -- ").pop()}
                </Badge>
              ))}
            </div>

            {/* Action Area */}
            <div className="flex flex-wrap gap-4 p-6 bg-secondary/30 rounded-2xl border border-secondary">
               <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" className="rounded-full px-8 text-lg font-serif">
                       <BookOpen className="w-5 h-5 mr-2" />
                       Read Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Read "{book.title}"</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                       {availableFormats.filter(f => f.mime.includes("html") || f.mime.includes("plain")).map((fmt, i) => (
                         <a key={i} href={fmt.url} target="_blank" rel="noreferrer">
                           <Button variant="outline" className="w-full justify-between">
                             Read as {fmt.format}
                             <BookOpen className="w-4 h-4 ml-2" />
                           </Button>
                         </a>
                       ))}
                       {availableFormats.filter(f => f.mime.includes("html") || f.mime.includes("plain")).length === 0 && (
                          <p className="text-muted-foreground text-center">No online reading formats available.</p>
                       )}
                    </div>
                  </DialogContent>
               </Dialog>

               <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" variant="outline" className="rounded-full px-8 text-lg">
                       <Download className="w-5 h-5 mr-2" />
                       Download
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Download Options</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                       {availableFormats.map((fmt, i) => (
                         <a key={i} href={fmt.url} download>
                           <Button variant="secondary" className="w-full justify-between">
                             {fmt.format}
                             <Download className="w-4 h-4 ml-2" />
                           </Button>
                         </a>
                       ))}
                    </div>
                  </DialogContent>
               </Dialog>

               <DropdownMenu>
                 <DropdownMenuTrigger asChild>
                   <Button size="lg" variant="secondary" className="rounded-full px-4">
                      <Bookmark className="w-5 h-5 mr-2" />
                      Save
                   </Button>
                 </DropdownMenuTrigger>
                 <DropdownMenuContent>
                   <DropdownMenuItem onClick={() => handleSave('favorites')}>❤️ Favorites</DropdownMenuItem>
                   <DropdownMenuItem onClick={() => handleSave('readNow')}>📖 Read Now</DropdownMenuItem>
                   <DropdownMenuItem onClick={() => handleSave('readLater')}>🕰️ Read Later</DropdownMenuItem>
                   <DropdownMenuItem onClick={() => handleSave('dontWant')}>🚫 Don't Want</DropdownMenuItem>
                 </DropdownMenuContent>
               </DropdownMenu>

               <Button size="lg" variant="ghost" className="rounded-full px-4 ml-auto">
                  <Share2 className="w-5 h-5" />
               </Button>
            </div>

            {/* Description (Often Gutendex doesn't give a full description, so we use bookshelves or generated text) */}
            <div className="space-y-4">
               <h3 className="text-2xl font-serif font-bold">About the Book</h3>
               <p className="text-lg leading-relaxed text-muted-foreground">
                 This edition of <strong>{book.title}</strong> is provided by Project Gutenberg. 
                 It is available for free download and reading. 
                 {book.bookshelves.length > 0 && `It is part of the following collections: ${book.bookshelves.join(", ")}.`}
               </p>
               <div className="bg-muted p-4 rounded-lg text-sm font-mono text-muted-foreground">
                 <p>Project Gutenberg ID: {book.id}</p>
                 <p>Copyright Status: {book.copyright ? "Copyrighted" : "Public Domain"}</p>
                 <p>Media Type: {book.media_type}</p>
               </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
