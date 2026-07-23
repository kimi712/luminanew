import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ArticleCard } from './components/ArticleCard';
import { ArticleDetail } from './components/ArticleDetail';
import { CompliancePageViewer } from './components/CompliancePageViewer';
import { InteractiveTools } from './components/InteractiveTools';
import { CookieBanner } from './components/CookieBanner';

import { categories } from './data/categories';
import { articles } from './data/articles';
import { Article } from './types';
import { 
  Search, BookOpen, ChevronRight, Flame, Sparkles, TrendingUp, Tag, ArrowUpDown, ChevronDown
} from 'lucide-react';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // View state
  const [currentView, setCurrentView] = useState<'home' | 'article' | 'compliance' | 'tools'>('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [compliancePageId, setCompliancePageId] = useState<string>('privacy-policy');

  // Search State
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Bookmarks
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('aevorynth_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleBookmark = (articleId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    let updated: string[];
    if (bookmarkedIds.includes(articleId)) {
      updated = bookmarkedIds.filter(id => id !== articleId);
    } else {
      updated = [...bookmarkedIds, articleId];
    }
    setBookmarkedIds(updated);
    localStorage.setItem('aevorynth_bookmarks', JSON.stringify(updated));
  };

  // Filter & Pagination State
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'likes'>('newest');
  const [visibleCount, setVisibleCount] = useState<number>(12);

  useEffect(() => {
    setVisibleCount(12);
  }, [selectedCategoryId, searchQuery, selectedTag, sortBy]);

  // Dummy AdSense Config for clean internal typing compatibility
  const adConfig = {
    publisherId: 'ca-pub-3059636267332071',
    autoAdsEnabled: true,
    displayMode: 'preview' as const,
    slots: {
      headerBanner: '',
      inArticle: '',
      sidebar: '',
      bottomBanner: '',
      stickyFooter: '',
    },
  };

  // Navigation Handlers
  const handleSelectArticle = (article: Article) => {
    setSelectedArticle(article);
    setCurrentView('article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateCompliance = (pageId: string) => {
    setCompliancePageId(pageId);
    setCurrentView('compliance');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Popular tags extraction for filter bar
  const popularTags = Array.from(
    new Set(articles.flatMap(a => a.tags))
  ).slice(0, 14);

  // Filtered & Sorted Articles
  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategoryId === null || article.categoryId === selectedCategoryId;
    const matchesTag = selectedTag === null || article.tags.includes(selectedTag);
    const matchesSearch = searchQuery.trim() === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesTag && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'popular') return b.views - a.views;
    if (sortBy === 'likes') return b.likes - a.likes;
    return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
  });

  const visibleArticles = filteredArticles.slice(0, visibleCount);
  const featuredArticle = articles.find(a => a.featured) || articles[0];

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-200 selection:bg-emerald-500 selection:text-white">
      {/* Header */}
      <Header
        categories={categories}
        currentView={currentView}
        selectedCategoryId={selectedCategoryId}
        onNavigateHome={() => {
          setCurrentView('home');
          setSelectedCategoryId(null);
          setSelectedTag(null);
        }}
        onSelectCategory={(catId) => {
          setSelectedCategoryId(catId);
          setSelectedTag(null);
          setCurrentView('home');
        }}
        onNavigateCompliance={handleNavigateCompliance}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenTools={() => setCurrentView('tools')}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <div className="space-y-8 pb-16">
            {/* Top Trending Ticker / Announcement Bar */}
            <div className="bg-stone-900 text-stone-200 text-xs py-2.5 px-4 border-b border-stone-800 shadow-inner">
              <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
                  <span className="bg-emerald-600 text-white font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> 100+ 精选深度长文库
                  </span>
                  <span className="text-stone-300 font-medium">
                    {featuredArticle.title}
                  </span>
                </div>
                <div className="hidden md:flex items-center gap-4 text-stone-400 text-[11px]">
                  <span>权威独立刊物</span>
                  <span>•</span>
                  <span>覆盖5大前沿视角</span>
                  <span>•</span>
                  <span>共100篇精品文献</span>
                </div>
              </div>
            </div>

            {/* Hero Section if no category or search filter */}
            {selectedCategoryId === null && searchQuery === '' && selectedTag === null && (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
                <div
                  onClick={() => handleSelectArticle(featuredArticle)}
                  className="group cursor-pointer relative overflow-hidden rounded-3xl bg-stone-900 text-white shadow-xl grid grid-cols-1 lg:grid-cols-12 items-center border border-stone-800 transition-all hover:border-emerald-500/50"
                >
                  {/* Left content */}
                  <div className="p-6 sm:p-10 lg:col-span-7 space-y-4 z-10">
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-500 text-stone-950 text-xs font-black px-3 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1 shadow-xs">
                        <Flame className="w-3.5 h-3.5" /> 焦点原创深度长文
                      </span>
                      <span className="text-xs text-stone-300 font-mono">
                        {featuredArticle.categoryNameCn}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-serif leading-tight group-hover:text-emerald-400 transition-colors">
                      {featuredArticle.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-stone-300 line-clamp-3 leading-relaxed">
                      {featuredArticle.summary}
                    </p>

                    <div className="pt-2 flex items-center gap-4 text-xs text-stone-300">
                      <div className="flex items-center gap-2">
                        <img
                          src={featuredArticle.author.avatar}
                          alt={featuredArticle.author.name}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-400"
                        />
                        <span className="font-semibold text-white">{featuredArticle.author.name}</span>
                      </div>
                      <span>•</span>
                      <span>{featuredArticle.readTimeMinutes} 分钟深度阅读</span>
                    </div>
                  </div>

                  {/* Right Image */}
                  <div className="lg:col-span-5 h-64 lg:h-full relative overflow-hidden">
                    <img
                      src={featuredArticle.coverImage}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-stone-900 via-stone-900/40 to-transparent" />
                  </div>
                </div>
              </section>
            )}

            {/* Popular Tag Filters */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
                <span className="font-bold text-stone-400 flex items-center gap-1 shrink-0">
                  <Tag className="w-3.5 h-3.5 text-emerald-500" /> 热门话题:
                </span>
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 ${
                    selectedTag === null
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700'
                  }`}
                >
                  全部话题
                </button>
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    className={`px-3 py-1 rounded-full text-xs transition-all shrink-0 ${
                      selectedTag === tag
                        ? 'bg-emerald-600 text-white font-bold shadow-xs'
                        : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </section>

            {/* Category Header & Sort Controls */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4 mb-6 gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold font-serif text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <span>
                      {selectedCategoryId
                        ? categories.find(c => c.id === selectedCategoryId)?.nameCn
                        : '深度独立文章文库'}
                    </span>
                    <span className="text-xs font-normal text-emerald-600 dark:text-emerald-400 font-mono bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      共 {filteredArticles.length} 篇文献
                    </span>
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    涵盖人工智能、绿色低碳、智能家居、数字财经与现代工作流 100 篇高品质原创新作。
                  </p>
                </div>

                {/* Sort dropdown */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400">
                    <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
                    <span>排序:</span>
                  </div>
                  <div className="flex items-center bg-stone-200 dark:bg-stone-800 p-0.5 rounded-xl text-xs font-medium">
                    <button
                      onClick={() => setSortBy('newest')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        sortBy === 'newest'
                          ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-bold shadow-xs'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                      }`}
                    >
                      最新发布
                    </button>
                    <button
                      onClick={() => setSortBy('popular')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        sortBy === 'popular'
                          ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-bold shadow-xs'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                      }`}
                    >
                      最多浏览
                    </button>
                    <button
                      onClick={() => setSortBy('likes')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        sortBy === 'likes'
                          ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-bold shadow-xs'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                      }`}
                    >
                      最高好评
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Articles Grid */}
              {visibleArticles.length > 0 ? (
                <div className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visibleArticles.map((article) => (
                      <ArticleCard
                        key={article.id}
                        article={article}
                        onSelectArticle={handleSelectArticle}
                        isBookmarked={bookmarkedIds.includes(article.id)}
                        onToggleBookmark={toggleBookmark}
                      />
                    ))}
                  </div>

                  {/* Load More Control */}
                  {visibleCount < filteredArticles.length && (
                    <div className="text-center pt-4">
                      <button
                        onClick={() => setVisibleCount(prev => prev + 12)}
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-stone-900 hover:bg-stone-800 dark:bg-stone-800 dark:hover:bg-stone-700 text-white text-xs font-bold rounded-2xl shadow-md transition-all hover:scale-[1.02] active:scale-95 group border border-stone-800 dark:border-stone-700"
                      >
                        <span>加载更多文章 ({filteredArticles.length - visibleCount} 篇待加载)</span>
                        <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform text-emerald-400" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-8 space-y-3">
                  <BookOpen className="w-12 h-12 text-stone-300 mx-auto" />
                  <h3 className="text-base font-bold text-stone-700 dark:text-stone-300">
                    未找到相关匹配文章
                  </h3>
                  <p className="text-xs text-stone-500">
                    请尝试重置话题标签或搜索关键词
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategoryId(null);
                      setSelectedTag(null);
                    }}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors"
                  >
                    重置筛选条件
                  </button>
                </div>
              )}
            </section>
          </div>
        )}

        {currentView === 'article' && selectedArticle && (
          <ArticleDetail
            article={selectedArticle}
            relatedArticles={articles.filter(a => a.id !== selectedArticle.id).slice(0, 3)}
            onSelectArticle={handleSelectArticle}
            onBack={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            adConfig={adConfig}
            isBookmarked={bookmarkedIds.includes(selectedArticle.id)}
            onToggleBookmark={(id) => toggleBookmark(id)}
            onNavigateCompliance={handleNavigateCompliance}
          />
        )}

        {currentView === 'compliance' && (
          <CompliancePageViewer
            pageId={compliancePageId}
            onBackHome={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigatePage={(pId) => setCompliancePageId(pId)}
          />
        )}

        {currentView === 'tools' && (
          <InteractiveTools />
        )}
      </main>

      {/* Footer */}
      <Footer
        categories={categories}
        onNavigateHome={() => {
          setCurrentView('home');
          setSelectedCategoryId(null);
          setSelectedTag(null);
        }}
        onSelectCategory={(catId) => {
          setSelectedCategoryId(catId);
          setSelectedTag(null);
          setCurrentView('home');
        }}
        onNavigateCompliance={handleNavigateCompliance}
      />

      {/* Cookie Consent Banner */}
      <CookieBanner onNavigatePrivacy={() => handleNavigateCompliance('privacy-policy')} />

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-xl w-full p-4 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
              <Search className="w-5 h-5 text-stone-400" />
              <input
                type="text"
                autoFocus
                placeholder="搜索 100 篇深度文献（例如：Ollama、Matter、全天候资产、第二大脑...）"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm bg-transparent border-none focus:outline-none text-stone-900 dark:text-stone-100 placeholder-stone-400"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => {
                      handleSelectArticle(art);
                      setSearchOpen(false);
                    }}
                    className="p-3 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer transition-colors flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        {art.title}
                      </div>
                      <div className="text-[11px] text-stone-500 line-clamp-1">
                        {art.summary}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-stone-400">
                  未找到匹配文章
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
