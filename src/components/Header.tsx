import React from 'react';
import { CreditCard, Compass, Calculator, Sparkles, Globe, Wifi, Smartphone, DollarSign } from 'lucide-react';
import { Language, Currency, CURRENCIES } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  compareCount: number;
  myEsimsCount: number;
  lang: Language;
  setLang: (lang: Language) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  compareCount,
  myEsimsCount,
  lang,
  setLang,
  currency,
  setCurrency,
}) => {
  const navItems = [
    { id: 'esim-store', nameEn: 'eSIM Store', nameZh: '全球 eSIM 商店', icon: Globe },
    { id: 'my-esims', nameEn: 'My eSIMs', nameZh: '我的 eSIM', icon: Smartphone, badge: myEsimsCount },
    { id: 'library', nameEn: 'Travel Cards', nameZh: '美卡 & 权益', icon: CreditCard, badge: compareCount },
    { id: 'calculator', nameEn: 'Rewards Calculator', nameZh: '收益计算器', icon: Calculator },
    { id: 'strategy', nameEn: 'Application Guide', nameZh: '申卡指南 & 铁律', icon: Compass },
    { id: 'ai-consultant', nameEn: 'AI Travel Advisor', nameZh: 'AI 智囊问诊', icon: Sparkles },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Brand Logo */}
          <div
            onClick={() => setActiveTab('esim-store')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-9 h-9 bg-gradient-to-tr from-blue-700 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg font-display shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Wifi className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="text-base sm:text-lg font-extrabold font-display text-slate-900 tracking-tight">
                  Lumina
                </h1>
                <span className="px-1.5 py-0.2 bg-blue-100 text-blue-700 text-[10px] font-extrabold font-mono rounded tracking-wider uppercase">
                  Global
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Travel eSIM & Financial Intelligence
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex space-x-1 items-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{lang === 'en' ? item.nameEn : item.nameZh}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-mono font-bold text-white shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar (Currency & Language Switcher) */}
          <div className="flex items-center space-x-2">
            
            {/* Currency Selector */}
            <div className="relative">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                aria-label="Currency"
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
              >
                {Object.values(CURRENCIES).map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} {c.code}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Switcher */}
            <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-bold font-mono">
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-white text-blue-600 shadow-2xs font-extrabold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('zh')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  lang === 'zh'
                    ? 'bg-white text-blue-600 shadow-2xs font-extrabold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                中文
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer / Sub-nav */}
        <div className="md:hidden flex overflow-x-auto py-2 border-t border-slate-100 space-x-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-600 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <Icon className="h-3 w-3" />
                <span>{lang === 'en' ? item.nameEn : item.nameZh}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-1 px-1 rounded-full bg-white text-blue-600 text-[9px] font-mono font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
