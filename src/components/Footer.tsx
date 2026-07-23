import React from 'react';
import { Mail, Globe, Lock, FileText, ShieldCheck } from 'lucide-react';
import { Category } from '../types';

interface FooterProps {
  categories: Category[];
  onNavigateHome: () => void;
  onSelectCategory: (id: string | null) => void;
  onNavigateCompliance: (pageId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  categories,
  onNavigateHome,
  onSelectCategory,
  onNavigateCompliance,
}) => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold text-base shadow">
                A
              </div>
              <span className="text-xl font-black text-white font-serif tracking-tight">
                Aevorynth<span className="text-emerald-400">.com</span>
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Aevorynth Media 是一家专注于人工智能、前沿硬件、数字财经与可持续生活方式的独立数字杂志出版机构。我们致力于通过深刻的行业洞察与实践导向的深度长文，帮助读者建立系统性认知。
            </p>
          </div>

          {/* Col 2: Mandatory Legal Pages */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-200 border-b border-stone-800 pb-2">
              法律规章与隐私声明
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateCompliance('privacy-policy')}
                  className="text-stone-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-emerald-500" />
                  <span>隐私政策声明 (Privacy Policy)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateCompliance('terms-of-service')}
                  className="text-stone-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-500" />
                  <span>服务条款 (Terms of Service)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateCompliance('about-us')}
                  className="text-stone-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-500" />
                  <span>关于我们与编辑团队 (About Us)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateCompliance('contact-us')}
                  className="text-stone-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-emerald-500" />
                  <span>联系我们 (Contact Us)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateCompliance('disclaimer')}
                  className="text-stone-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>免责与版权声明 (Disclaimer)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Content Categories */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-200 border-b border-stone-800 pb-2">
              核心内容频道
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    onNavigateHome();
                    onSelectCategory(null);
                  }}
                  className="text-stone-400 hover:text-stone-200 transition-colors"
                >
                  全部深度文章
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      onNavigateHome();
                      onSelectCategory(cat.id);
                    }}
                    className="text-stone-400 hover:text-stone-200 transition-colors"
                  >
                    {cat.nameCn}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & Site Info */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-200 border-b border-stone-800 pb-2">
              出版信息与联系方式
            </h3>
            <div className="text-xs text-stone-400 space-y-2 leading-relaxed">
              <p className="flex items-start gap-1.5">
                <Mail className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                <span>编辑部邮箱：contact@aevorynth.com</span>
              </p>
              <p className="flex items-start gap-1.5">
                <Globe className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                <span>官方网站：aevorynth.com</span>
              </p>
              <div className="pt-2 text-[11px] text-stone-500 border-t border-stone-800">
                本站所有文章均遵循高标准原创流程与严格事实核查，旨在为全球中文读者提供有价值的数字出版内容。
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-stone-800 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <div>
            © {new Date().getFullYear()} Aevorynth Media. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-xs">
            <button onClick={() => onNavigateCompliance('privacy-policy')} className="hover:text-stone-300">
              隐私政策
            </button>
            <span className="text-stone-700">•</span>
            <button onClick={() => onNavigateCompliance('terms-of-service')} className="hover:text-stone-300">
              服务条款
            </button>
            <span className="text-stone-700">•</span>
            <button onClick={() => onNavigateCompliance('about-us')} className="hover:text-stone-300">
              关于我们
            </button>
            <span className="text-stone-700">•</span>
            <button onClick={() => onNavigateCompliance('contact-us')} className="hover:text-stone-300">
              联系我们
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
