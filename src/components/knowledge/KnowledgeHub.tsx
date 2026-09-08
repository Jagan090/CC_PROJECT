import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookMarked,
  Search,
  Tag,
  Clock,
  User,
  ArrowRight,
  ExternalLink,
  Sparkles,
  BookOpen,
  X,
  ArrowUpRight
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { KnowledgeArticle } from '../../types';

export const KnowledgeHub: React.FC = () => {
  const [articles, setArticles] = React.useState<KnowledgeArticle[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [readingArticle, setReadingArticle] = React.useState<KnowledgeArticle | null>(null);

  React.useEffect(() => {
    setArticles(dataService.getArticles());
  }, []);

  const categories = ['All', 'Cloud & Infrastructure', 'Backend & Data', 'AI & Security', 'Leadership & Culture'];

  const filteredArticles = articles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-in fade-in max-w-6xl mx-auto pb-12">
      {/* Header matching macOS Dark Luxury */}
      <section className="relative bg-[#121318] border border-white/5 rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#c2f866]/10 text-[#c2f866] border border-[#c2f866]/20">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Engineering Standards</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Enterprise Knowledge Hub
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Peer-reviewed engineering blueprints, best practice runbooks, architecture standards, and incident lessons learned.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Categories Filter Bar */}
      <div className="bg-[#121318] rounded-[28px] border border-white/5 p-5 shadow-xl space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            id="knowledge-search-input"
            type="text"
            placeholder="Search architectural standards, tags (e.g. VPC, Security, GenAI), or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 text-xs bg-[#161722] border border-white/5 rounded-2xl text-white placeholder-zinc-500 focus:outline-hidden focus:border-[#c2f866]/50 focus:ring-2 focus:ring-[#c2f866]/20 transition"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer macos-button ${
                  isSelected
                    ? 'bg-[#c2f866] text-black shadow-md shadow-lime-500/20'
                    : 'bg-[#181922] text-zinc-300 hover:bg-[#20222f] hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredArticles.map((article) => (
          <motion.div
            key={article.id}
            whileHover={{ y: -6, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            onClick={() => setReadingArticle(article)}
            className="bg-[#14151c] rounded-[28px] border border-white/5 hover:border-white/20 p-6 shadow-xl transition cursor-pointer flex flex-col justify-between group macos-card"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/5 text-zinc-300 border border-white/10">
                  {article.category}
                </span>
                <span className="text-xs text-zinc-400 flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  {article.readTimeMinutes} min read
                </span>
              </div>

              <h3 className="font-display text-lg font-bold text-white leading-snug group-hover:text-[#c2f866] transition">
                {article.title}
              </h3>

              <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                {article.summary}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#181924] text-zinc-400 border border-white/5"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
              <span>Author: <strong className="text-white">{article.author}</strong></span>
              <span className="text-[#c2f866] font-extrabold flex items-center gap-1 group-hover:translate-x-1 transition">
                <span>Read Blueprint</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Full Article Reader Modal with macOS spring & blur */}
      <AnimatePresence>
        {readingArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="bg-[#121318] rounded-[32px] shadow-2xl border border-white/10 w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden text-white macos-card"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#161722] shrink-0">
                <div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#c2f866]/10 text-[#c2f866] border border-[#c2f866]/20">
                    {readingArticle.category}
                  </span>
                  <h2 className="font-display text-xl font-bold text-white mt-2">
                    {readingArticle.title}
                  </h2>
                  <div className="text-xs text-zinc-400 mt-1 flex items-center gap-3">
                    <span>Author: <strong className="text-zinc-300">{readingArticle.author}</strong></span>
                    <span>•</span>
                    <span>Published {readingArticle.publishedAt}</span>
                    <span>•</span>
                    <span>{readingArticle.readTimeMinutes} min read</span>
                  </div>
                </div>
                <button
                  onClick={() => setReadingArticle(null)}
                  className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/10 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-zinc-300 leading-relaxed scrollbar-thin">
                <div className="bg-[#181924] border border-white/5 rounded-2xl p-5 text-zinc-200 font-medium leading-relaxed">
                  {readingArticle.summary}
                </div>

                <div className="whitespace-pre-line text-zinc-300 leading-relaxed font-normal space-y-4">
                  {readingArticle.content}
                </div>
              </div>

              <div className="p-5 bg-[#161722] border-t border-white/5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  {readingArticle.tags.map((t) => (
                    <span key={t} className="px-2.5 py-0.5 rounded-full text-[10px] bg-white/5 text-zinc-400 border border-white/5">
                      #{t}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setReadingArticle(null)}
                  className="px-5 py-2 bg-[#c2f866] hover:bg-[#b0f34c] text-black rounded-full text-xs font-extrabold transition shadow-md shadow-lime-500/20 cursor-pointer macos-button"
                >
                  Close Blueprint
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
