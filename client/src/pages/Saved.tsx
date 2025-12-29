import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useTranslation } from 'react-i18next';
import { useStore, BookStatus, SavedBook } from '@/lib/store';
import { BookCard } from '@/components/ui/book-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Saved() {
  const { t } = useTranslation();
  const { savedBooks } = useStore();

  const filterByStatus = (status: BookStatus) => savedBooks.filter(b => b.status === status);

  const statuses: BookStatus[] = ['favorites', 'reading_now', 'want_to_read', 'read_later', 'wont_read'];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="font-serif text-3xl font-bold mb-8">{t('saved')}</h1>

        <Tabs defaultValue="favorites" className="w-full">
          <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent justify-start mb-8 p-0">
            {statuses.map(status => (
              <TabsTrigger 
                key={status} 
                value={status}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border"
              >
                {t(status)} ({filterByStatus(status).length})
              </TabsTrigger>
            ))}
          </TabsList>

          {statuses.map(status => (
            <TabsContent key={status} value={status}>
              {filterByStatus(status).length === 0 ? (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
                  {t('no_results')}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {filterByStatus(status).map(book => (
                    // Adapt SavedBook to Book interface structure lightly for the card
                    <BookCard 
                      key={book.id} 
                      book={{
                        id: Number(book.id) || 0,
                        title: book.title,
                        authors: [{ name: book.author, birth_year: null, death_year: null }],
                        languages: ['en'], // Placeholder as we didn't save lang
                        download_count: 0,
                        formats: { 'image/jpeg': book.cover },
                        translators: [],
                        subjects: [],
                        bookshelves: [],
                        copyright: null,
                        media_type: 'Text'
                      }} 
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}