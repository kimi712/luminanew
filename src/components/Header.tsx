import React from 'react';
import {
  CreditCard,
  Compass,
  Calculator,
  Sparkles,
  Globe,
  Wifi,
  Smartphone,
  Headphones,
  FileText,
  ShieldCheck,
  Award,
  Radio,
} from 'lucide-react';
import { Language, Currency, CURRENCIES } from '../types';
import { LegalModalType } from './FooterLegal';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  compareCount: number;
  myEsimsCount: number;
  lang: Language;
  setLang: (lang: Language) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  onOpenLegalModal: (type: LegalModalType) => void;
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
  onOpenLegalModal,
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
    <header className="bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-50 shadow-xl text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo with Tech Glow */}
          <div
            onClick={() => setActiveTab('esim-store')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 rounded-xl flex items-center justify-center text-white font-bold text-lg font-display shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <Wifi className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="text-base sm:text-lg font-extrabold font-display text-white tracking-tight">
                  Lumina
                </h1>
                <span className="px-1.5 py-0.2 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] font-extrabold font-mono rounded tracking-wider uppercase">
                  Global
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping hidden sm:inline-block" />
              </div>
              <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
                eSIM Platform • 200+ Destinations
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden lg:flex space-x-1 items-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600/30 text-blue-300 font-bold border border-blue-500/40 shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{lang === 'en' ? item.nameEn : item.nameZh}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[9px] font-mono font-bold text-white shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-2.5">
            {/* Quick Support & About Buttons */}
            <div className="hidden sm:flex items-center space-x-1 pr-1 border-r border-slate-800 text-xs">
              <button
                onClick={() => onOpenLegalModal('contact')}
                className="px-2.5 py-1.5 rounded-xl text-slate-400 hover:text-blue-300 hover:bg-slate-800/80 transition-all font-mono text-[11px] flex items-center gap-1 cursor-pointer"
                title={lang === 'en' ? 'Contact Support' : '联系客服'}
              >
                <Headphones className="h-3.5 w-3.5 text-cyan-400" />
                <span>{lang === 'en' ? 'Support' : '客服'}</span>
              </button>
              <button
                onClick={() => onOpenLegalModal('about')}
                className="px-2.5 py-1.5 rounded-xl text-slate-400 hover:text-blue-300 hover:bg-slate-800/80 transition-all font-mono text-[11px] flex items-center gap-1 cursor-pointer"
                title={lang === 'en' ? 'About Us' : '关于我们'}
              >
                <Award className="h-3.5 w-3.5 text-amber-400" />
                <span>{lang === 'en' ? 'About' : '关于'}</span>
              </button>
            </div>

            {/* Currency Selector */}
            <div className="relative">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                aria-label="Currency"
                className="bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
              >
                {Object.values(CURRENCIES).map((c) => (
                  <option key={c.code} value={c.code} className="bg-slate-900 text-slate-200">
                    {c.symbol} {c.code}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Switcher */}
            <div className="flex bg-slate-900 p-0.5 rounded-xl border border-slate-700/80 text-xs font-bold font-mono">
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-blue-600 text-white shadow-xs font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('zh')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  lang === 'zh'
                    ? 'bg-blue-600 text-white shadow-xs font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                中文
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div className="lg:hidden flex overflow-x-auto py-2 border-t border-slate-800/80 space-x-1 scrollbar-none">
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
                    : 'text-slate-400 bg-slate-900/60 hover:bg-slate-800'
                }`}
              >
                <Icon className="h-3 w-3" />
                <span>{lang === 'en' ? item.nameEn : item.nameZh}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-1 px-1 rounded-full bg-blue-400 text-slate-950 text-[9px] font-mono font-bold">
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
