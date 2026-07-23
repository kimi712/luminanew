import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { compliancePages } from '../data/compliancePages';
import { Lock, FileText, Globe, Mail, ShieldCheck, ArrowLeft, Send, Check } from 'lucide-react';

interface CompliancePageViewerProps {
  pageId: string;
  onBackHome: () => void;
  onNavigatePage: (pageId: string) => void;
}

export const CompliancePageViewer: React.FC<CompliancePageViewerProps> = ({
  pageId,
  onBackHome,
  onNavigatePage,
}) => {
  const page = compliancePages[pageId] || compliancePages['privacy-policy'];

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMsg.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setContactName('');
      setContactEmail('');
      setContactMsg('');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 py-8 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation bar for policy pages */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <button
            onClick={onBackHome}
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 bg-white dark:bg-stone-900 px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回首页</span>
          </button>

          <div className="flex flex-wrap items-center gap-1.5 text-xs bg-white dark:bg-stone-900 p-1.5 rounded-xl border border-stone-200 dark:border-stone-800">
            <button
              onClick={() => onNavigatePage('privacy-policy')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                pageId === 'privacy-policy'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              隐私政策
            </button>
            <button
              onClick={() => onNavigatePage('terms-of-service')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                pageId === 'terms-of-service'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              服务条款
            </button>
            <button
              onClick={() => onNavigatePage('about-us')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                pageId === 'about-us'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              关于本站
            </button>
            <button
              onClick={() => onNavigatePage('contact-us')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                pageId === 'contact-us'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              联系我们
            </button>
            <button
              onClick={() => onNavigatePage('disclaimer')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                pageId === 'disclaimer'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              免责声明
            </button>
          </div>
        </div>

        {/* Main Document Card */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
          <div className="border-b border-stone-200 dark:border-stone-800 pb-6 space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider font-mono">
                Google AdSense Mandatory
              </span>
              <span className="text-stone-400 text-xs">•</span>
              <span className="text-xs text-stone-500 font-mono">
                最近修改日期: {page.lastUpdated}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 font-serif">
              {page.titleCn}
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              {page.summaryCn}
            </p>
          </div>

          <div className="markdown-body prose dark:prose-invert max-w-none text-stone-800 dark:text-stone-200 text-sm sm:text-base leading-relaxed font-sans space-y-4">
            <Markdown>{page.contentMarkdown}</Markdown>
          </div>

          {/* Interactive Form for Contact Us page */}
          {pageId === 'contact-us' && (
            <div className="mt-8 pt-8 border-t border-stone-200 dark:border-stone-800 space-y-4 bg-stone-50 dark:bg-stone-800/40 p-6 rounded-xl">
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-600" />
                <span>在线发送反馈 / 咨询留言</span>
              </h3>

              <form onSubmit={handleSubmitContact} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="您的姓名 *"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="p-3 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <input
                    type="email"
                    required
                    placeholder="您的联系邮箱 *"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="p-3 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <textarea
                  rows={4}
                  required
                  placeholder="请输入您的反馈、合作意向或技术建议..."
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  className="w-full p-3 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />

                <div className="flex items-center justify-between">
                  {submitted ? (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <Check className="w-4 h-4" /> 感谢您的留言，我们将在24小时内由专人回复！
                    </span>
                  ) : (
                    <span className="text-[11px] text-stone-400">信息受《隐私政策》加密保护</span>
                  )}
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-colors shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>确认发送</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
