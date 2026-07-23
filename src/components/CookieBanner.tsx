import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, Check, X, Lock } from 'lucide-react';

interface CookieBannerProps {
  onNavigatePrivacy: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onNavigatePrivacy }) => {
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('lumina_cookie_accepted');
    if (!saved) {
      setAccepted(false);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('lumina_cookie_accepted', 'true');
    setAccepted(true);
  };

  const handleCustomEssential = () => {
    localStorage.setItem('lumina_cookie_accepted', 'essential');
    setAccepted(true);
  };

  if (accepted) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 bg-white/95 dark:bg-stone-900/95 border border-stone-300 dark:border-stone-700 p-4 rounded-2xl shadow-2xl backdrop-blur-md animate-slide-up text-stone-800 dark:text-stone-200">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0 font-bold">
          <Cookie className="w-5 h-5" />
        </div>
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <span>Cookie 与数据隐私许可声明</span>
            </h4>
            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">
              GDPR / AdSense
            </span>
          </div>
          <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
            我们及第三方合作伙伴（如 Google AdSense）使用 Cookie 优化浏览体验、进行流量统计并投放个性化广告。
            详情请参见我们的{' '}
            <button
              onClick={onNavigatePrivacy}
              className="text-emerald-600 dark:text-emerald-400 font-bold underline"
            >
              《隐私政策与 DART Cookie 声明》
            </button>。
          </p>
        </div>
      </div>

      <div className="mt-3.5 pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-2 text-xs">
        <button
          onClick={handleCustomEssential}
          className="px-3 py-1.5 font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
        >
          仅必要 Cookie
        </button>
        <button
          onClick={handleAcceptAll}
          className="px-4 py-1.5 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-1"
        >
          <Check className="w-3.5 h-3.5" />
          <span>接受全部 Cookie</span>
        </button>
      </div>
    </div>
  );
};
