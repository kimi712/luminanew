import React, { useState } from 'react';
import {
  Globe2,
  Mail,
  ShieldCheck,
  FileText,
  HelpCircle,
  Sparkles,
  Send,
  CheckCircle2,
  Lock,
  Zap,
  PhoneCall,
  MapPin,
  Clock,
  Radio,
  ExternalLink,
  ChevronRight,
  Headphones,
  Award,
} from 'lucide-react';
import { Language } from '../types';

export type LegalModalType = 'about' | 'contact' | 'terms' | 'privacy' | 'refund' | null;

interface FooterLegalProps {
  lang: Language;
  onOpenModal: (type: LegalModalType) => void;
  onSelectCategory?: (tab: string) => void;
}

export const FooterLegal: React.FC<FooterLegalProps> = ({
  lang,
  onOpenModal,
  onSelectCategory,
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    setSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/80 pt-16 pb-12 relative overflow-hidden">
      {/* Subtle background tech glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Company Statement Hero Banner */}
        <div className="bg-gradient-to-r from-slate-900/90 via-blue-950/40 to-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-12 shadow-2xl backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[11px] font-bold font-mono uppercase tracking-wider">
                <Radio className="h-3 w-3 text-cyan-400 animate-pulse" />
                <span>{lang === 'en' ? 'Global Network & Platform Mission' : '全球互联与平台使命'}</span>
              </div>
              <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
                <strong className="text-white font-bold">Lumina Global</strong> operates a digital
                cross-border travel platform providing instant high-speed travel eSIM data packages and
                travel optimization tools for international travelers across 200+ countries.
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                {lang === 'en'
                  ? 'Engineered for international business leaders, US credit card players, digital nomads and vacationers worldwide with pure clean ISP routing and instant delivery.'
                  : '专为全球商务人士、美卡玩家、数字游民及跨国旅行者打造，提供纯净一级电信 ISP 原生路由及 60 秒极速自动化交付体验。'}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <button
                onClick={() => onOpenModal('contact')}
                className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
              >
                <Headphones className="h-4 w-4" />
                <span>{lang === 'en' ? '24/7 Global Support' : '24/7 全球客服'}</span>
              </button>
              <button
                onClick={() => onOpenModal('about')}
                className="px-5 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
              >
                <Award className="h-4 w-4 text-amber-400" />
                <span>{lang === 'en' ? 'About Lumina' : '关于我们'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4-Column Footer Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          {/* Col 1: Brand Info (2 spans on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg font-display shadow-md shadow-blue-500/20">
                <Globe2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white font-display tracking-tight">
                  Lumina Global Inc.
                </h3>
                <p className="text-[10px] text-blue-400 font-mono">
                  CROSS-BORDER TRAVEL & TELECOM PLATFORM
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed pr-6">
              {lang === 'en'
                ? 'Empowering borderless journeys with instant 5G travel eSIMs, clean residential routing for US credit cards, and intelligent travel points maximization.'
                : '以极速 5G 原生网络、美卡纯净住宅路由与智能常旅客点数工具，助力全球旅行者开启无界畅行之旅。'}
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-1.5 font-mono text-[11px]">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-slate-500" />
                <span>support@lumina-global.io</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-slate-500" />
                <span>24/7 Tier-1 Telecom Response Center</span>
              </div>
            </div>
          </div>

          {/* Col 2: Products & eSIMs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              {lang === 'en' ? 'eSIM Solutions' : 'eSIM 解决方案'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onSelectCategory && onSelectCategory('esim-store')}
                  className="hover:text-blue-400 transition-colors cursor-pointer text-left"
                >
                  {lang === 'en' ? 'USA Clean Native IP eSIM' : '美国原生纯净 IP eSIM'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory && onSelectCategory('esim-store')}
                  className="hover:text-blue-400 transition-colors cursor-pointer text-left"
                >
                  {lang === 'en' ? 'Europe 42 Countries Pass' : '欧洲全境 42 国通票'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory && onSelectCategory('esim-store')}
                  className="hover:text-blue-400 transition-colors cursor-pointer text-left"
                >
                  {lang === 'en' ? 'Japan Docomo/SoftBank 5G' : '日本双 5G 高速卡'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory && onSelectCategory('esim-store')}
                  className="hover:text-blue-400 transition-colors cursor-pointer text-left"
                >
                  {lang === 'en' ? 'Global 140+ Countries Master' : '全球 140+ 国一卡通'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory && onSelectCategory('esim-store')}
                  className="hover:text-blue-400 transition-colors cursor-pointer text-left"
                >
                  {lang === 'en' ? '365-Day Long Term Keeper' : '365天长效保号养卡'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              {lang === 'en' ? 'Legal & Trust' : '服务与合规条款'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onOpenModal('terms')}
                  className="hover:text-blue-400 transition-colors cursor-pointer flex items-center gap-1.5 text-left"
                >
                  <FileText className="h-3 w-3 text-slate-500" />
                  <span>{lang === 'en' ? 'Terms of Service' : '服务条款 (Terms)'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenModal('privacy')}
                  className="hover:text-blue-400 transition-colors cursor-pointer flex items-center gap-1.5 text-left"
                >
                  <ShieldCheck className="h-3 w-3 text-slate-500" />
                  <span>{lang === 'en' ? 'Privacy Policy' : '隐私保护政策 (Privacy)'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenModal('refund')}
                  className="hover:text-blue-400 transition-colors cursor-pointer flex items-center gap-1.5 text-left"
                >
                  <Lock className="h-3 w-3 text-slate-500" />
                  <span>{lang === 'en' ? 'Refund & SLA Policy' : '退款保障与 SLA 承诺'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenModal('about')}
                  className="hover:text-blue-400 transition-colors cursor-pointer flex items-center gap-1.5 text-left"
                >
                  <Award className="h-3 w-3 text-slate-500" />
                  <span>{lang === 'en' ? 'About Lumina Global' : '关于 Lumina Global'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Direct Dispatch */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              {lang === 'en' ? 'Promo & Updates' : '优惠码与特惠推送'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'en'
                ? 'Get 20% discount promo codes and 5G network expansion notifications.'
                : '订阅特惠邮件，即时获取 8折 优惠码与全球 5G 开通通知。'}
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder={lang === 'en' ? 'Enter your email' : '输入您的邮箱'}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {subscribed ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">{lang === 'en' ? 'Subscribed!' : '已订阅！'}</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>{lang === 'en' ? 'Get VIP Discount' : '领取专属折扣'}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Copyright & Security Badges */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="text-center md:text-left space-y-1">
            <p className="font-medium text-slate-400">
              © 2026 Lumina Global Inc. All rights reserved.
            </p>
            <p className="text-[11px] text-slate-500">
              GSMA Certified SM-DP+ Profile Infrastructure. PCI-DSS Level 1 Encrypted Checkout.
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-3 text-[11px]">
            <button
              onClick={() => onOpenModal('terms')}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {lang === 'en' ? 'Terms' : '服务条款'}
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenModal('privacy')}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {lang === 'en' ? 'Privacy' : '隐私条款'}
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenModal('refund')}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {lang === 'en' ? 'Refund SLA' : '退款政策'}
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenModal('contact')}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {lang === 'en' ? 'Contact Us' : '联系我们'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
