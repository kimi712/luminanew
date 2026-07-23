import React, { useState } from 'react';
import { X, Copy, Check, Sliders, Code2, Eye, EyeOff, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';
import { AdSenseConfig } from '../types';

interface AdSenseConfigModalProps {
  config: AdSenseConfig;
  onUpdateConfig: (newConfig: AdSenseConfig) => void;
  onClose: () => void;
}

export const AdSenseConfigModal: React.FC<AdSenseConfigModalProps> = ({
  config,
  onUpdateConfig,
  onClose,
}) => {
  const [formData, setFormData] = useState<AdSenseConfig>(config);
  const [copiedScript, setCopiedScript] = useState(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'snippets'>('settings');

  const headScriptSnippet = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${
    formData.publisherId || 'ca-pub-1234567890123456'
  }" crossorigin="anonymous"></script>`;

  const handleSave = () => {
    onUpdateConfig(formData);
    onClose();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                Google AdSense 单元配置与预览
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                按谷歌规范管理您的 Publisher ID (`ca-pub-xxx`) 与广告显示模式
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-900/50 px-5 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'settings'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            ⚙️ 广告参数与展示模式
          </button>
          <button
            onClick={() => setActiveTab('snippets')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'snippets'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 inline mr-1" /> &lt;head&gt; 脚本集成代码
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-stone-800 dark:text-stone-200">
          {activeTab === 'settings' ? (
            <>
              {/* Display Mode Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  当前广告展示模式 (Ad Display Mode)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, displayMode: 'preview' })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      formData.displayMode === 'preview'
                        ? 'border-amber-500 bg-amber-50/80 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 ring-2 ring-amber-500/30'
                        : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <Eye className="w-4 h-4 text-amber-600" />
                      <span>模拟预览模式</span>
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                      显示虚线框与模拟广告位置，方便测试排版效果（强烈推荐）
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, displayMode: 'live' })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      formData.displayMode === 'live'
                        ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/30'
                        : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>正式运行模式</span>
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                      直接加载谷歌线上 AdSense JS 脚本（需过审后有实际广告）
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, displayMode: 'hidden' })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      formData.displayMode === 'hidden'
                        ? 'border-stone-500 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-200 ring-2 ring-stone-500/30'
                        : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <EyeOff className="w-4 h-4 text-stone-500" />
                      <span>暂时隐藏广告</span>
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                      隐藏所有页面广告容器，展示纯净阅读视图
                    </p>
                  </button>
                </div>
              </div>

              {/* Publisher ID Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center justify-between">
                  <span>Google AdSense 发布商 ID (Publisher ID)</span>
                  <span className="text-[10px] text-stone-400 font-normal">格式：ca-pub-XXXXXXXXXXXXXXXX</span>
                </label>
                <input
                  type="text"
                  value={formData.publisherId}
                  onChange={(e) => setFormData({ ...formData, publisherId: e.target.value })}
                  placeholder="ca-pub-1234567890123456"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 font-mono text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {/* Auto Ads Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700">
                <div>
                  <div className="text-xs font-bold text-stone-800 dark:text-stone-200">
                    开启自动广告 (Auto Ads)
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400">
                    允许 Google 机器学习算法自动优化页面插播式与防沉浸广告
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.autoAdsEnabled}
                  onChange={(e) => setFormData({ ...formData, autoAdsEnabled: e.target.checked })}
                  className="w-5 h-5 rounded text-amber-600 focus:ring-amber-500 border-stone-300 cursor-pointer"
                />
              </div>

              {/* Individual Slot IDs */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  各位置 AdSense 广告单元 Slot ID 自定义
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-stone-600 dark:text-stone-400 mb-1 font-medium">页头横幅 Slot ID (728x90)</label>
                    <input
                      type="text"
                      value={formData.slots.headerBanner}
                      onChange={(e) => setFormData({
                        ...formData,
                        slots: { ...formData.slots, headerBanner: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 dark:text-stone-400 mb-1 font-medium">文章内流 Slot ID (Native In-Article)</label>
                    <input
                      type="text"
                      value={formData.slots.inArticle}
                      onChange={(e) => setFormData({
                        ...formData,
                        slots: { ...formData.slots, inArticle: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 dark:text-stone-400 mb-1 font-medium">侧边栏 Slot ID (300x250/300x600)</label>
                    <input
                      type="text"
                      value={formData.slots.sidebar}
                      onChange={(e) => setFormData({
                        ...formData,
                        slots: { ...formData.slots, sidebar: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 dark:text-stone-400 mb-1 font-medium">底部横幅 Slot ID (Below Article)</label>
                    <input
                      type="text"
                      value={formData.slots.bottomBanner}
                      onChange={(e) => setFormData({
                        ...formData,
                        slots: { ...formData.slots, bottomBanner: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 font-mono"
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                <span className="font-bold">Google AdSense 审核要求：</span> 提交审查前，请务必将下方 JS 脚本代码复制并放置在网站主页的 <code className="bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded font-mono">&lt;head&gt;</code> 标签中。如果您将网站直接托管至 GitHub Pages，可以在 <code className="bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded font-mono">index.html</code> 中直接插入该代码。
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300">
                  <span>AdSense 自动广告全局脚本 (`head` 专用)</span>
                  <button
                    onClick={() => copyToClipboard(headScriptSnippet)}
                    className="flex items-center gap-1 text-amber-600 hover:text-amber-700 font-semibold text-xs"
                  >
                    {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedScript ? '已复制！' : '一键复制脚本'}</span>
                  </button>
                </div>
                <pre className="p-3.5 bg-stone-900 text-stone-200 rounded-xl font-mono text-xs overflow-x-auto border border-stone-800">
                  {headScriptSnippet}
                </pre>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  `ads.txt` 校验说明（Google AdSense 必须规范）：
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  为了防止未经授权的广告展示，通过审核后需要在网站根目录下放置 <code className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono">ads.txt</code> 文件，内容格式如下：
                </p>
                <pre className="p-3 bg-stone-900 text-emerald-400 rounded-xl font-mono text-xs border border-stone-800">
                  google.com, {formData.publisherId || 'ca-pub-1234567890123456'}, DIRECT, f08c47fec0942fa0
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 flex items-center justify-between">
          <a
            href="https://www.google.com/adsense/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-300 flex items-center gap-1"
          >
            <span>前往 Google AdSense 控制台</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-xl transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm"
            >
              保存配置并刷新
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
