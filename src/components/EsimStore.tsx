import React, { useState, useMemo } from 'react';
import { ESIM_DESTINATIONS } from '../data/esimData';
import { EsimDestination, EsimPackage, EsimRegion, Currency, CURRENCIES, Language } from '../types';
import {
  Search,
  Globe2,
  Zap,
  Wifi,
  ShieldCheck,
  Smartphone,
  Calculator,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Flame,
  Clock,
  Layers,
  PlaneTakeoff,
  Sliders,
  Check
} from 'lucide-react';

interface EsimStoreProps {
  currency: Currency;
  lang: Language;
  onSelectPlan: (destination: EsimDestination, pkg: EsimPackage) => void;
  onOpenCompatibility: () => void;
}

export const EsimStore: React.FC<EsimStoreProps> = ({
  currency,
  lang,
  onSelectPlan,
  onOpenCompatibility,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRegion, setActiveRegion] = useState<EsimRegion>('all');
  const [selectedDestination, setSelectedDestination] = useState<EsimDestination | null>(
    ESIM_DESTINATIONS[0]
  );
  const [showCalculator, setShowCalculator] = useState(false);

  // Data Usage Calculator States
  const [calcDays, setCalcDays] = useState(7);
  const [calcMapsHours, setCalcMapsHours] = useState(2); // hrs/day
  const [calcSocialHours, setCalcSocialHours] = useState(1.5); // hrs/day
  const [calcVideoMins, setCalcVideoMins] = useState(30); // mins/day

  const currInfo = CURRENCIES[currency];

  const regionTabs = [
    { id: 'all', labelEn: 'All Destinations', labelZh: '全部目的地', icon: Globe2 },
    { id: 'popular', labelEn: 'Top Popular', labelZh: '热门精选', icon: Flame },
    { id: 'asia', labelEn: 'Asia', labelZh: '亚洲', icon: Sparkles },
    { id: 'europe', labelEn: 'Europe', labelZh: '欧洲', icon: Layers },
    { id: 'north-america', labelEn: 'North America', labelZh: '北美', icon: Zap },
    { id: 'global', labelEn: 'Global Pass (140+)', labelZh: '全球通用 (140+国)', icon: Globe2 },
  ];

  const filteredDestinations = useMemo(() => {
    return ESIM_DESTINATIONS.filter((item) => {
      // Region filter
      if (activeRegion === 'popular' && !item.isPopular) return false;
      if (activeRegion !== 'all' && activeRegion !== 'popular' && item.region !== activeRegion) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesEn = item.countryNameEn.toLowerCase().includes(q);
        const matchesZh = item.countryNameZh.toLowerCase().includes(q);
        const matchesCode = item.countryCode.toLowerCase().includes(q);
        const matchesCarriers = item.networkPartners.some((p) => p.toLowerCase().includes(q));
        return matchesEn || matchesZh || matchesCode || matchesCarriers;
      }
      return true;
    });
  }, [activeRegion, searchQuery]);

  // Calculate estimated GB
  const estimatedGB = useMemo(() => {
    // Maps ~ 60MB/hr, Social ~ 150MB/hr, Video ~ 500MB/hr (8.3MB/min)
    const dailyMB = calcMapsHours * 60 + calcSocialHours * 150 + calcVideoMins * 8.3;
    const totalMB = dailyMB * calcDays;
    return (totalMB / 1024).toFixed(1);
  }, [calcDays, calcMapsHours, calcSocialHours, calcVideoMins]);

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Tools Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Feature 1: Instant Activation */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              {lang === 'en' ? 'Instant Delivery' : '即时扫码交付'}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'en' ? 'Receive QR code in 5 seconds via email' : '付款后 5 秒极速出码，邮件同步直发'}
            </p>
          </div>
        </div>

        {/* Feature 2: Compatibility Checker Button */}
        <button
          onClick={onOpenCompatibility}
          className="bg-white hover:bg-slate-50 rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between text-left transition-all cursor-pointer group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <Smartphone className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                {lang === 'en' ? 'Device Checker' : '机型兼容性检测'}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {lang === 'en' ? 'Check iPhone, Galaxy & Pixel compatibility' : '自查 iPhone, 三星, 谷歌 Pixel 支持'}
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
        </button>

        {/* Feature 3: Data Usage Estimator */}
        <button
          onClick={() => setShowCalculator(!showCalculator)}
          className={`rounded-2xl p-5 border shadow-sm flex items-center justify-between text-left transition-all cursor-pointer group ${
            showCalculator
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900'
          }`}
        >
          <div className="flex items-center space-x-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${
                showCalculator ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'
              }`}
            >
              <Calculator className="h-6 w-6" />
            </div>
            <div>
              <h4
                className={`text-xs font-bold uppercase tracking-wider font-mono ${
                  showCalculator ? 'text-white' : 'text-slate-900'
                }`}
              >
                {lang === 'en' ? 'Data Calculator' : '流量测算计算器'}
              </h4>
              <p className={`text-xs mt-0.5 ${showCalculator ? 'text-blue-100' : 'text-slate-500'}`}>
                {lang === 'en' ? 'Estimate how many GBs you need' : '根据出行天数和使用习惯估算所需流量'}
              </p>
            </div>
          </div>
          <Sliders className={`h-5 w-5 ${showCalculator ? 'text-white' : 'text-slate-300'}`} />
        </button>
      </div>

      {/* Expandable Data Usage Calculator Drawer */}
      {showCalculator && (
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-950 space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center pb-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-200">
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold font-display">
                  {lang === 'en' ? 'Interactive Trip Data Usage Estimator' : '智能出行数据流量测算'}
                </h3>
                <p className="text-xs text-blue-200">
                  {lang === 'en' ? 'Adjust sliders to estimate your trip data requirements' : '拖动滑块自定义您的日常网络需求'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCalculator(false)}
              className="text-xs text-blue-200 hover:text-white underline cursor-pointer"
            >
              {lang === 'en' ? 'Close' : '收起'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Trip Duration */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-blue-200">{lang === 'en' ? 'Trip Duration' : '旅行天数'}</span>
                <span className="font-mono text-white">{calcDays} {lang === 'en' ? 'Days' : '天'}</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                value={calcDays}
                onChange={(e) => setCalcDays(Number(e.target.value))}
                className="w-full h-1.5 bg-blue-950 rounded-lg appearance-none cursor-pointer accent-blue-400"
              />
            </div>

            {/* Google Maps */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-blue-200">{lang === 'en' ? 'Maps Navigation' : '地图与导航'}</span>
                <span className="font-mono text-white">{calcMapsHours} {lang === 'en' ? 'hrs/day' : '小时/天'}</span>
              </div>
              <input
                type="range"
                min="0"
                max="8"
                step="0.5"
                value={calcMapsHours}
                onChange={(e) => setCalcMapsHours(Number(e.target.value))}
                className="w-full h-1.5 bg-blue-950 rounded-lg appearance-none cursor-pointer accent-blue-400"
              />
            </div>

            {/* Social Media */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-blue-200">{lang === 'en' ? 'Social & Photos' : '社媒/微信/小红书'}</span>
                <span className="font-mono text-white">{calcSocialHours} {lang === 'en' ? 'hrs/day' : '小时/天'}</span>
              </div>
              <input
                type="range"
                min="0"
                max="6"
                step="0.5"
                value={calcSocialHours}
                onChange={(e) => setCalcSocialHours(Number(e.target.value))}
                className="w-full h-1.5 bg-blue-950 rounded-lg appearance-none cursor-pointer accent-blue-400"
              />
            </div>

            {/* Video & Streaming */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-blue-200">{lang === 'en' ? 'Video / Calls' : '高清视频/通话'}</span>
                <span className="font-mono text-white">{calcVideoMins} {lang === 'en' ? 'mins/day' : '分钟/天'}</span>
              </div>
              <input
                type="range"
                min="0"
                max="180"
                step="15"
                value={calcVideoMins}
                onChange={(e) => setCalcVideoMins(Number(e.target.value))}
                className="w-full h-1.5 bg-blue-950 rounded-lg appearance-none cursor-pointer accent-blue-400"
              />
            </div>
          </div>

          {/* Calculator Output */}
          <div className="bg-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/10">
            <div className="text-xs space-y-0.5 text-center sm:text-left">
              <span className="text-blue-200 block">{lang === 'en' ? 'Estimated Total Consumption:' : '根据您的使用习惯推荐：'}</span>
              <p className="text-white font-medium">
                {lang === 'en'
                  ? `For ${calcDays} days of travel, a ${Math.ceil(Number(estimatedGB))} GB plan or higher is recommended.`
                  : `在 ${calcDays} 天的旅程中，建议选择 ${Math.ceil(Number(estimatedGB))} GB 或以上的套餐，保障全程畅爽无忧。`}
              </p>
            </div>
            <div className="text-center sm:text-right bg-blue-600/60 px-6 py-2 rounded-xl border border-blue-400/30">
              <span className="text-[10px] text-blue-200 block uppercase font-mono">{lang === 'en' ? 'Suggested Data' : '建议流量'}</span>
              <span className="text-xl font-extrabold font-mono text-white">~{estimatedGB} GB</span>
            </div>
          </div>
        </div>
      )}

      {/* Search & Region Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'en'
                  ? 'Search country, region or telecom (e.g. Japan, Europe, SoftBank, AT&T)...'
                  : '搜索国家、地区或运营商（如 日本, 欧洲35国, SoftBank, AT&T）...'
              }
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
            />
          </div>
        </div>

        {/* Region Filter Chips */}
        <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-none">
          {regionTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeRegion === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveRegion(tab.id as EsimRegion)}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{lang === 'en' ? tab.labelEn : tab.labelZh}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Destination Grid & Plans View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Destinations Grid (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              {lang === 'en'
                ? `Destinations Available (${filteredDestinations.length})`
                : `可选目的地 (${filteredDestinations.length})`}
            </h3>
            <span className="text-xs text-blue-600 font-medium">
              {lang === 'en' ? 'Click card to view data packages' : '点击目的地展开查看套餐'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredDestinations.map((dest) => {
              const isSelected = selectedDestination?.id === dest.id;
              const startingPrice = Math.min(...dest.packages.map((p) => p.priceUSD));
              const startingConverted = (startingPrice * currInfo.rate).toFixed(2);

              return (
                <div
                  key={dest.id}
                  onClick={() => setSelectedDestination(dest)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-600 shadow-md ring-2 ring-blue-600/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  {/* Popular ribbon */}
                  {dest.isPopular && (
                    <span className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg font-mono">
                      POPULAR
                    </span>
                  )}

                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl p-1 bg-white rounded-xl shadow-xs border border-slate-100">
                        {dest.flag}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {lang === 'en' ? dest.countryNameEn : dest.countryNameZh}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {dest.speeds.map((s) => (
                            <span key={s} className="text-[10px] px-1.5 py-0.2 bg-blue-100 text-blue-700 font-bold rounded font-mono">
                              {s}
                            </span>
                          ))}
                          {dest.isRegional && (
                            <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 font-medium rounded">
                              {dest.coverageCountriesCount} {lang === 'en' ? 'Countries' : '国通用'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-mono text-[11px] truncate max-w-[130px]">
                      {dest.networkPartners[0]}
                    </span>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 mr-1">{lang === 'en' ? 'From' : '起价'}</span>
                      <span className="font-bold text-slate-900 font-mono text-sm">
                        {currInfo.symbol}
                        {startingConverted}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Destination Packages & Network Details (5 cols) */}
        <div className="lg:col-span-5">
          {selectedDestination ? (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm sticky top-24 space-y-6">
              
              {/* Country Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <span className="text-4xl">{selectedDestination.flag}</span>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 font-display">
                      {lang === 'en' ? selectedDestination.countryNameEn : selectedDestination.countryNameZh}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {selectedDestination.coverageCountriesCount > 1
                        ? (lang === 'en' ? `Multi-Country Roaming Pass (${selectedDestination.coverageCountriesCount} destinations)` : `多国漫游通行证（含 ${selectedDestination.coverageCountriesCount} 个国家）`)
                        : (lang === 'en' ? 'Single Country 5G eSIM' : '单国原生 5G 高速 eSIM')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Carrier & Feature Badges */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-slate-700">
                  <Wifi className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <span className="font-semibold">{lang === 'en' ? 'Carrier Networks:' : '合作运营商：'}</span>
                  <span className="font-mono text-slate-500 truncate">{selectedDestination.networkPartners.join(' • ')}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-700">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span className="font-semibold">{lang === 'en' ? 'Identity Verification (eKYC):' : '实名认证要求：'}</span>
                  <span className="text-emerald-600 font-bold">
                    {selectedDestination.ekycRequired
                      ? (lang === 'en' ? 'Required' : '需要')
                      : (lang === 'en' ? 'Not Required (Instant)' : '免实名认证 (即插即用)')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 leading-relaxed">
                  {lang === 'en' ? selectedDestination.coverageDetailsEn : selectedDestination.coverageDetailsZh}
                </p>
              </div>

              {/* Available Packages List */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                  {lang === 'en' ? 'Select Data Package' : '选择流量套餐'}
                </label>

                <div className="space-y-2">
                  {selectedDestination.packages.map((pkg) => {
                    const convertedPrice = (pkg.priceUSD * currInfo.rate).toFixed(2);
                    const originalConverted = pkg.originalPriceUSD ? (pkg.originalPriceUSD * currInfo.rate).toFixed(2) : null;

                    return (
                      <div
                        key={pkg.id}
                        className="p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 transition-all flex items-center justify-between group"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-extrabold text-slate-900 font-mono">
                              {pkg.dataAmount}
                            </span>
                            <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium">
                              {pkg.validityDays} {lang === 'en' ? 'Days' : '天'}
                            </span>
                            {pkg.isPopular && (
                              <span className="text-[10px] px-1.5 py-0.2 bg-amber-100 text-amber-800 font-bold rounded">
                                BEST VALUE
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 max-w-[220px] leading-tight">
                            {lang === 'en' ? pkg.descriptionEn : pkg.descriptionZh}
                          </p>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <div className="text-base font-extrabold text-blue-600 font-mono">
                              {currInfo.symbol}
                              {convertedPrice}
                            </div>
                            {originalConverted && (
                              <div className="text-[10px] text-slate-400 line-through font-mono">
                                {currInfo.symbol}
                                {originalConverted}
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => onSelectPlan(selectedDestination, pkg)}
                            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/10 active:scale-95 flex items-center space-x-1 cursor-pointer"
                          >
                            <span>{lang === 'en' ? 'Buy' : '购买'}</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Secure Checkout Note */}
              <div className="pt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                <Zap className="h-3 w-3 text-amber-500" />
                <span>
                  {lang === 'en'
                    ? 'Apple Pay, Cards, WeChat Pay & Crypto Accepted'
                    : '支持 Apple Pay, 信用卡, 微信/支付宝 与 加密货币支付'}
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center text-slate-400 text-xs">
              {lang === 'en' ? 'Select a destination on the left' : '请在左侧选择目的地'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
