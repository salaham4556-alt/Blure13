import { Link, useLocation } from "wouter";
import { Search, Moon, Sun, Menu, Bookmark, Globe, Info, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useBookStore } from "@/lib/store";

export function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { lists } = useBookStore();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLibraryNav = (type: string) => {
    setLocation(`/library/${type}`);
  };

  const totalSaved = Object.values(lists).reduce((acc, list) => acc + list.length, 0);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between px-4">
        
        {/* Left: Desktop Nav */}
        <div className="hidden md:flex items-center gap-2 lg:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2" data-testid="btn-lang">
                <Globe className="h-4 w-4" />
                <span>Language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => alert('Language switched to Arabic')}>العربية</DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert('Language switched to English')}>English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert('Language switched to French')}>Français</DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert('Language switched to Spanish')}>Español</DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert('Language switched to German')}>Deutsch</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsDark(!isDark)}
            data-testid="btn-theme-toggle"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Link href="/authors">
            <Button variant="ghost" size="sm" className="gap-2">
              <Users className="h-4 w-4" />
              <span>Authors</span>
            </Button>
          </Link>
          
          <Link href="/about">
            <Button variant="ghost" size="sm" className="gap-2">
              <Info className="h-4 w-4" />
              <span>About</span>
            </Button>
          </Link>
        </div>

        {/* Center: Logo (Mobile & Desktop) */}
        <Link href="/" className="flex items-center gap-3">
          <img 
            src="https://i.postimg.cc/cJsW1YJR/IMG-20251228-133427.png" 
            alt="Logo" 
            className="h-12 w-12 md:h-14 md:w-14 object-contain" 
          />
          <span className="text-2xl font-bold font-serif tracking-tight text-primary hidden sm:inline-block">Blure Books</span>
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Desktop Search */}
          <div className="hidden lg:block w-64">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-9 h-10 bg-secondary/50 border-transparent focus:border-primary focus:bg-background transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative" data-testid="btn-saved">
                <Bookmark className="h-5 w-5" />
                {totalSaved > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] flex items-center justify-center text-primary-foreground">
                    {totalSaved}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem disabled>My Library</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLibraryNav('favorites')}>Favorites ({lists.favorites.length})</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLibraryNav('readNow')}>Reading Now ({lists.readNow.length})</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLibraryNav('readLater')}>Read Later ({lists.readLater.length})</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLibraryNav('dontWant')}>Finished ({lists.dontWant.length})</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Toggle */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetTitle className="text-left font-serif text-2xl mb-8">Menu</SheetTitle>
              <div className="flex flex-col gap-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Search</h4>
                  <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search books..."
                      className="pl-9 w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </form>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Navigation</h4>
                  <nav className="flex flex-col gap-2">
                    <Link href="/authors" className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary text-lg">
                      <Users className="h-5 w-5" /> Authors
                    </Link>
                    <Link href="/about" className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary text-lg">
                      <Info className="h-5 w-5" /> About
                    </Link>
                    <button onClick={() => handleLibraryNav('favorites')} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary text-lg w-full text-left">
                      <Bookmark className="h-5 w-5" /> My Library
                    </button>
                  </nav>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Preferences</h4>
                  <div className="flex flex-col gap-2">
                    <Button 
                      variant="outline" 
                      className="justify-start gap-3 w-full" 
                      onClick={() => setIsDark(!isDark)}
                    >
                      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                      {isDark ? "Light Mode" : "Dark Mode"}
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="justify-start gap-3 w-full">
                          <Globe className="h-5 w-5" />
                          Language
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[250px]">
                        <DropdownMenuItem onClick={() => alert('العربية')}>العربية</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => alert('English')}>English</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => alert('Français')}>Français</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => alert('Español')}>Español</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => alert('Deutsch')}>Deutsch</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
