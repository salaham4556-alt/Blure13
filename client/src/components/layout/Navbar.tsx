import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'wouter';
import { Search, Moon, Sun, Menu, Globe, Heart, BookOpen, Bookmark } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function Navbar() {
  const { t, i18n } = useTranslation();
  const [isDark, setIsDark] = useState(false);
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  // Initial dark mode check
  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove('dark');
      setIsDark(false);
    } else {
      root.classList.add('dark');
      setIsDark(true);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/explore?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/">
          <a className="font-serif text-2xl font-bold text-primary hover:opacity-80 transition-opacity flex items-center gap-2">
            <img src="https://i.postimg.cc/cJsW1YJR/IMG-20251228-133427.png" alt="Blure Books Logo" className="h-10 w-10 object-contain rounded-full border border-primary/20" />
            <span className="hidden sm:inline">Blure Books</span>
          </a>
        </Link>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder={t('search_placeholder')} 
              className="pl-10 bg-secondary/50 border-transparent focus:border-primary rounded-full transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          
          {/* Saved Menu */}
          <Link href="/saved">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" title={t('saved')}>
              <Bookmark className="h-5 w-5" />
            </Button>
          </Link>

          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => changeLanguage('en')}>English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('ar')}>العربية</DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('fr')}>Français</DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('es')}>Español</DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('de')}>Deutsch</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5 text-yellow-500" />}
          </Button>

          {/* Authors Link */}
          <Link href="/authors">
            <Button variant="ghost" className="hidden md:flex">
              {t('authors')}
            </Button>
          </Link>

          {/* About Link (Desktop) */}
          <Link href="/about">
            <Button variant="ghost" className="hidden md:flex">
              {t('about')}
            </Button>
          </Link>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side={i18n.language === 'ar' ? 'right' : 'left'}>
              <div className="flex flex-col gap-4 mt-8">
                <form onSubmit={handleSearch} className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder={t('search_placeholder')} 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
                <Link href="/"><a className="text-lg font-medium">{t('home')}</a></Link>
                <Link href="/authors"><a className="text-lg font-medium">{t('authors')}</a></Link>
                <Link href="/saved"><a className="text-lg font-medium">{t('saved')}</a></Link>
                <Link href="/about"><a className="text-lg font-medium">{t('about')}</a></Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}