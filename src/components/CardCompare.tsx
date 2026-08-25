import React from 'react';
import { Trash2, AlertCircle, Plus, ExternalLink } from 'lucide-react';
import { CreditCard } from '../data/cards';
import { Language } from '../types';

interface CardCompareProps {
  compareList: CreditCard[];
  onRemoveCard: (card: CreditCard) => void;
  onClearAll: () => void;
  onGoToLibrary: () => void;
  lang: Language;
}

export const CardCompare: React.FC<CardCompareProps> = ({
  compareList,
  onRemoveCard,
  onClearAll,
  onGoToLibrary,
  lang,
}) => {
  if (compareList.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm max-w-2xl mx-auto space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-blue-50/70 flex items-center justify-center text-blue-600">
          <AlertCircle className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900 font-display">
            {lang === 'en' ? 'Comparison Tray is Empty' : '对比箱目前空空如也'}
          </h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
            {lang === 'en'
              ? 'Select 2 to 3 credit cards from the Travel Cards list to compare side-by-side on perks, multipliers, bonus values and foreign fees.'
              : '请回到“全部卡片”列表，选择 2 至 3 张信用卡，将它们加入对比箱，即可在这里进行全方位的侧边横向参数大 PK！'}
          </p>
        </div>
        <button
          onClick={onGoToLibrary}
          className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/10 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>{lang === 'en' ? 'Pick Cards to Compare' : '立即去挑几张卡'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Compare Header Controls */}
      <div className="flex justify-between items-center bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-display">
            {lang === 'en' ? 'Side-by-Side Card Comparison' : '横向参数对比 PK'}
          </h2>
          <p className="text-xs text-slate-400">
            {lang === 'en'
              ? `Currently comparing ${compareList.length} cards`
              : `目前选择了 ${compareList.length} 张卡片进行细致参数对比`}
          </p>
        </div>
        <div className="flex gap-2">
          {compareList.length < 3 && (
            <button
              onClick={onGoToLibrary}
              className="px-3.5 py-2 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/20 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-600 transition-all cursor-pointer"
            >
              {lang === 'en' ? `Add More Cards (${compareList.length}/3)` : `继续添加卡片 (${compareList.length}/3)`}
            </button>
          )}
          <button
            onClick={onClearAll}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 hover:text-red-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>{lang === 'en' ? 'Clear All' : '清空全部'}</span>
          </button>
        </div>
      </div>

      {/* Side by side comparison table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[650px] border-collapse">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="w-[180px] p-6 text-left text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                {lang === 'en' ? 'Feature / Metric' : '对比项目'}
              </th>
              {compareList.map((card) => (
                <th key={card.id} className="p-6 text-left relative group">
                  <button
                    onClick={() => onRemoveCard(card)}
                    className="absolute top-4 right-4 p-1 rounded-md text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    title={lang === 'en' ? 'Remove card' : '移除该卡片'}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <div className="space-y-2">
                    <span className="text-3xl select-none filter drop-shadow block">{card.imageUrl}</span>
                    <h3 className="text-sm font-bold text-slate-900">{lang === 'en' ? card.nameEn : card.nameZh.split(' ')[0]}</h3>
                    <p className="text-[10px] text-slate-400 font-mono leading-normal truncate">{lang === 'en' ? card.nameZh : card.nameEn}</p>
                    <span className="inline-block text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">
                      {card.bank}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* Annual Fee Row */}
            <tr>
              <td className="p-6 font-bold text-xs text-slate-500 bg-slate-50/30">
                {lang === 'en' ? 'Annual Fee' : '年度年费 (Annual Fee)'}
              </td>
              {compareList.map((card) => (
                <td key={card.id} className="p-6">
                  <span className={`text-sm font-bold font-mono ${card.annualFee === 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {card.annualFee === 0 ? (lang === 'en' ? '$0' : '免年费') : `$${card.annualFee} / yr`}
                  </span>
                </td>
              ))}
            </tr>

            {/* Reward Type & Point Type */}
            <tr>
              <td className="p-6 font-bold text-xs text-slate-500 bg-slate-50/30">
                {lang === 'en' ? 'Point Currency' : '积分/返现体系'}
              </td>
              {compareList.map((card) => (
                <td key={card.id} className="p-6">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-800">
                      {card.rewardType === 'Points'
                        ? (lang === 'en' ? 'Points' : '积分体系')
                        : card.rewardType === 'Cashback'
                        ? (lang === 'en' ? 'Cash Back' : '现金返现')
                        : (lang === 'en' ? 'Miles' : '航空里程')}
                    </span>
                    <span className="block text-[10px] text-blue-600 font-mono bg-blue-50/70 w-max px-1.5 py-0.5 rounded">
                      {card.pointType || 'Cash'}
                    </span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Signup Bonus */}
            <tr>
              <td className="p-6 font-bold text-xs text-slate-500 bg-slate-50/30">
                {lang === 'en' ? 'Welcome Offer Value' : '开卡福利及估值'}
              </td>
              {compareList.map((card) => (
                <td key={card.id} className="p-6">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-700 leading-relaxed">{card.signupBonus}</p>
                    <div className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg border border-emerald-100">
                      <span className="text-[10px] font-bold">{lang === 'en' ? 'Estimated Value:' : '新手开卡估值:'}</span>
                      <span className="text-xs font-bold font-mono">${card.signupBonusValue}</span>
                    </div>
                  </div>
                </td>
              ))}
            </tr>

            {/* Foreign Transaction Fee (FTF) */}
            <tr>
              <td className="p-6 font-bold text-xs text-slate-500 bg-slate-50/30">
                {lang === 'en' ? 'Foreign Fee (FTF)' : '境外交易手续费 (FTF)'}
              </td>
              {compareList.map((card) => (
                <td key={card.id} className="p-6">
                  <span className={`text-xs font-bold ${card.foreignTransactionFee ? 'text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg' : 'text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg'}`}>
                    {card.foreignTransactionFee ? (lang === 'en' ? '3% FTF Fee' : '有 (3%)') : (lang === 'en' ? 'No FTF (0%)' : '免境外交易手续费')}
                  </span>
                </td>
              ))}
            </tr>

            {/* Earning rates multipliers */}
            <tr>
              <td className="p-6 font-bold text-xs text-slate-500 bg-slate-50/30">
                {lang === 'en' ? 'Earning Multipliers' : '消费收益倍数对比'}
              </td>
              {compareList.map((card) => (
                <td key={card.id} className="p-6">
                  <div className="space-y-2">
                    {card.earningRates.map((rate, i) => (
                      <div key={i} className="flex justify-between items-center text-xs bg-slate-50/60 rounded-lg p-2 border border-slate-100">
                        <span className="text-slate-500">{rate.category}</span>
                        <span className="font-extrabold font-mono text-blue-600">{rate.rate}</span>
                      </div>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* Key Perks Detail */}
            <tr>
              <td className="p-6 font-bold text-xs text-slate-500 bg-slate-50/30">
                {lang === 'en' ? 'Exclusive Perks' : '核心高端权益与保险'}
              </td>
              {compareList.map((card) => (
                <td key={card.id} className="p-6">
                  <ul className="space-y-2">
                    {card.perks.map((perk, i) => (
                      <li key={i} className="flex items-start text-xs text-slate-600 leading-relaxed">
                        <span className="text-blue-500 font-extrabold mr-1.5 flex-shrink-0">•</span>
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            {/* Direct Link */}
            <tr>
              <td className="p-6 font-bold text-xs text-slate-500 bg-slate-50/30">
                {lang === 'en' ? 'Credit Score & Apply' : '信用等级与申请'}
              </td>
              {compareList.map((card) => (
                <td key={card.id} className="p-6">
                  <div className="space-y-3">
                    <div className="text-xs text-slate-500">
                      {lang === 'en' ? 'Score Needed: ' : '推荐信用等级：'}
                      <span className="font-semibold text-slate-800">
                        {card.creditRequired === 'Excellent'
                          ? (lang === 'en' ? 'Excellent (720+)' : '极佳信用 (720+)')
                          : card.creditRequired === 'Good'
                          ? (lang === 'en' ? 'Good (680+)' : '良好信用 (680+)')
                          : (lang === 'en' ? 'Building / Starter' : '新手积攒 (无信用)')}
                      </span>
                    </div>
                    <a
                      href={card.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/10 active:scale-95 w-full justify-center cursor-pointer"
                    >
                      <span>{lang === 'en' ? 'Apply on Official Bank Site' : '前往申请'}</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
