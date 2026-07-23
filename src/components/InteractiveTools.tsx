import React, { useState } from 'react';
import { 
  BarChart2, Calculator, Sparkles, CheckCircle2, 
  HelpCircle, DollarSign, TrendingUp, Sliders, FileText
} from 'lucide-react';

export const InteractiveTools: React.FC = () => {
  // Calculator State
  const [monthlyPv, setMonthlyPv] = useState<number>(50000); // 50k page views
  const [rpm, setRpm] = useState<number>(8.5); // $8.50 per 1000 views
  const [ctr, setCtr] = useState<number>(2.2); // 2.2% click through rate

  // Calculate estimated monthly revenue
  const monthlyRevenue = Math.round((monthlyPv / 1000) * rpm);
  const yearlyRevenue = monthlyRevenue * 12;

  // Text Auditor State
  const [draftText, setDraftText] = useState<string>('');
  const [auditResult, setAuditResult] = useState<{
    wordCount: number;
    paragraphCount: number;
    estimatedReadTime: number;
    valueScore: number;
    feedbackCn: string;
  } | null>(null);

  const handleAuditDraft = () => {
    if (!draftText.trim()) return;

    const words = draftText.trim().length;
    const paragraphs = draftText.split(/\n\s*\n/).filter(Boolean).length;
    const readTime = Math.ceil(words / 400);

    let score = 60;
    if (words > 1000) score += 25;
    else if (words > 500) score += 15;

    if (paragraphs >= 4) score += 15;

    let feedback = '';
    if (score >= 90) {
      feedback = '极佳！文章篇幅充足、结构分明，完全符合 Google AdSense 高价值原创内容审核标准！';
    } else if (score >= 75) {
      feedback = '良好。建议增加更多的实际案例、观点总结或二级标题，进一步提升内容深度。';
    } else {
      feedback = '建议扩充内容。字数较少（低于500字）容易被 AdSense 判为“缺乏实用价值（Low Value Content）”，建议补充细节至1000字以上。';
    }

    setAuditResult({
      wordCount: words,
      paragraphCount: paragraphs,
      estimatedReadTime: readTime,
      valueScore: Math.min(100, score),
      feedbackCn: feedback,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Tool Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Creator & Reader Tools
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 font-serif">
          媒体运营与创作者实用工具集
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
          提供网站流量收益估算与文章内容质量自动评估，协助创作者提升文章结构与读者阅读体验。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tool 1: AdSense Revenue Estimator */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-stone-200 dark:border-stone-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Google AdSense 预估广告收益计算器
              </h2>
              <p className="text-xs text-stone-500">
                输入您的预期月页面浏览量 (PV) 与行业平均 RPM 即可计算潜在广告收益
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Slider 1: Monthly PV */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-stone-700 dark:text-stone-300">月度页面浏览量 (Monthly PV):</span>
                <span className="text-emerald-600 font-mono text-sm">{monthlyPv.toLocaleString()} PV</span>
              </div>
              <input
                type="range"
                min="1000"
                max="500000"
                step="5000"
                value={monthlyPv}
                onChange={(e) => setMonthlyPv(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Slider 2: RPM */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-stone-700 dark:text-stone-300">千次展示预估千次收益 (RPM $):</span>
                <span className="text-emerald-600 font-mono text-sm">${rpm.toFixed(2)} USD</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="35.0"
                step="0.5"
                value={rpm}
                onChange={(e) => setRpm(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Revenue Output Display */}
            <div className="p-5 bg-gradient-to-br from-stone-900 to-stone-800 text-white rounded-2xl border border-stone-700 shadow-md space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-stone-800/80 rounded-xl border border-stone-700">
                  <div className="text-[11px] text-stone-400 font-medium">预估月度广告收益</div>
                  <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
                    ${monthlyRevenue} <span className="text-xs font-normal">USD</span>
                  </div>
                  <div className="text-[10px] text-stone-400 mt-1">≈ ￥{(monthlyRevenue * 7.2).toFixed(0)} RMB</div>
                </div>

                <div className="p-3 bg-stone-800/80 rounded-xl border border-stone-700">
                  <div className="text-[11px] text-stone-400 font-medium">预估年度累计收益</div>
                  <div className="text-2xl font-black text-amber-400 font-mono mt-1">
                    ${yearlyRevenue} <span className="text-xs font-normal">USD</span>
                  </div>
                  <div className="text-[10px] text-stone-400 mt-1">≈ ￥{(yearlyRevenue * 7.2).toFixed(0)} RMB</div>
                </div>
              </div>

              <p className="text-[11px] text-stone-400 leading-relaxed text-center">
                * 实际收益受地理位置（美欧地区 RPM 通常处于 $10-$30 范围）、广告客户竞价及访客停留时间等因素共同决定。
              </p>
            </div>
          </div>
        </div>

        {/* Tool 2: Article Readability & AdSense Value Auditor */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-stone-200 dark:border-stone-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                文章可读性与 AdSense 审核价值评估器
              </h2>
              <p className="text-xs text-stone-500">
                粘贴您的自定义草稿文本，快速检测字数与篇幅结构是否达到 AdSense 过审门槛
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <textarea
              rows={5}
              placeholder="请在此粘贴您的文章草稿内容进行评估..."
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />

            <button
              onClick={handleAuditDraft}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>立即分析文本质量</span>
            </button>

            {auditResult && (
              <div className="p-4 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/80 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-900 dark:text-purple-200">
                    评估结果分值:
                  </span>
                  <span className="text-lg font-black text-purple-600 dark:text-purple-300 font-mono">
                    {auditResult.valueScore} / 100
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 bg-white dark:bg-stone-900 rounded-lg border border-purple-200/60 dark:border-purple-800/60">
                    <div className="text-[10px] text-stone-400">字符总数</div>
                    <div className="font-bold text-stone-800 dark:text-stone-200 font-mono">{auditResult.wordCount} 字</div>
                  </div>
                  <div className="p-2 bg-white dark:bg-stone-900 rounded-lg border border-purple-200/60 dark:border-purple-800/60">
                    <div className="text-[10px] text-stone-400">段落数量</div>
                    <div className="font-bold text-stone-800 dark:text-stone-200 font-mono">{auditResult.paragraphCount} 段</div>
                  </div>
                  <div className="p-2 bg-white dark:bg-stone-900 rounded-lg border border-purple-200/60 dark:border-purple-800/60">
                    <div className="text-[10px] text-stone-400">预估阅读时间</div>
                    <div className="font-bold text-stone-800 dark:text-stone-200 font-mono">{auditResult.estimatedReadTime} 分钟</div>
                  </div>
                </div>

                <p className="text-xs text-purple-950 dark:text-purple-200 leading-relaxed font-medium pt-1">
                  💡 {auditResult.feedbackCn}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
