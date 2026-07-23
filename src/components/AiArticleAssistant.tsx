import React, { useState } from 'react';
import { 
  X, Sparkles, Send, Copy, Check, FileText, AlertCircle, RefreshCw 
} from 'lucide-react';

interface AiArticleAssistantProps {
  onClose: () => void;
}

export const AiArticleAssistant: React.FC<AiArticleAssistantProps> = ({ onClose }) => {
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('前沿科技与人工智能');
  const [generatedArticle, setGeneratedArticle] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `你是一位专业且遵循 Google AdSense 合作伙伴政策的高级科技与媒体专栏作家。
请围绕主题：“${topic}”，编写一篇符合 Google AdSense 高质量原创内容规范（High Value Content）的深度专栏文章。

要求：
1. 语言：中文；
2. 文章字数：1200字以上；
3. 分分类：${category}；
4. 结构：包含吸引人的标题（Markdown # 格式）、引言摘要、至少 3-4 个二级标题（## 格式）、数据/案例分析、深度观点与总结；
5. 拒绝无意义的营销空话与“AI Slop”，确保有实质性的信息密度与独到见解，可直接用于提交谷歌 AdSense 审阅。`,
        }),
      });

      if (!response.ok) {
        throw new Error('服务器响应异常');
      }

      const data = await response.json();
      if (data.text) {
        setGeneratedArticle(data.text);
      } else {
        throw new Error('未能获得有效的文章生成数据');
      }
    } catch (err: any) {
      console.error('Error generating AI content:', err);
      setError('AI 极速生成遇到一些小问题，请稍后重试或检查 API 密匙配置。');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedArticle);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                AI AdSense 原创内容生成与质量助手
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                基于 Gemini 3.6 Flash 生成符合谷歌审核标准的高深度千字长文
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-stone-800 dark:text-stone-200 text-xs">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="block text-stone-700 dark:text-stone-300 font-bold">文章主题与核心关切点：</label>
                <input
                  type="text"
                  required
                  placeholder="例如：2026年家庭智能光伏与储能系统的投资回报率全解析..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-stone-700 dark:text-stone-300 font-bold">所属分类：</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="前沿科技与人工智能">前沿科技与人工智能</option>
                  <option value="绿色可持续与环保">绿色可持续与环保</option>
                  <option value="智能生活与空间美学">智能生活与空间美学</option>
                  <option value="数字财经与资产配置">数字财经与资产配置</option>
                  <option value="现代工作流与自我成长">现代工作流与自我成长</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Gemini 3.6 正在构思深度架构（约需5-10秒）...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>生成 AdSense 规范级千字文章</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {generatedArticle && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <span>生成结果草稿预览 (Generated Content)</span>
                </h3>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-bold hover:underline"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? '已复制 Markdown' : '复制全文 Markdown'}</span>
                </button>
              </div>

              <div className="p-4 bg-stone-900 text-stone-100 rounded-xl font-mono text-xs overflow-y-auto max-h-64 border border-stone-800 leading-relaxed whitespace-pre-wrap">
                {generatedArticle}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-stone-800 hover:bg-stone-700 rounded-xl transition-colors shadow-sm"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
};
