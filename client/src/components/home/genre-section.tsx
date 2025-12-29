import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { BookOpen, Compass, Clock, GraduationCap, Heart, Code, Globe, History } from 'lucide-react';
import { motion } from 'framer-motion';

const genres = [
  { id: 'fiction', icon: BookOpen, label: 'Fiction', query: 'topic=fiction' },
  { id: 'science', icon: Compass, label: 'Science', query: 'topic=science' },
  { id: 'history', icon: History, label: 'History', query: 'topic=history' },
  { id: 'romance', icon: Heart, label: 'Romance', query: 'topic=romance' },
  { id: 'philosophy', icon: GraduationCap, label: 'Philosophy', query: 'topic=philosophy' },
  { id: 'mystery', icon: Clock, label: 'Mystery', query: 'topic=mystery' },
];

export function GenreSection() {
  const { t } = useTranslation();

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="font-serif text-3xl font-bold mb-8 text-center">{t('genres')}</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {genres.map((genre, index) => (
            <Link key={genre.id} href={`/explore?${genre.query}`}>
              <motion.div
                whileHover={{ scale: 1.1, y: -5 }}
                className="flex flex-col items-center gap-3 cursor-pointer group"
              >
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 ring-2 ring-transparent group-hover:ring-primary/20">
                  <genre.icon className="w-8 h-8" />
                </div>
                <span className="font-medium text-sm group-hover:text-primary transition-colors">
                  {genre.label}
                </span>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}