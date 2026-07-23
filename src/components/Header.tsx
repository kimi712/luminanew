import React, { useState } from 'react';
import { 
  Search, Menu, X, Sun, Moon, Feather, Sparkles
} from 'lucide-react';
import { Category } from '../types';

interface HeaderProps {
  categories: Category[];
  currentView: string;
  selectedCategoryId: string | null;
  onNavigateHome: () => void;
  onSelectCategory: (id: string | null) => void;
  onNavigateCompliance: (pageId: string) => void;
  onOpenSearch: () => void;
  onOpenTools: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  categories,
  currentView,
  selectedCategoryId,
  onNavigateHome,
  onSelectCategory,
  onNavigateCompliance,
  onOpenSearch,
  onOpenTools,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onNavigateHome();
                onSelectCategory(null);
              }}
              className="group text-left flex items-center gap-3 focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-700 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <Feather className="w-5 h-5 text-emerald-100" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-stone-900 dark:text-stone-100 font-serif">
                  Aevorynth<span className="text-emerald-600 dark:text-emerald-400">.</span>
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] font-bold text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-700 px-1.5 py-0.5 rounded uppercase tracking-widest">
                  Digital Publication
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => {
                onNavigateHome();
                onSelectCategory(null);
              }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'home' && selectedCategoryId === null
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              全部文章
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onNavigateHome();
                  onSelectCategory(cat.id);
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'home' && selectedCategoryId === cat.id
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                {cat.nameCn}
              </button>
            ))}

            <button
              onClick={onOpenTools}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                currentView === 'tools'
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>实用工具箱</span>
            </button>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-2 text-xs font-medium"
              title="搜索文章"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline text-stone-400">搜索</span>
            </button>

            {/* Dark Mode */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
              title={isDarkMode ? '切换亮色模式' : '切换深色模式'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            <button
              onClick={() => {
                onNavigateHome();
                onSelectCategory(null);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              全部文章
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onNavigateHome();
                  onSelectCategory(cat.id);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                {cat.nameCn}
              </button>
            ))}
            <button
              onClick={() => {
                onOpenTools();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              实用工具箱
            </button>
          </div>

          <div className="pt-3 border-t border-stone-200 dark:border-stone-800 grid grid-cols-2 gap-2 text-xs text-stone-600 dark:text-stone-400">
            <button onClick={() => { onNavigateCompliance('privacy-policy'); setMobileMenuOpen(false); }} className="p-2 text-left hover:underline">隐私政策声明</button>
            <button onClick={() => { onNavigateCompliance('terms-of-service'); setMobileMenuOpen(false); }} className="p-2 text-left hover:underline">服务条款</button>
            <button onClick={() => { onNavigateCompliance('about-us'); setMobileMenuOpen(false); }} className="p-2 text-left hover:underline">关于我们</button>
            <button onClick={() => { onNavigateCompliance('contact-us'); setMobileMenuOpen(false); }} className="p-2 text-left hover:underline">联系我们</button>
            <button onClick={() => { onNavigateCompliance('disclaimer'); setMobileMenuOpen(false); }} className="p-2 text-left hover:underline">免责与版权声明</button>
          </div>
        </div>
      )}
    </header>
  );
};
