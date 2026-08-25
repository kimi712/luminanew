import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Coins, Calculator, Info } from 'lucide-react';
import { CreditCard, US_CREDIT_CARDS } from '../data/cards';
import { Language } from '../types';

interface RewardsCalculatorProps {
  lang: Language;
}

export const RewardsCalculator: React.FC<RewardsCalculatorProps> = ({ lang }) => {
  // Monthly spending state
  const [dining, setDining] = useState<number>(400);
  const [groceries, setGroceries] = useState<number>(300);
  const [travel, setTravel] = useState<number>(200);
  const [gas, setGas] = useState<number>(100);
  const [other, setOther] = useState<number>(500);

  // Points valuation state (in cents per point)
  const [urVal, setUrVal] = useState<number>(1.6);
  const [mrVal, setMrVal] = useState<number>(1.6);
  const [c1Val, setC1Val] = useState<number>(1.4);
  const [typVal, setTypVal] = useState<number>(1.4);
  const [cashVal] = useState<number>(1.0);

  const totalMonthlySpend = dining + groceries + travel + gas + other;
  const totalYearlySpend = totalMonthlySpend * 12;

  const calculateYearlyNetValue = (card: CreditCard): {
    grossValue: number;
    pointsEarned: number;
    netValue: number;
    breakdown: Record<string, number>;
  } => {
    let yearlyPoints = 0;
    const breakdown: Record<string, number> = { dining: 0, groceries: 0, travel: 0, gas: 0, other: 0 };

    const valuation =
      card.pointType === 'UR'
        ? urVal
        : card.pointType === 'MR'
        ? mrVal
        : card.pointType === 'Capital One'
        ? c1Val
        : card.pointType === 'TYP'
        ? typVal
        : cashVal;

    const toVal = (pts: number) => (pts * valuation) / 100;

    switch (card.id) {
      case 'chase-sapphire-preferred':
        breakdown.dining = dining * 3 * 12;
        breakdown.travel = travel * 2.5 * 12;
        breakdown.groceries = groceries * 1 * 12;
        breakdown.gas = gas * 1 * 12;
        breakdown.other = other * 1 * 12;
        break;

      case 'chase-sapphire-reserve':
        breakdown.dining = dining * 3 * 12;
        breakdown.travel = travel * 4.5 * 12;
        breakdown.groceries = groceries * 1 * 12;
        breakdown.gas = gas * 1 * 12;
        breakdown.other = other * 1 * 12;
        break;

      case 'chase-freedom-flex':
        breakdown.dining = dining * 3 * 12;
        breakdown.groceries = groceries * 2.5 * 12;
        breakdown.travel = travel * 1 * 12;
        breakdown.gas = gas * 2.5 * 12;
        breakdown.other = other * 1 * 12;
        break;

      case 'chase-freedom-unlimited':
        breakdown.dining = dining * 3 * 12;
        breakdown.travel = travel * 2 * 12;
        breakdown.groceries = groceries * 1.5 * 12;
        breakdown.gas = gas * 1.5 * 12;
        breakdown.other = other * 1.5 * 12;
        break;

      case 'amex-gold': {
        const yearlyDining = dining * 12;
        const yearlyGroceries = groceries * 12;
        breakdown.dining = yearlyDining <= 50000 ? yearlyDining * 4 : 50000 * 4 + (yearlyDining - 50000) * 1;
        breakdown.groceries = yearlyGroceries <= 25000 ? yearlyGroceries * 4 : 25000 * 4 + (yearlyGroceries - 25000) * 1;
        breakdown.travel = travel * 3 * 12;
        breakdown.gas = gas * 1 * 12;
        breakdown.other = other * 1 * 12;
        break;
      }

      case 'amex-platinum':
        breakdown.dining = dining * 1 * 12;
        breakdown.travel = travel * 5 * 12;
        breakdown.groceries = groceries * 1 * 12;
        breakdown.gas = gas * 1 * 12;
        breakdown.other = other * 1 * 12;
        break;

      case 'amex-blue-cash-everyday': {
        const yearlyGroceries = groceries * 12;
        const yearlyGas = gas * 12;
        const cashGroceries = yearlyGroceries <= 6000 ? yearlyGroceries * 0.03 : 6000 * 0.03 + (yearlyGroceries - 6000) * 0.01;
        const cashGas = yearlyGas <= 6000 ? yearlyGas * 0.03 : 6000 * 0.03 + (yearlyGas - 6000) * 0.01;
        const cashDining = dining * 12 * 0.01;
        const cashOther = other * 12 * 0.015;
        const cashTravel = travel * 12 * 0.01;

        breakdown.groceries = cashGroceries * 100;
        breakdown.gas = cashGas * 100;
        breakdown.dining = cashDining * 100;
        breakdown.other = cashOther * 100;
        breakdown.travel = cashTravel * 100;
        break;
      }

      case 'capital-one-venture-x':
        breakdown.dining = dining * 2 * 12;
        breakdown.travel = travel * 5 * 12;
        breakdown.groceries = groceries * 2 * 12;
        breakdown.gas = gas * 2 * 12;
        breakdown.other = other * 2 * 12;
        break;

      case 'capital-one-savor-one':
        breakdown.dining = dining * 0.03 * 12 * 100;
        breakdown.groceries = groceries * 0.03 * 12 * 100;
        breakdown.other = other * 0.01 * 12 * 100;
        breakdown.gas = gas * 0.01 * 12 * 100;
        breakdown.travel = travel * 0.01 * 12 * 100;
        break;

      case 'citi-custom-cash': {
        const categories = [
          { name: 'dining', val: dining },
          { name: 'groceries', val: groceries },
          { name: 'travel', val: travel },
          { name: 'gas', val: gas },
        ];
        categories.sort((a, b) => b.val - a.val);
        const highestCat = categories[0];
        const bonusCategorySpend = highestCat.val;
        const bonusPoints = (bonusCategorySpend <= 500 ? bonusCategorySpend * 5 : 500 * 5 + (bonusCategorySpend - 500) * 1) * 12;

        let nonBonusPoints = 0;
        categories.slice(1).forEach((c) => {
          nonBonusPoints += c.val * 1 * 12;
        });
        nonBonusPoints += other * 1 * 12;

        breakdown[highestCat.name] = bonusPoints;
        categories.slice(1).forEach((c) => {
          breakdown[c.name] = c.val * 1 * 12;
        });
        breakdown.other = other * 1 * 12;
        break;
      }

      case 'citi-double-cash':
        breakdown.dining = dining * 2 * 12;
        breakdown.groceries = groceries * 2 * 12;
        breakdown.travel = travel * 2 * 12;
        breakdown.gas = gas * 2 * 12;
        breakdown.other = other * 2 * 12;
        break;

      case 'discover-it':
        breakdown.dining = dining * 2.2 * 12;
        breakdown.groceries = groceries * 2.2 * 12;
        breakdown.gas = gas * 2.2 * 12;
        breakdown.travel = travel * 1 * 12;
        breakdown.other = other * 1 * 12;
        break;

      default:
        breakdown.dining = dining * 1 * 12;
        breakdown.groceries = groceries * 1 * 12;
        breakdown.other = other * 1 * 12;
    }

    yearlyPoints = breakdown.dining + breakdown.groceries + breakdown.travel + breakdown.gas + breakdown.other;
    const grossValue = toVal(yearlyPoints);

    let creditOffset = 0;
    if (card.id === 'chase-sapphire-reserve') creditOffset = 300;
    else if (card.id === 'chase-sapphire-preferred') creditOffset = 50;
    else if (card.id === 'amex-gold') creditOffset = 200;
    else if (card.id === 'amex-platinum') creditOffset = 350;
    else if (card.id === 'capital-one-venture-x') creditOffset = 400;

    const netValue = grossValue + creditOffset - card.annualFee;

    return {
      grossValue,
      pointsEarned: yearlyPoints,
      netValue,
      breakdown,
    };
  };

  const rankedCards = useMemo(() => {
    return US_CREDIT_CARDS.map((card) => {
      const { grossValue, pointsEarned, netValue, breakdown } = calculateYearlyNetValue(card);
      return {
        card,
        grossValue,
        pointsEarned,
        netValue,
        breakdown,
      };
    }).sort((a, b) => b.netValue - a.netValue);
  }, [dining, groceries, travel, gas, other, urVal, mrVal, c1Val, typVal, cashVal]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Sliders Panel */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
            <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-display">
                {lang === 'en' ? 'Monthly Spend Breakdown' : '配置您的月度消费'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {lang === 'en' ? 'Adjust your budget to discover optimal returns' : '调整消费以计算最优信用卡收益'}
              </p>
            </div>
          </div>

          {/* Dining Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-600">
                {lang === 'en' ? '🍕 Dining & Takeout' : '🍕 餐饮/外卖/送餐 (Dining)'}
              </span>
              <span className="font-mono font-bold text-blue-600">${dining}/mo</span>
            </div>
            <input
              type="range"
              min="0"
              max="2000"
              step="50"
              value={dining}
              onChange={(e) => setDining(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Groceries Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-600">
                {lang === 'en' ? '🛒 Supermarkets & Groceries' : '🛒 超市买菜 (Groceries)'}
              </span>
              <span className="font-mono font-bold text-blue-600">${groceries}/mo</span>
            </div>
            <input
              type="range"
              min="0"
              max="2000"
              step="50"
              value={groceries}
              onChange={(e) => setGroceries(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Travel Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-600">
                {lang === 'en' ? '✈️ Flights, Hotels & Rideshare' : '✈️ 机票/酒店/打车 (Travel)'}
              </span>
              <span className="font-mono font-bold text-blue-600">${travel}/mo</span>
            </div>
            <input
              type="range"
              min="0"
              max="3000"
              step="50"
              value={travel}
              onChange={(e) => setTravel(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Gas Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-600">
                {lang === 'en' ? '⛽ Gas & EV Charging' : '⛽ 加油出行 (Gas)'}
              </span>
              <span className="font-mono font-bold text-blue-600">${gas}/mo</span>
            </div>
            <input
              type="range"
              min="0"
              max="1000"
              step="20"
              value={gas}
              onChange={(e) => setGas(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Others Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-600">
                {lang === 'en' ? '🛍️ Everyday Catch-All Retail' : '🛍️ 其他日常无脑刷 (Others)'}
              </span>
              <span className="font-mono font-bold text-blue-600">${other}/mo</span>
            </div>
            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={other}
              onChange={(e) => setOther(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Total Budget Indicators */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>{lang === 'en' ? 'Monthly Spend:' : '月度总预算:'}</span>
              <span className="font-bold text-slate-900 font-mono">${totalMonthlySpend}</span>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-1.5 font-semibold">
              <span>{lang === 'en' ? 'Annual Spend:' : '年度总支出:'}</span>
              <span className="font-bold text-blue-600 font-mono">${totalYearlySpend}</span>
            </div>
          </div>
        </div>

        {/* Valuation Configuration Panel */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
            <div className="h-9 w-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Coins className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-display">
                {lang === 'en' ? 'Point Valuations (CPP)' : '配置各大点数估值'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {lang === 'en' ? 'Estimated redemption value (cents per point)' : '调整各体系积分实际使用价值 (cents/pt)'}
              </p>
            </div>
          </div>

          {/* Chase UR Valuation */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-600">Chase UR</span>
              <span className="font-mono text-emerald-600 font-bold">{urVal} ¢</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="2.5"
              step="0.1"
              value={urVal}
              onChange={(e) => setUrVal(Number(e.target.value))}
              className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Amex MR Valuation */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-600">Amex MR</span>
              <span className="font-mono text-emerald-600 font-bold">{mrVal} ¢</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="2.5"
              step="0.1"
              value={mrVal}
              onChange={(e) => setMrVal(Number(e.target.value))}
              className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Capital One Miles */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-600">Capital One Miles</span>
              <span className="font-mono text-emerald-600 font-bold">{c1Val} ¢</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="2.2"
              step="0.1"
              value={c1Val}
              onChange={(e) => setC1Val(Number(e.target.value))}
              className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Citi TYP */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-600">Citi TYP</span>
              <span className="font-mono text-emerald-600 font-bold">{typVal} ¢</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="2.2"
              step="0.1"
              value={typVal}
              onChange={(e) => setTypVal(Number(e.target.value))}
              className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div className="bg-emerald-50/40 p-3 rounded-2xl text-[10px] text-emerald-800 leading-normal border border-emerald-100/50 flex items-start gap-2">
            <Info className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>
              {lang === 'en'
                ? '1.6 ¢ represents 10,000 points = $160 value when transferred to airline partners (e.g. United, ANA, Air France) or Hyatt hotels.'
                : '点数估值即 1 积分折合多少美分。1.6 ¢ 意指 10,000 积分价值约合 $160 美元。通过将积分转入常旅客计划换机票或凯悦 Hyatt 酒店，往往能轻松用出 1.6¢ ~ 2.0¢+ 的高价值！'}
            </span>
          </div>
        </div>
      </div>

      {/* Ranked Leaderboard */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                {lang === 'en' ? 'Net Annual Return Leaderboard' : '年度净收益卡片排行榜'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'en'
                  ? 'Ranked after deducting annual fees and applying easily accessible statement credits'
                  : '已扣除卡片年费并计入「极易获取的刚性报销」后的真实净回血排序'}
              </p>
            </div>
          </div>

          {/* Leaderboard list */}
          <div className="space-y-4">
            {rankedCards.map((item, index) => {
              const { card, grossValue, pointsEarned, netValue } = item;
              const isPositive = netValue > 0;

              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: Math.min(index * 0.05, 0.4) }}
                  className="bg-slate-50/50 border border-slate-100 hover:border-blue-100 hover:bg-blue-50/5 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all"
                >
                  {/* Left Side: Rank, Emoji, Card Name */}
                  <div className="flex items-center space-x-3.5">
                    <span
                      className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                        index === 0
                          ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-200'
                          : index === 1
                          ? 'bg-slate-100 text-slate-800'
                          : index === 2
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      #{index + 1}
                    </span>
                    <span className="text-3xl filter drop-shadow select-none">{card.imageUrl}</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 font-mono tracking-wider">{card.bank}</h4>
                      <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                        {lang === 'en' ? card.nameEn : card.nameZh.split(' ')[0]}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-mono hidden sm:block truncate max-w-[220px]">
                        {lang === 'en' ? card.nameZh : card.nameEn}
                      </p>
                    </div>
                  </div>

                  {/* Right Side */}
                  <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-left md:text-right text-xs space-y-0.5">
                      <div className="flex items-center md:justify-end gap-1 text-slate-500">
                        <span>{lang === 'en' ? 'Gross Rewards:' : '刷卡所得:'}</span>
                        <span className="font-semibold text-slate-800 font-mono">${grossValue.toFixed(0)}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ({Math.round(pointsEarned).toLocaleString()} {lang === 'en' ? 'pts' : '点'})
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {lang === 'en' ? 'Fee: ' : '年费: '}
                        <span className="font-mono text-slate-500">${card.annualFee}</span>
                        {card.id === 'chase-sapphire-reserve' && (
                          <span className="text-emerald-600"> {lang === 'en' ? '(+$300 travel credit)' : '(含 $300 旅行报销)'}</span>
                        )}
                        {card.id === 'capital-one-venture-x' && (
                          <span className="text-emerald-600"> {lang === 'en' ? '(+$400 travel + bonus credit)' : '(含 $400 周年+旅行报销)'}</span>
                        )}
                        {card.id === 'amex-gold' && (
                          <span className="text-emerald-600"> {lang === 'en' ? '(+$200 dining/uber credit)' : '(含 $200 刚性餐饮报销)'}</span>
                        )}
                      </div>
                    </div>

                    {/* Net annual return pill */}
                    <div
                      className={`px-4 py-2 rounded-xl text-center min-w-[120px] ${
                        isPositive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-rose-50 text-rose-700 border border-rose-100'
                      }`}
                    >
                      <span className="block text-[9px] uppercase tracking-wider font-bold">
                        {lang === 'en' ? 'Net Return' : '年度净得/亏'}
                      </span>
                      <span className="text-sm font-extrabold font-mono">
                        {isPositive ? '+' : ''}${netValue.toFixed(0)} / {lang === 'en' ? 'yr' : '年'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
