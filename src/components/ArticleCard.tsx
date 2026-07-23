import React from 'react';
import { Article } from '../types';
import { Clock, Eye, ThumbsUp, Sparkles, User, Bookmark } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  onSelectArticle: (article: Article) => void;
  isBookmarked: boolean;
  onToggleBookmark: (articleId: string, e: React.MouseEvent) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onSelectArticle,
  isBookmarked,
  onToggleBookmark,
}) => {
  return (
    <article
      onClick={() => onSelectArticle(article)}
      className="group cursor-pointer bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1"
    >
      {/* Article Cover Image Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
        <img
          src={article.coverImage}
          alt={article.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-md text-stone-900 dark:text-stone-100 text-[11px] font-extrabold px-2.5 py-1 rounded-lg border border-white/20 shadow-xs">
            {article.categoryNameCn}
          </span>
          {article.featured && (
            <span className="bg-amber-500 text-stone-950 font-black text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3 inline" /> 重点推荐
            </span>
          )}
        </div>

        {/* Bookmark Button */}
        <button
          onClick={(e) => onToggleBookmark(article.id, e)}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all ${
            isBookmarked
              ? 'bg-amber-500 text-stone-950 shadow-md'
              : 'bg-black/40 text-white hover:bg-black/60'
          }`}
          title={isBookmarked ? '已收藏' : '收藏文章'}
        >
          <Bookmark className="w-4 h-4 fill-current" />
        </button>

        {/* Read Time badge */}
        <div className="absolute bottom-3 right-3 text-white/90 text-[11px] font-medium bg-black/50 backdrop-blur-md px-2 py-0.5 rounded flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{article.readTimeMinutes} 分钟深度阅读</span>
        </div>
      </div>

      {/* Article Meta & Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug font-serif">
            {article.title}
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-3 leading-relaxed">
            {article.summary}
          </p>
        </div>

        {/* Footer info: Author & Stats */}
        <div className="pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-stone-300 dark:ring-stone-700 shrink-0"
            />
            <span className="font-medium text-stone-700 dark:text-stone-300 truncate text-[11px]">
              {article.author.name}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-[11px] font-mono">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-stone-400" />
              <span>{article.views}</span>
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="w-3.5 h-3.5 text-stone-400" />
              <span>{article.likes}</span>
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
