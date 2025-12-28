import { BookOpen, FlaskConical, Hourglass, Terminal, Landmark, Heart, Briefcase, Music, Palette } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

const genres = [
  { name: "Fiction", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10", query: "fiction" },
  { name: "Science", icon: FlaskConical, color: "text-green-500", bg: "bg-green-500/10", query: "science" },
  { name: "History", icon: Hourglass, color: "text-amber-500", bg: "bg-amber-500/10", query: "history" },
  { name: "Tech", icon: Terminal, color: "text-purple-500", bg: "bg-purple-500/10", query: "technology" },
  { name: "Politics", icon: Landmark, color: "text-red-500", bg: "bg-red-500/10", query: "politics" },
  { name: "Romance", icon: Heart, color: "text-pink-500", bg: "bg-pink-500/10", query: "romance" },
  { name: "Business", icon: Briefcase, color: "text-slate-500", bg: "bg-slate-500/10", query: "business" },
  { name: "Art", icon: Palette, color: "text-orange-500", bg: "bg-orange-500/10", query: "art" },
];

export function GenreList() {
  const [, setLocation] = useLocation();

  return (
    <div className="py-8">
      <h3 className="text-xl font-serif font-bold mb-6">Browse by Genre</h3>
      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
        {genres.map((genre) => (
          <motion.div
            key={genre.name}
            whileHover={{ y: -5 }}
            onClick={() => setLocation(`/?topic=${genre.query}`)}
            className="flex flex-col items-center gap-2 min-w-[80px] cursor-pointer group"
          >
            <div className={`w-16 h-16 rounded-full ${genre.bg} flex items-center justify-center transition-colors group-hover:bg-primary/20`}>
              <genre.icon className={`w-8 h-8 ${genre.color}`} />
            </div>
            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              {genre.name}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
