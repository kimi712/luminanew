import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Brain, Loader2, ArrowRight, Key, RefreshCw, AlertCircle } from 'lucide-react';
import Markdown from 'react-markdown';
import { Language } from '../types';

interface AiConsultantProps {
  lang: Language;
}

export const AiConsultant: React.FC<AiConsultantProps> = ({ lang }) => {
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [checkingStatus, setCheckingStatus] = useState<boolean>(true);

  // Form State
  const [creditScore, setCreditScore] = useState<string>('Excellent');
  const [creditHistoryMonths, setCreditHistoryMonths] = useState<number>(12);
  const [travelPreference, setTravelPreference] = useState<string>('flight');
  const [hasAnnualFeePreference, setHasAnnualFeePreference] = useState<string>('any');
  const [carrierPreferences, setCarrierPreferences] = useState<string>('Chase UR, Amex MR, Hyatt');

  // Spend budgets
  const [dining, setDining] = useState<number>(400);
  const [groceries, setGroceries] = useState<number>(300);
  const [travel, setTravel] = useState<number>(200);
  const [gas, setGas] = useState<number>(100);
  const [other, setOther] = useState<number>(500);

  // Output recommendation State
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [report, setReport] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const checkStatus = async () => {
    try {
      setCheckingStatus(true);
      const res = await fetch('/api/status');
      const data = await res.json();
      setHasApiKey(data.hasApiKey);
    } catch (e) {
      console.error(e);
      setHasApiKey(false);
    } finally {
      setCheckingStatus(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  useEffect(() => {
    if (!loading) return;
    const quotes =
      lang === 'en'
        ? [
            'Analyzing monthly spend distribution...',
            'Evaluating hard underwriting rules (Chase 5/24, Amex popup)...',
            'Optimizing transfer partners (Hyatt, ANA, Air France, Singapore Airlines)...',
            'Calculating highest ROI welcome offer strategies...',
            'Compiling your tailored Global Travel & Finance Intelligence report...',
          ]
        : [
            '正在评估您的月度消费大盘...',
            '正在与 Chase 5/24 硬性秒拒规则进行严格比对...',
            '正在规避 Amex 家族语言限制，规划最佳先后申卡路线...',
            '正在调取最新的美卡开卡礼，估算积分最大化转点兑换价值...',
            '正在撰写专属于您的美卡申请指南报告...',
          ];
    let i = 0;
    setLoadingStep(quotes[0]);
    const interval = setInterval(() => {
      i = (i + 1) % quotes.length;
      setLoadingStep(quotes[i]);
    }, 2500);

    return () => clearInterval(interval);
  }, [loading, lang]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setReport(null);

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lang,
          creditScore,
          creditHistoryMonths,
          travelPreference,
          hasAnnualFeePreference,
          carrierPreferences,
          monthlySpending: {
            dining,
            groceries,
            travel,
            gas,
            other,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === 'API_KEY_MISSING') {
          setHasApiKey(false);
          throw new Error(data.message);
        } else {
          throw new Error(
            data.message || (lang === 'en' ? 'Failed to generate recommendations.' : '生成 AI 智能推荐失败，请稍后重试。')
          );
        }
      }

      setReport(data.recommendationMarkdown);
    } catch (err: any) {
      setErrorMsg(err.message || (lang === 'en' ? 'Network or server error. Please try again.' : '网络连接或服务器出错，请重试。'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {checkingStatus ? (
        <div className="flex items-center justify-center p-8 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <Loader2 className="h-6 w-6 text-blue-600 animate-spin mr-3" />
          <span className="text-xs text-slate-500 font-medium">
            {lang === 'en' ? 'Checking Gemini Advisor Engine status...' : '正在检索 AI 选卡助手状态...'}
          </span>
        </div>
      ) : hasApiKey === false ? (
        <div className="bg-amber-50/70 border border-amber-100 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
              <Key className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900 font-display">
                {lang === 'en' ? 'GEMINI_API_KEY Not Configured' : '未配置 GEMINI_API_KEY 密钥'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === 'en'
                  ? 'To unlock AI-driven personalized travel financial recommendations, please add your Gemini API Key in the Secrets settings.'
                  : '为了启用 AI 智能卡片推荐，该应用需要连接 Google Gemini AI 引擎。当前尚未在 Secrets 配置中填入密钥。'}
              </p>
            </div>
          </div>

          <div className="bg-white/80 p-4 rounded-2xl border border-amber-100/50 space-y-3 text-xs text-slate-700">
            <p className="font-semibold">{lang === 'en' ? 'How to enable AI Advisor:' : '如何快速启用 AI 智能助手：'}</p>
            <ol className="list-decimal pl-4 space-y-1.5">
              <li>{lang === 'en' ? 'Click Settings in AI Studio' : '点击 AI Studio 设置按钮'}</li>
              <li>{lang === 'en' ? 'Select Secrets tab' : '点击 Secrets (密钥) 面板'}</li>
              <li>{lang === 'en' ? 'Add GEMINI_API_KEY with your key' : '添加 GEMINI_API_KEY 密钥'}</li>
            </ol>
          </div>

          <div className="flex pt-2">
            <button
              onClick={checkStatus}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>{lang === 'en' ? 'Refresh Status' : '重新刷新检测'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm h-max">
            <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100 mb-5">
              <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-display">
                  {lang === 'en' ? 'Financial & Travel Profile' : '配置您的基本档案'}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {lang === 'en' ? 'Used for automated strategy optimization' : '我们将使用此档案进行最优化算法推理'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Credit score selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                  {lang === 'en' ? 'Credit Score Bracket' : '信用等级情况 (Credit Score)'}
                </label>
                <select
                  value={creditScore}
                  onChange={(e) => setCreditScore(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                >
                  <option value="Excellent">
                    {lang === 'en' ? 'Excellent (720+ Score - Premium Cards)' : '极佳信用 Excellent (720分以上，适合申高端卡)'}
                  </option>
                  <option value="Good">
                    {lang === 'en' ? 'Good (680-719 Score - Core Cards)' : '良好信用 Good (680 - 719分，适合主流卡)'}
                  </option>
                  <option value="Building">
                    {lang === 'en' ? 'Building / Starter (No US SSN or Credit History)' : '小白积攒期 Building (新手/无信用记录)'}
                  </option>
                </select>
              </div>

              {/* Credit History Months */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span className="uppercase tracking-wider">
                    {lang === 'en' ? 'Credit History Length' : '信用记录时长'}
                  </span>
                  <span className="font-mono text-blue-600">{creditHistoryMonths} {lang === 'en' ? 'Months' : '个月'}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="1"
                  value={creditHistoryMonths}
                  onChange={(e) => setCreditHistoryMonths(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Goal */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                  {lang === 'en' ? 'Primary Reward Focus' : '最渴望获取的福利 (Goals)'}
                </label>
                <select
                  value={travelPreference}
                  onChange={(e) => setTravelPreference(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                >
                  <option value="flight">
                    {lang === 'en' ? 'Airline Miles / Business & First Class Tickets' : '航空里程换头等/商务舱机票'}
                  </option>
                  <option value="hotel">
                    {lang === 'en' ? 'Luxury Hotel Free Nights & Upgrades (Hyatt, Marriott)' : '高档酒店奢华免房换房 (Hotel Redemptions)'}
                  </option>
                  <option value="cashback">
                    {lang === 'en' ? 'Straightforward Cash Back (0 Hassle)' : '简单无脑、直接拿现金返还 (Cashback)'}
                  </option>
                  <option value="lounge">
                    {lang === 'en' ? 'Airport Lounge Access & Travel Protection' : '机场高端贵宾室特权 (Lounge Access)'}
                  </option>
                </select>
              </div>

              {/* Annual fee attitude */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                  {lang === 'en' ? 'Annual Fee Tolerance' : '对信用卡年费的态度'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'any', labelEn: 'Any / ROI First', labelZh: '看收益不限' },
                    { id: 'no', labelEn: '$0 Fee Only', labelZh: '绝不给年费' },
                    { id: 'yes', labelEn: 'High Premium OK', labelZh: '可给高年费' },
                  ].map((fee) => (
                    <button
                      type="button"
                      key={fee.id}
                      onClick={() => setHasAnnualFeePreference(fee.id)}
                      className={`px-2 py-2 rounded-xl text-xs font-medium transition-all border cursor-pointer ${
                        hasAnnualFeePreference === fee.id
                          ? 'bg-blue-600 border-blue-600 text-white shadow-sm font-bold'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {lang === 'en' ? fee.labelEn : fee.labelZh}
                    </button>
                  ))}
                </div>
              </div>

              {/* Carrier Preferences */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                  {lang === 'en' ? 'Preferred Airlines / Hotels' : '偏爱航司或酒店 (如 Hyatt, ANA, Delta)'}
                </label>
                <input
                  type="text"
                  value={carrierPreferences}
                  onChange={(e) => setCarrierPreferences(e.target.value)}
                  placeholder={lang === 'en' ? 'e.g. Hyatt, United, ANA, Delta, Marriott' : '如：Hyatt酒店, ANA全日空, 达美航空'}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-blue-600/10 active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  <span>
                    {loading
                      ? (lang === 'en' ? 'AI Analyzing...' : 'AI 正在精密研判中...')
                      : (lang === 'en' ? 'Generate AI Travel & Card Strategy' : '生成 AI 智能美卡定制报告')}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Area: Report View */}
          <div className="lg:col-span-3 min-h-[450px] flex flex-col">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="flex-1 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center space-y-6"
                >
                  <div className="relative">
                    <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 animate-bounce">
                      <Brain className="h-8 w-8" />
                    </div>
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-slate-800 font-display">
                      {lang === 'en' ? 'Lumina AI Engine Processing' : '美卡大师正在为您问诊'}
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium font-mono animate-pulse">
                      {loadingStep}
                    </p>
                  </div>
                </motion.div>
              ) : errorMsg ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 bg-red-50/50 border border-red-100 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4"
                >
                  <div className="h-12 w-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900">
                      {lang === 'en' ? 'Generation Failed' : '推荐失败'}
                    </h4>
                    <p className="text-xs text-red-600 max-w-md leading-relaxed">{errorMsg}</p>
                  </div>
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-white hover:bg-gray-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                  >
                    {lang === 'en' ? 'Try Again' : '重新尝试生成'}
                  </button>
                </motion.div>
              ) : report ? (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex-1 bg-white rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-md shadow-blue-100/5 space-y-6"
                >
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <div className="flex items-center space-x-2.5">
                      <Sparkles className="h-5 w-5 text-blue-600" />
                      <h3 className="text-base font-bold text-slate-900 font-display">
                        {lang === 'en' ? 'Your Tailored Intelligence Report' : '您的专属智能推荐卡书'}
                      </h3>
                    </div>
                    <button
                      onClick={() => setReport(null)}
                      className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer"
                    >
                      <span>{lang === 'en' ? 'New Query' : '重新提问'}</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="markdown-body text-xs text-slate-700 leading-relaxed overflow-x-auto">
                    <Markdown>{report}</Markdown>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 bg-gradient-to-br from-blue-50/10 to-slate-50 border border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-6"
                >
                  <div className="h-16 w-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600 border border-slate-100">
                    <Sparkles className="h-8 w-8" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-slate-800 font-display">
                      {lang === 'en' ? 'Lumina AI Travel & Card Advisor' : '欢迎使用 AI 智能申卡智囊'}
                    </h4>
                    <p className="text-xs text-slate-400 max-w-md leading-relaxed mx-auto">
                      {lang === 'en'
                        ? 'Configure your background profile on the left to receive a bespoke credit roadmap and point redemption blueprint synthesized by Gemini.'
                        : '配置左侧的信用背景和月度消费大盘，Gemini 智能助手会为您量身绘制一份极具说服力的申卡路线白皮书！'}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};
