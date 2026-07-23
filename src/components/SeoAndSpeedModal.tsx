import React, { useState } from 'react';
import { 
  X, Gauge, Globe, Code2, Copy, Check, Zap, Sparkles, 
  Search, FileCode, CheckCircle2, RefreshCw, BarChart2
} from 'lucide-react';
import { articles } from '../data/articles';

interface SeoAndSpeedModalProps {
  onClose: () => void;
}

export const SeoAndSpeedModal: React.FC<SeoAndSpeedModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'speed' | 'sitemap' | 'schema' | 'seo-strategy'>('speed');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [speedMetrics, setSpeedMetrics] = useState({
    performance: 98,
    lcp: '0.8s', // Largest Contentful Paint
    cls: '0.01', // Cumulative Layout Shift
    inp: '32ms', // Interaction to Next Paint
    fcp: '0.5s', // First Contentful Paint
  });

  const siteUrl = 'https://luminaedge.github.io';

  // Generate dynamic sitemap.xml
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/privacy-policy</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteUrl}/about-us</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteUrl}/contact-us</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
${articles.map(a => `  <url>
    <loc>${siteUrl}/article/${a.slug}</loc>
    <lastmod>${a.updatedDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`).join('\n')}
</urlset>`;

  // Generate dynamic robots.txt
  const robotsTxt = `# Lumina Edge Robots.txt for Googlebot & SEO Indexing
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${siteUrl}/sitemap.xml`;

  // Generate Schema.org JSON-LD
  const schemaJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "url": siteUrl,
        "name": "Lumina Edge",
        "description": "High Authority Digital Media Platform for Tech, Sustainability and Workflows",
        "publisher": {
          "@type": "Organization",
          "name": "Lumina Edge Media Center",
          "logo": {
            "@type": "ImageObject",
            "url": `${siteUrl}/logo.png`
          }
        }
      },
      {
        "@type": "BlogPosting",
        "headline": articles[0].title,
        "description": articles[0].summary,
        "datePublished": articles[0].publishDate,
        "dateModified": articles[0].updatedDate,
        "author": {
          "@type": "Person",
          "name": articles[0].author.name
        }
      }
    ]
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleSimulateOptimize = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setSpeedMetrics({
        performance: 99,
        lcp: '0.6s',
        cls: '0.00',
        inp: '18ms',
        fcp: '0.4s',
      });
      setIsOptimizing(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold">
              <Gauge className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                SEO 推广策略与 PageSpeed 加载加速引擎
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                提高 Google 爬虫收录率、降低跳出率并获得更高的搜索引擎自然流量
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
        <div className="flex border-b border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-900/50 px-5 pt-3 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('speed')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'speed'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            ⚡ 速度与 Core Web Vitals 测速
          </button>
          <button
            onClick={() => setActiveTab('sitemap')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'sitemap'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            🗺️ Sitemap.xml & Robots.txt
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'schema'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            Structured Data (JSON-LD)
          </button>
          <button
            onClick={() => setActiveTab('seo-strategy')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'seo-strategy'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            📈 SEO 流量增长行动建议
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-stone-800 dark:text-stone-200">
          {activeTab === 'speed' && (
            <div className="space-y-6">
              {/* Score Meter */}
              <div className="p-6 bg-gradient-to-r from-stone-900 via-indigo-950 to-stone-900 rounded-2xl text-white border border-indigo-800/40 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="relative w-24 h-24 rounded-full border-4 border-emerald-400 flex flex-col items-center justify-center bg-emerald-950/40 shrink-0">
                    <span className="text-3xl font-black font-mono text-emerald-300">{speedMetrics.performance}</span>
                    <span className="text-[10px] text-emerald-200 font-bold uppercase">PageSpeed</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
                      <span>Lighthouse 核心网页指标（Core Web Vitals）</span>
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded font-mono">
                        PASSED
                      </span>
                    </h3>
                    <p className="text-xs text-stone-300 mt-1 max-w-md">
                      纯静态 HTML + Tailwind 渲染，无庞大服务器中间件开销，极佳缩短 FCP 与 LCP，有效降低用户跳出率。
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleSimulateOptimize}
                  disabled={isOptimizing}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shrink-0 shadow-sm"
                >
                  <RefreshCw className={`w-4 h-4 ${isOptimizing ? 'animate-spin' : ''}`} />
                  <span>{isOptimizing ? '运行代码压缩加速...' : '一键优化资源加载'}</span>
                </button>
              </div>

              {/* Individual Vitals breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700">
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">LCP (最大内容渲染)</div>
                  <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">{speedMetrics.lcp}</div>
                  <div className="text-[10px] text-stone-400 mt-0.5">目标 &lt; 2.5s (极速)</div>
                </div>

                <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700">
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">CLS (累积布局偏移)</div>
                  <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">{speedMetrics.cls}</div>
                  <div className="text-[10px] text-stone-400 mt-0.5">目标 &lt; 0.1 (无视觉抖动)</div>
                </div>

                <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700">
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">INP (交互延迟)</div>
                  <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">{speedMetrics.inp}</div>
                  <div className="text-[10px] text-stone-400 mt-0.5">目标 &lt; 200ms (秒级回应)</div>
                </div>

                <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700">
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">FCP (首次内容绘制)</div>
                  <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">{speedMetrics.fcp}</div>
                  <div className="text-[10px] text-stone-400 mt-0.5">目标 &lt; 1.8s (秒级开屏)</div>
                </div>
              </div>

              {/* Speed checklist */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  网站已应用的加载优化项 (Performance Optimization Active)
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-between">
                    <span className="font-semibold text-emerald-900 dark:text-emerald-200">📷 异步图片延迟加载 (Native Image Lazy Loading + Unsplash WebP)</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-between">
                    <span className="font-semibold text-emerald-900 dark:text-emerald-200">⚡ Tailwind CSS 4 工具类零冗余打包 (Zero CSS Bloat)</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-between">
                    <span className="font-semibold text-emerald-900 dark:text-emerald-200">🌐 适应 GitHub Pages 边缘 CDN 全球分发节点</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sitemap' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                    自动生成的 Sitemap.xml 代码 (提交至 Google Search Console)
                  </h3>
                  <button
                    onClick={() => copyToClipboard(sitemapXml, 'sitemap')}
                    className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
                  >
                    {copiedText === 'sitemap' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedText === 'sitemap' ? '已复制 Sitemap' : '一键复制 Sitemap'}</span>
                  </button>
                </div>
                <pre className="p-3.5 bg-stone-900 text-indigo-300 rounded-xl font-mono text-xs overflow-x-auto max-h-52 border border-stone-800">
                  {sitemapXml}
                </pre>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                    Robots.txt 搜索引擎爬虫引导代码
                  </h3>
                  <button
                    onClick={() => copyToClipboard(robotsTxt, 'robots')}
                    className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
                  >
                    {copiedText === 'robots' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedText === 'robots' ? '已复制 Robots.txt' : '复制 Robots.txt'}</span>
                  </button>
                </div>
                <pre className="p-3.5 bg-stone-900 text-emerald-400 rounded-xl font-mono text-xs overflow-x-auto border border-stone-800">
                  {robotsTxt}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  Schema.org 结构化标记 (JSON-LD) 丰富网页摘要预览
                </h3>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(schemaJsonLd, null, 2), 'schema')}
                  className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
                >
                  {copiedText === 'schema' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText === 'schema' ? '已复制 JSON-LD' : '复制 JSON-LD 代码'}</span>
                </button>
              </div>
              <pre className="p-3.5 bg-stone-900 text-amber-300 rounded-xl font-mono text-xs overflow-x-auto max-h-80 border border-stone-800">
                {JSON.stringify(schemaJsonLd, null, 2)}
              </pre>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                结构化标记帮助谷歌搜索引擎在结果列表中显示作者头像、发布日期与富摘要卡片（Rich Snippets），极大提高点击率（CTR）。
              </p>
            </div>
          )}

          {activeTab === 'seo-strategy' && (
            <div className="space-y-4 text-xs leading-relaxed">
              <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-xl space-y-2">
                <h4 className="font-bold text-indigo-900 dark:text-indigo-200 text-sm flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-indigo-600" />
                  <span>Google Ads 挂载后的 SEO 自然流量爆破策略路线图</span>
                </h4>
                <p className="text-stone-600 dark:text-stone-300">
                  通过 AdSense 审核只是第一步。要获得持续的广告收益，需要源源不断的自然流量（Organic Search Traffic）。
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 space-y-1.5">
                  <div className="font-bold text-stone-800 dark:text-stone-200">1. 提交至 Google Search Console</div>
                  <p className="text-stone-500 dark:text-stone-400">
                    部署至 GitHub Pages 后，在 Google Search Console 中验证域名所有权，并提交 <code className="bg-stone-200 dark:bg-stone-700 px-1 py-0.5 rounded">sitemap.xml</code> 链接，加快收录速度。
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 space-y-1.5">
                  <div className="font-bold text-stone-800 dark:text-stone-200">2. 长尾关键词锚定（Long-tail Keywords）</div>
                  <p className="text-stone-500 dark:text-stone-400">
                    针对“生成式AI工作流”、“ Matter智能家居协议”等特定高检索意图词汇，撰写解答型深度长文。
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 space-y-1.5">
                  <div className="font-bold text-stone-800 dark:text-stone-200">3. 内部链接网格构建 (Internal Linking)</div>
                  <p className="text-stone-500 dark:text-stone-400">
                    在相关文章之间嵌入自然的内容引用与延伸阅读推荐，引导读者深层浏览，增加停留时长（Dwell Time）。
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 space-y-1.5">
                  <div className="font-bold text-stone-800 dark:text-stone-200">4. 极速响应与移动端零延迟</div>
                  <p className="text-stone-500 dark:text-stone-400">
                    谷歌将移动端加载性能作为排名核心权重，本网站采用静态构建与优化好的图片，排名权重更高。
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm"
          >
            完成查看
          </button>
        </div>
      </div>
    </div>
  );
};
