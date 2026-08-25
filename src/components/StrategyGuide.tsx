import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Compass, ShieldAlert, CheckCircle, Info, BookOpen, AlertTriangle } from 'lucide-react';
import { US_CREDIT_RULES, APPLICANT_ROADMAPS } from '../data/rules';
import { US_CREDIT_CARDS } from '../data/cards';
import { Language } from '../types';

interface StrategyGuideProps {
  lang: Language;
}

export const StrategyGuide: React.FC<StrategyGuideProps> = ({ lang }) => {
  const [cardsOpened, setCardsOpened] = useState<number>(2);
  const [activeRoadmap, setActiveRoadmap] = useState<'beginner' | 'traveler'>('beginner');
  const [expandedRule, setExpandedRule] = useState<string | null>('chase-524');

  const selectedRoadmap = APPLICANT_ROADMAPS[activeRoadmap];

  return (
    <div className="space-y-8">
      {/* Interactive 5/24 Tracker */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center space-x-2.5">
            <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Compass className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              {lang === 'en' ? 'Chase 5/24 Rule Evaluator' : 'Chase 5/24 智能检测器'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            {lang === 'en'
              ? 'Chase will auto-decline applicants who have opened 5 or more personal credit cards across all banks in the past 24 months. Select your count below:'
              : '美国信用卡届最著名的“铁律”。请滑动或点选您在过去 24 个月内，在全球各大银行开通的所有个人信用卡总数：'}
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-600">
                {lang === 'en' ? 'Cards Opened (Past 24 Mo):' : '近 24 个月开卡总数:'}
              </span>
              <span className="text-base font-mono font-extrabold text-blue-600">
                {cardsOpened} {lang === 'en' ? 'Cards' : '张'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={cardsOpened}
              onChange={(e) => setCardsOpened(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>0 ({lang === 'en' ? 'Clean Slate' : '白纸一张'})</span>
              <span>5 ({lang === 'en' ? 'Hard Limit' : '临界关卡'})</span>
              <span>10+ ({lang === 'en' ? 'Pro Churner' : '卡神本神'})</span>
            </div>
          </div>
        </div>

        {/* 5/24 Evaluation Results */}
        <div className="lg:col-span-2 flex flex-col justify-center">
          {cardsOpened < 5 ? (
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center space-x-3 text-emerald-700">
                <CheckCircle className="h-6 w-6 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold">
                    {lang === 'en'
                      ? `Eligible Status: ${cardsOpened}/24 (Under Limit)`
                      : `您当前状态良好：${cardsOpened}/24 (未超限)`}
                  </h4>
                  <p className="text-[11px] text-emerald-600 mt-0.5">
                    {lang === 'en'
                      ? 'You are eligible to apply for top-tier Chase cards like Sapphire & Freedom!'
                      : '您当前仍有资格申请 Chase 系列高价值信用卡！'}
                  </p>
                </div>
              </div>
              <div className="text-xs text-slate-600 leading-relaxed space-y-2">
                <p>
                  {lang === 'en' ? (
                    <>
                      You have <span className="font-bold text-emerald-600 font-mono">{5 - cardsOpened}</span> card slots remaining before hitting the 5/24 limit. Chase Ultimate Rewards points are amongst the most valuable travel currencies.
                    </>
                  ) : (
                    <>
                      您离 Chase 的上限还差 <span className="font-bold text-emerald-600 font-mono">{5 - cardsOpened}</span> 张卡片。
                      Chase 的点数系统 (Ultimate Rewards) 极为优质，建议优先锁定。
                    </>
                  )}
                </p>
                <div className="flex items-start gap-1.5 text-[11px] text-slate-500 bg-white/60 p-2.5 rounded-xl">
                  <Info className="h-3.5 w-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>{lang === 'en' ? 'Strategy Tip: ' : '专家建议：'}</strong>
                    {lang === 'en'
                      ? 'Apply for essential Chase cards first before opening Amex, Capital One, or store cards to preserve your valuable 5/24 slots.'
                      : '强烈建议在此阶段优先申请 Chase 旗下的卡（如 Sapphire Preferred, Freedom 系列），避免消耗宝贵的名额。'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center space-x-3 text-rose-800">
                <ShieldAlert className="h-6 w-6 flex-shrink-0 text-rose-600" />
                <div>
                  <h4 className="text-sm font-bold">
                    {lang === 'en'
                      ? `Over Limit: ${cardsOpened}/24 (Chase 5/24 Active)`
                      : `您已进入 5/24 小黑屋：${cardsOpened}/24 (已超限)`}
                  </h4>
                  <p className="text-[11px] text-rose-600 mt-0.5">
                    {lang === 'en'
                      ? 'Automated approval system will decline any personal Chase card applications.'
                      : '此时递交任何 Chase 信用卡申请，系统都将予以自动拒绝。'}
                  </p>
                </div>
              </div>
              <div className="text-xs text-slate-600 leading-relaxed space-y-2">
                <p>
                  {lang === 'en'
                    ? 'Wait until earlier cards cross the 24-month mark, or apply for business cards that do not report on personal credit bureaus.'
                    : '必须暂停申请个人卡，等待最先申请的卡片满 24 个月并出狱，使计数降到 4/24 以下。'}
                </p>
                <div className="flex items-start gap-1.5 text-[11px] text-slate-500 bg-white/60 p-2.5 rounded-xl">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>{lang === 'en' ? 'Pro Tip: ' : '专家小绝招：'}</strong>
                    {lang === 'en'
                      ? 'Explore business cards (Amex Business Gold, Chase Ink) as most do not add to your personal 5/24 bureau count.'
                      : '重点考虑各大银行的商业信用卡 (Business Cards)，大多不会汇报到个人信用报告中。'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recommended Roadmaps Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-display">
              {lang === 'en' ? 'Credit Card Application Roadmaps' : '美卡实战申请路线图'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'en' ? 'Optimized sequential roadmaps for maximum points & approvals' : '信用分数与点数最大化的专业顺序规划'}
            </p>
          </div>
          <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
            <button
              onClick={() => setActiveRoadmap('beginner')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeRoadmap === 'beginner' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {lang === 'en' ? 'Starter Roadmap' : '新手小白入门路线'}
            </button>
            <button
              onClick={() => setActiveRoadmap('traveler')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeRoadmap === 'traveler' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {lang === 'en' ? 'Global Traveler Roadmap' : '高频商旅常旅客路线'}
            </button>
          </div>
        </div>

        {/* Roadmap Timeline */}
        <div className="relative border-l border-blue-100 ml-4 pl-6 space-y-8">
          {selectedRoadmap.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className="relative"
            >
              <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white ring-4 ring-blue-50">
                <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              </span>

              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase border border-blue-100/30">
                      {step.phase} • {step.duration}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 pt-1">
                      {step.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-xl">
                  <strong>{lang === 'en' ? 'Key Logic: ' : '核心逻辑：'}</strong> {step.reasoning}
                </p>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {lang === 'en' ? 'Recommended Target Cards' : '推荐攻克卡片'}
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {step.recommendedCards.map((cardId) => {
                      const fullCard = US_CREDIT_CARDS.find((c) => c.id === cardId);
                      if (!fullCard) return null;
                      return (
                        <div
                          key={cardId}
                          className="flex items-center space-x-2 bg-blue-50/50 border border-blue-100/30 px-3 py-1.5 rounded-xl text-xs text-blue-900 font-semibold"
                        >
                          <span>{fullCard.imageUrl}</span>
                          <span>{lang === 'en' ? fullCard.nameEn.split(' ')[0] : fullCard.nameZh.split(' ')[0]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {lang === 'en' ? 'Actionable Checklist' : '本阶段关键操作要点'}
                  </span>
                  <ul className="space-y-2">
                    {step.actionItems.map((item, i) => (
                      <li key={i} className="flex items-start text-xs text-slate-600">
                        <span className="text-blue-500 font-bold mr-2 mt-0.5">✦</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Rules dictionary Accordion */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center space-x-2.5">
          <BookOpen className="h-5 w-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-900 font-display">
            {lang === 'en' ? 'Bank Underwriting Rules Dictionary' : '美卡申卡铁律速查辞典'}
          </h3>
        </div>

        <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
          {US_CREDIT_RULES.map((rule) => {
            const isExpanded = expandedRule === rule.id;
            return (
              <div key={rule.id} className="bg-white transition-all">
                <button
                  onClick={() => setExpandedRule(isExpanded ? null : rule.id)}
                  className="w-full px-5 py-4 text-left flex justify-between items-center hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block font-mono">{rule.bank} {lang === 'en' ? 'Rule' : '规则'}</span>
                    <span className="text-sm font-bold text-slate-800">{rule.name}</span>
                  </div>
                  <span className="text-xs font-mono font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100/30">
                    {rule.summary}
                  </span>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 space-y-3 bg-slate-50/50 text-xs text-slate-600 border-t border-slate-100 leading-relaxed">
                    <p>{rule.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <span className="font-bold text-red-500 block mb-1">
                          {lang === 'en' ? 'Impact on Application:' : '对您申卡的影响：'}
                        </span>
                        {rule.impact}
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <span className="font-bold text-blue-600 block mb-1">
                          {lang === 'en' ? 'Expert Strategy Tip:' : '申卡专家建议：'}
                        </span>
                        {rule.tip}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
