import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, Eye, Plus, Check, Trash2, ArrowRight, X, Info } from 'lucide-react';
import { CreditCard, US_CREDIT_CARDS } from '../data/cards';
import { Language } from '../types';

interface CardListProps {
  compareList: CreditCard[];
  onToggleCompare: (card: CreditCard) => void;
  onClearCompare: () => void;
  onGoToCompare: () => void;
  lang: Language;
}

export const CardList: React.FC<CardListProps> = ({
  compareList,
  onToggleCompare,
  onClearCompare,
  onGoToCompare,
  lang,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBank, setSelectedBank] = useState<string>('All');
  const [selectedReward, setSelectedReward] = useState<string>('All');
  const [feeFilter, setFeeFilter] = useState<'All' | 'Free' | 'Paid'>('All');
  const [selectedCardDetail, setSelectedCardDetail] = useState<CreditCard | null>(null);

  const banks = ['All', 'Chase', 'American Express', 'Capital One', 'Citi', 'Discover'];
  const rewardTypes = ['All', 'Points', 'Cashback', 'Miles'];

  const filteredCards = useMemo(() => {
    return US_CREDIT_CARDS.filter((card) => {
      const matchesSearch =
        card.nameZh.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.perks.some((p) => p.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesBank = selectedBank === 'All' || card.bank === selectedBank;
      const matchesReward = selectedReward === 'All' || card.rewardType === selectedReward;

      const matchesFee =
        feeFilter === 'All' ||
        (feeFilter === 'Free' && card.annualFee === 0) ||
        (feeFilter === 'Paid' && card.annualFee > 0);

      return matchesSearch && matchesBank && matchesReward && matchesFee;
    });
  }, [searchTerm, selectedBank, selectedReward, feeFilter]);

  const isCompared = (cardId: string) => compareList.some((c) => c.id === cardId);

  return (
    <div className="space-y-6">
      {/* Search and Filters panel */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={
                lang === 'en'
                  ? 'Search by card name, bonus, perks (e.g. Lounge, Hyatt, 0% FTF, Dining)...'
                  : '搜索卡片名称、开卡奖励、特定福利（如：酒店、贵宾厅、返现）...'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-800"
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 px-1">
            <SlidersHorizontal className="h-4 w-4" />
            <span>{lang === 'en' ? 'Smart Filters' : '智能过滤面板'}</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
          {/* Bank Filters */}
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              {lang === 'en' ? 'Issuing Bank' : '发卡银行'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {banks.map((bank) => (
                <button
                  key={bank}
                  onClick={() => setSelectedBank(bank)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedBank === bank
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {bank === 'All' ? (lang === 'en' ? 'All Banks' : '全部银行') : bank}
                </button>
              ))}
            </div>
          </div>

          {/* Reward Type Filters */}
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              {lang === 'en' ? 'Reward Type' : '收益类别'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {rewardTypes.map((reward) => (
                <button
                  key={reward}
                  onClick={() => setSelectedReward(reward)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedReward === reward
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {reward === 'All'
                    ? (lang === 'en' ? 'All Rewards' : '全部收益')
                    : reward === 'Points'
                    ? (lang === 'en' ? 'Points (UR/MR)' : '积分体系')
                    : reward === 'Cashback'
                    ? (lang === 'en' ? 'Cash Back' : '现金返现')
                    : (lang === 'en' ? 'Airline Miles' : '航空里程')}
                </button>
              ))}
            </div>
          </div>

          {/* Annual Fee Filters */}
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              {lang === 'en' ? 'Annual Fee' : '年费偏好'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {([
                { id: 'All', labelEn: 'All Fees', labelZh: '全部年费' },
                { id: 'Free', labelEn: '$0 Annual Fee', labelZh: '免年费卡' },
                { id: 'Paid', labelEn: 'Premium Cards', labelZh: '有年费卡' },
              ] as const).map((fee) => (
                <button
                  key={fee.id}
                  onClick={() => setFeeFilter(fee.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    feeFilter === fee.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {lang === 'en' ? fee.labelEn : fee.labelZh}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid count summary */}
      <div className="flex justify-between items-center px-1">
        <p className="text-sm text-slate-500">
          {lang === 'en' ? (
            <>
              Showing <span className="font-semibold text-blue-600 font-mono">{filteredCards.length}</span> curated premier travel credit cards
            </>
          ) : (
            <>
              为您找到 <span className="font-semibold text-blue-600 font-mono">{filteredCards.length}</span> 张精选美国信用卡
            </>
          )}
        </p>
      </div>

      {/* Cards Grid */}
      {filteredCards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.4) }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300 flex flex-col overflow-hidden group"
              id={`card-item-${card.id}`}
            >
              {/* Card Header Illustration */}
              <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50/20 relative overflow-hidden flex justify-between items-start">
                <div className="relative z-10 space-y-1">
                  <span
                    className={`text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full ${
                      card.bank === 'Chase'
                        ? 'bg-blue-50 text-blue-700 border border-blue-100'
                        : card.bank === 'American Express'
                        ? 'bg-amber-50 text-amber-700 border border-amber-100'
                        : card.bank === 'Capital One'
                        ? 'bg-teal-50 text-teal-700 border border-teal-100'
                        : card.bank === 'Citi'
                        ? 'bg-red-50 text-red-700 border border-red-100'
                        : 'bg-orange-50 text-orange-700 border border-orange-100'
                    }`}
                  >
                    {card.bank}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug pt-1 group-hover:text-blue-600 transition-colors">
                    {lang === 'en' ? card.nameEn : card.nameZh.split(' ')[0]}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono truncate max-w-[200px]">
                    {lang === 'en' ? card.nameZh : card.nameEn}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className="text-3xl select-none filter drop-shadow">{card.imageUrl}</span>
                  <span className="text-[10px] font-mono font-semibold text-slate-400">
                    {card.annualFee === 0
                      ? (lang === 'en' ? '$0 Annual Fee' : '免年费')
                      : (lang === 'en' ? `$${card.annualFee} / yr` : `年费 $${card.annualFee}`)}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                {/* Signup Bonus Highlight */}
                <div className="bg-blue-50/30 border border-blue-100/30 rounded-xl p-3.5 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-blue-600 tracking-wider uppercase">
                      {lang === 'en' ? 'Welcome Offer Value' : '限时/常规开卡奖励'}
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                      {lang === 'en' ? `Est. $${card.signupBonusValue}` : `估值 $${card.signupBonusValue}`}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-700 leading-normal line-clamp-2">
                    {card.signupBonus}
                  </p>
                </div>

                {/* Key Perks snippet */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">
                    {lang === 'en' ? 'Key Travel Perks' : '核心权益亮点'}
                  </span>
                  <ul className="space-y-1.5">
                    {card.perks.slice(0, 3).map((perk, i) => (
                      <li key={i} className="flex items-start text-[11px] text-slate-600 leading-relaxed">
                        <span className="text-blue-500 mr-1.5 flex-shrink-0 font-bold select-none">•</span>
                        <span className="line-clamp-1">{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => setSelectedCardDetail(card)}
                    className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 hover:border-slate-200 text-xs font-semibold text-slate-700 transition-all duration-200 cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>{lang === 'en' ? 'Details' : '详细权益'}</span>
                  </button>

                  <button
                    onClick={() => onToggleCompare(card)}
                    className={`flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      isCompared(card.id)
                        ? 'bg-blue-50 border-blue-200 text-blue-600 font-bold'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50/10'
                    }`}
                  >
                    {isCompared(card.id) ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-blue-600" />
                        <span>{lang === 'en' ? 'Added' : '已加入'}</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-3.5 w-3.5" />
                        <span>{lang === 'en' ? 'Compare' : '对比'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <p className="text-slate-400 text-sm mb-2">
            {lang === 'en' ? 'No cards match your current search and filter settings.' : '未找到符合您搜索和筛选条件的信用卡。'}
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedBank('All');
              setSelectedReward('All');
              setFeeFilter('All');
            }}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
          >
            {lang === 'en' ? 'Reset all filters' : '重置所有筛选器'}
          </button>
        </div>
      )}

      {/* Floating Compare Drawer Trigger */}
      <AnimatePresence>
        {compareList.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white rounded-2xl shadow-xl px-6 py-4 flex items-center justify-between gap-6 z-40 border border-slate-800 w-[95%] max-w-xl"
            id="compare-tray"
          >
            <div className="flex items-center space-x-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold font-mono">
                {compareList.length}
              </span>
              <div>
                <p className="text-xs font-semibold">
                  {lang === 'en' ? 'Selected Cards for Comparison' : '已选卡片对比'}
                </p>
                <div className="flex gap-1.5 mt-0.5">
                  {compareList.map((c) => (
                    <span key={c.id} className="text-xs bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700/50">
                      {c.imageUrl} {lang === 'en' ? c.nameEn.split(' ')[0] : c.nameZh.split(' ')[0]}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onClearCompare}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title={lang === 'en' ? 'Clear comparison list' : '清空已选择卡片'}
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                onClick={onGoToCompare}
                className="flex items-center space-x-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20 active:scale-95 cursor-pointer"
              >
                <span>{lang === 'en' ? 'Compare Now' : '立即对比'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Details Modal Dialog */}
      <AnimatePresence>
        {selectedCardDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCardDetail(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200 z-10 flex flex-col"
              id={`modal-detail-${selectedCardDetail.id}`}
            >
              <button
                onClick={() => setSelectedCardDetail(null)}
                className="absolute right-4 top-4 p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors z-20 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Modal header */}
              <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-50 to-blue-50/20 border-b border-slate-100 flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-sm font-bold font-display text-blue-600">
                      {selectedCardDetail.bank}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                    <span className="text-xs font-mono font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
                      {lang === 'en' ? 'Credit Score: ' : '信用要求：'}
                      {selectedCardDetail.creditRequired === 'Excellent'
                        ? (lang === 'en' ? 'Excellent (720+)' : '极佳(720+)')
                        : selectedCardDetail.creditRequired === 'Good'
                        ? (lang === 'en' ? 'Good (680+)' : '良好(680+)')
                        : (lang === 'en' ? 'Building' : '新手/积攒中')}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    {lang === 'en' ? selectedCardDetail.nameEn : selectedCardDetail.nameZh}
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">
                    {lang === 'en' ? selectedCardDetail.nameZh : selectedCardDetail.nameEn}
                  </p>
                </div>
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                  <span className="text-5xl">{selectedCardDetail.imageUrl}</span>
                  <div className="text-right">
                    <span className="block text-xs text-slate-400">{lang === 'en' ? 'Annual Fee' : '年度年费'}</span>
                    <span className="text-base font-bold font-mono text-slate-900">
                      {selectedCardDetail.annualFee === 0 ? (lang === 'en' ? '$0' : '无年费') : `$${selectedCardDetail.annualFee} / yr`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-6 flex-1 overflow-y-auto">
                {/* Earning Rates Multipliers */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <SlidersHorizontal className="h-3.5 w-3.5 text-blue-500" />
                    <span>{lang === 'en' ? 'Earning Multipliers' : '消费返现/积分比例 (Earning Multipliers)'}</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedCardDetail.earningRates.map((rate, i) => (
                      <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex items-center justify-between">
                        <div>
                          <span className="block text-xs font-bold text-slate-900">{rate.category}</span>
                          <span className="block text-[11px] text-slate-400 leading-normal mt-0.5">{rate.description}</span>
                        </div>
                        <span className="text-base font-extrabold font-mono text-blue-600 bg-blue-50/70 px-2.5 py-1 rounded-lg">
                          {rate.rate}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Benefits */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span>{lang === 'en' ? 'Key Exclusive Perks' : '核心独家特权与福利 (Key Perks)'}</span>
                  </h4>
                  <ul className="grid grid-cols-1 gap-2.5">
                    {selectedCardDetail.perks.map((perk, i) => (
                      <li key={i} className="flex items-start text-xs text-slate-600 leading-relaxed bg-emerald-50/20 border border-emerald-100/30 rounded-xl p-3">
                        <span className="text-emerald-500 font-extrabold mr-2 flex-shrink-0">✓</span>
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Fine Prints */}
                <div className="bg-slate-50 rounded-xl p-4 space-y-2 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Info className="h-3.5 w-3.5 text-slate-400" />
                    <span>{lang === 'en' ? 'Foreign Transaction & Point Terms' : '条款细节 & 信用规则'}</span>
                  </span>
                  <div className="grid grid-cols-2 gap-4 text-xs text-slate-600">
                    <div>
                      <span className="block text-[11px] text-slate-400">
                        {lang === 'en' ? 'Foreign Transaction Fee (FTF)' : '境外交易手续费 (FTF)'}
                      </span>
                      <span className={`font-semibold mt-0.5 block ${selectedCardDetail.foreignTransactionFee ? 'text-red-500' : 'text-emerald-600'}`}>
                        {selectedCardDetail.foreignTransactionFee
                          ? (lang === 'en' ? '3% Foreign Fee' : '有境外交易手续费 (3%)')
                          : (lang === 'en' ? 'No Foreign Transaction Fee (0%)' : '免境外交易手续费 (No FTF)')}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[11px] text-slate-400">
                        {lang === 'en' ? 'Reward Program' : '推荐攒点体系'}
                      </span>
                      <span className="font-semibold mt-0.5 block text-blue-600">
                        {selectedCardDetail.pointType === 'UR'
                          ? 'Chase Ultimate Rewards (UR)'
                          : selectedCardDetail.pointType === 'MR'
                          ? 'Amex Membership Rewards (MR)'
                          : selectedCardDetail.pointType === 'Capital One'
                          ? 'Capital One Miles'
                          : selectedCardDetail.pointType === 'TYP'
                          ? 'Citi ThankYou Points (TYP)'
                          : 'Cashback'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50 rounded-b-3xl">
                <button
                  onClick={() => {
                    onToggleCompare(selectedCardDetail);
                    setSelectedCardDetail(null);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isCompared(selectedCardDetail.id)
                      ? 'bg-blue-50 border border-blue-200 text-blue-600'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {isCompared(selectedCardDetail.id)
                    ? (lang === 'en' ? 'Remove from Compare' : '从对比中移除')
                    : (lang === 'en' ? 'Add to Compare' : '加入卡片对比')}
                </button>
                <a
                  href={selectedCardDetail.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/10 transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <span>{lang === 'en' ? 'Apply on Official Bank Site' : '前往官网查看 / 申请'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
