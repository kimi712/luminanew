import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ESIM_DESTINATIONS } from '../data/esimData';
import {
  EsimDestination,
  EsimPackage,
  EsimRegion,
  PlanCategory,
  Currency,
  CURRENCIES,
  Language,
} from '../types';
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
  Check,
  Copy,
  CreditCard,
  Lock,
  Radio,
  Tag,
  BookOpen,
  HelpCircle,
  Award,
  Fingerprint,
  Activity,
  CheckCircle2,
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
  const [planCategory, setPlanCategory] = useState<PlanCategory>('all');
  const [selectedDestination, setSelectedDestination] = useState<EsimDestination | null>(
    ESIM_DESTINATIONS[0]
  );
  const [showCalculator, setShowCalculator] = useState(false);
  const [showBankMatrix, setShowBankMatrix] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [copiedApn, setCopiedApn] = useState(false);

  // Data Usage Calculator States
  const [calcDays, setCalcDays] = useState(7);
  const [calcMapsHours, setCalcMapsHours] = useState(2); // hrs/day
  const [calcSocialHours, setCalcSocialHours] = useState(1.5); // hrs/day
  const [calcVideoMins, setCalcVideoMins] = useState(30); // mins/day

  const currInfo = CURRENCIES[currency];

  const regionTabs = [
    { id: 'all', labelEn: 'All Destinations', labelZh: '全部目的地', icon: Globe2 },
    { id: 'us-special', labelEn: 'US Cardholder / Clean IP', labelZh: '美卡专属 / 纯净原生IP', icon: ShieldCheck },
    { id: 'popular', labelEn: 'Top Popular', labelZh: '热门精选', icon: Flame },
    { id: 'asia', labelEn: 'Asia Pacific', labelZh: '亚太地区', icon: Sparkles },
    { id: 'europe', labelEn: 'Europe (42 Countries)', labelZh: '欧洲全境', icon: Layers },
    { id: 'north-america', labelEn: 'North America', labelZh: '北美全境', icon: Zap },
    { id: 'global', labelEn: 'Global Pass (140+)', labelZh: '全球通用 (140+国)', icon: Globe2 },
  ];

  const categoryTabs = [
    { id: 'all', labelEn: 'All Packages', labelZh: '全部套餐' },
    { id: 'daily', labelEn: 'Daily Reset (1~2GB/Day)', labelZh: '每日重置高速' },
    { id: 'total', labelEn: 'Total Quota (Flexible)', labelZh: '总量长效包' },
    { id: 'long_term', labelEn: '365D Keeper / Card Maintenance', labelZh: '365天保号养卡' },
    { id: 'unlimited', labelEn: 'Truly Unlimited 5G', labelZh: '全速不限量' },
  ];

  const filteredDestinations = useMemo(() => {
    return ESIM_DESTINATIONS.filter((item) => {
      // Region filter
      if (activeRegion === 'popular' && !item.isPopular) return false;
      if (activeRegion === 'us-special' && !item.isUsCardPlayerRecommended) return false;
      if (
        activeRegion !== 'all' &&
        activeRegion !== 'popular' &&
        activeRegion !== 'us-special' &&
        item.region !== activeRegion
      ) {
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

  // Packages filtered by plan category
  const activePackages = useMemo(() => {
    if (!selectedDestination) return [];
    if (planCategory === 'all') return selectedDestination.packages;
    return selectedDestination.packages.filter((p) => p.category === planCategory);
  }, [selectedDestination, planCategory]);

  // Calculate estimated GB
  const estimatedGB = useMemo(() => {
    const dailyMB = calcMapsHours * 60 + calcSocialHours * 150 + calcVideoMins * 8.3;
    const totalMB = dailyMB * calcDays;
    return (totalMB / 1024).toFixed(1);
  }, [calcDays, calcMapsHours, calcSocialHours, calcVideoMins]);

  const handleCopyApn = (apn: string) => {
    navigator.clipboard.writeText(apn);
    setCopiedApn(true);
    setTimeout(() => setCopiedApn(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Caylet Signature Highlighting Banner: Clean Native IP for US Card Players */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-indigo-900/60 relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-96 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent pointer-events-none" />
        
        {/* Animated Cyber line glow */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[11px] font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                <Fingerprint className="h-3.5 w-3.5 text-cyan-400" />
                {lang === 'en' ? 'Clean Native IP Architecture' : '纯净原生住宅 IP • 美卡专属网络'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold font-mono flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                {lang === 'en' ? 'Zero Bank Fraud Risk' : '网银 100% 零风控直通'}
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-extrabold font-display leading-snug text-white">
              {lang === 'en'
                ? 'Tailored for US Credit Card Players & Global Travelers'
                : '专为美卡玩家、跨境出海与全球常旅客定制的高速纯净 eSIM'}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'en'
                ? 'Direct telecom ISP routing without dirty datacenter VPN flags. Safely log into Chase, Amex, Capital One, Citi, PayPal US & Wise with zero fraud triggers or KYC hassle.'
                : '直连当地一级电信 ISP 原生路由，杜绝机房脏 IP。无需实名认证，完美支持 Chase / Amex / Capital One / Citi / 汇丰网银安全登陆与在线申卡，零风控拦截。'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 items-center">
            <button
              onClick={() => setShowBankMatrix(!showBankMatrix)}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105"
            >
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>{lang === 'en' ? 'Bank Risk Matrix' : '查看银行风控测试表'}</span>
            </button>
            <button
              onClick={() => setShowSetupGuide(!showSetupGuide)}
              className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all shadow-lg shadow-blue-500/30 flex items-center gap-1.5 cursor-pointer hover:scale-105"
            >
              <BookOpen className="h-4 w-4" />
              <span>{lang === 'en' ? 'APN & Setup Guide' : 'APN 与一键安装教程'}</span>
            </button>
          </div>
        </div>

        {/* Bank Compatibility Accordion */}
        <AnimatePresence>
          {showBankMatrix && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 pt-5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 overflow-hidden"
            >
              {[
                { name: 'Chase Bank', status: '100% Pass', icon: '🏛️' },
                { name: 'American Express', status: '100% Pass', icon: '💳' },
                { name: 'Capital One', status: '100% Pass', icon: '🏦' },
                { name: 'Citibank US', status: '100% Pass', icon: '💎' },
                { name: 'US Bank / Wells', status: '100% Pass', icon: '🦅' },
                { name: 'PayPal US', status: '100% Pass', icon: '🅿️' },
                { name: 'Wise / Revolut', status: '100% Pass', icon: '🌐' },
                { name: 'Apple Pay / ID', status: '100% Pass', icon: '🍎' },
              ].map((bank, i) => (
                <div key={i} className="bg-white/10 p-2.5 rounded-xl border border-white/10 text-center space-y-0.5 backdrop-blur-xs">
                  <div className="text-base">{bank.icon}</div>
                  <div className="text-[11px] font-bold text-white truncate">{bank.name}</div>
                  <div className="text-[10px] text-emerald-400 font-mono font-bold">{bank.status}</div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* APN & Setup Guide Accordion */}
        <AnimatePresence>
          {showSetupGuide && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 pt-5 border-t border-white/10 space-y-4 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-200">
                <div className="bg-black/40 p-4 rounded-2xl border border-white/10 space-y-1.5">
                  <div className="font-bold text-cyan-300 flex items-center gap-1.5 font-mono">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
                    {lang === 'en' ? 'Scan LPA QR Code' : '扫码一键添加'}
                  </div>
                  <p className="text-[11px] text-slate-300">
                    {lang === 'en'
                      ? 'Go to Settings > Cellular > Add eSIM, scan your delivery QR code.'
                      : '进入手机「设置」>「蜂窝网络 / 移动网络」> 点击「添加 eSIM」扫描交付二维码。'}
                  </p>
                </div>

                <div className="bg-black/40 p-4 rounded-2xl border border-white/10 space-y-1.5">
                  <div className="font-bold text-cyan-300 flex items-center gap-1.5 font-mono">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">2</span>
                    {lang === 'en' ? 'Enable Data Roaming' : '开启数据漫游'}
                  </div>
                  <p className="text-[11px] text-slate-300">
                    {lang === 'en'
                      ? 'Upon landing at your destination, toggle on "Data Roaming" in cellular settings.'
                      : '落地目的地后，开启该 eSIM 的「数据漫游」开关，手机将自动接入最强 5G 信号。'}
                  </p>
                </div>

                <div className="bg-black/40 p-4 rounded-2xl border border-white/10 space-y-1.5">
                  <div className="font-bold text-cyan-300 flex items-center gap-1.5 font-mono">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">3</span>
                    {lang === 'en' ? 'APN Auto Config' : 'APN 自动配置'}
                  </div>
                  <p className="text-[11px] text-slate-300">
                    {lang === 'en'
                      ? 'APN is pushed automatically. For manual config, enter "fast.t-mobile.com" or "globaldata".'
                      : 'APN 会自动下发适配。如遇特殊机型，手动填写 APN 接入点为 "fast.t-mobile.com" 或 "globaldata"。'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Top Banner & Quick Tools Bar with Stagger Animation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Feature 1: Instant Delivery & Zero KYC */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl flex items-center space-x-4 hover:border-slate-700 transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-cyan-400 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
            <Zap className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              {lang === 'en' ? 'Instant 5s Delivery • 0 KYC' : '5秒出码 • 免实名认证'}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'en'
                ? 'Zero personal info needed. SM-DP+ issued automatically'
                : '无需上传护照或实名，付款后自动分配全球 5G ICCID'}
            </p>
          </div>
        </motion.div>

        {/* Feature 2: Compatibility Checker Button */}
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          onClick={onOpenCompatibility}
          className="bg-slate-900/90 hover:bg-slate-850 rounded-2xl p-5 border border-slate-800 hover:border-blue-500/50 shadow-xl flex items-center justify-between text-left transition-all cursor-pointer group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Smartphone className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                {lang === 'en' ? 'Device Checker' : '机型兼容性检测'}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'en' ? 'Check iPhone, Galaxy, Pixel & iPad support' : '自查 iPhone, 三星, 谷歌 Pixel 支持'}
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
        </motion.button>

        {/* Feature 3: Data Usage Estimator */}
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          onClick={() => setShowCalculator(!showCalculator)}
          className={`rounded-2xl p-5 border shadow-xl flex items-center justify-between text-left transition-all cursor-pointer group ${
            showCalculator
              ? 'bg-blue-600 text-white border-blue-500 shadow-blue-500/30'
              : 'bg-slate-900/90 hover:bg-slate-850 border-slate-800 hover:border-indigo-500/50 text-slate-100'
          }`}
        >
          <div className="flex items-center space-x-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${
                showCalculator ? 'bg-white/20 text-white' : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
              }`}
            >
              <Calculator className="h-6 w-6" />
            </div>
            <div>
              <h4
                className={`text-xs font-bold uppercase tracking-wider font-mono ${
                  showCalculator ? 'text-white' : 'text-white'
                }`}
              >
                {lang === 'en' ? 'Trip Data Calculator' : '旅行流量精准测算'}
              </h4>
              <p className={`text-xs mt-0.5 ${showCalculator ? 'text-blue-100' : 'text-slate-400'}`}>
                {lang === 'en' ? 'Estimate how many GBs you need' : '根据出行天数和使用习惯估算所需流量'}
              </p>
            </div>
          </div>
          <Sliders className={`h-5 w-5 ${showCalculator ? 'text-white' : 'text-slate-500'}`} />
        </motion.button>
      </div>

      {/* Expandable Data Usage Calculator Drawer */}
      <AnimatePresence>
        {showCalculator && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-blue-800/60 space-y-6"
          >
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-cyan-300">
                  <Calculator className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-display text-white">
                    {lang === 'en' ? 'Interactive Trip Data Usage Estimator' : '智能出行数据流量测算'}
                  </h3>
                  <p className="text-xs text-slate-300">
                    {lang === 'en' ? 'Adjust sliders to estimate your trip data requirements' : '拖动滑块自定义您的日常网络需求'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCalculator(false)}
                className="text-xs text-cyan-300 hover:text-white underline cursor-pointer font-mono"
              >
                {lang === 'en' ? 'Close' : '收起'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Trip Duration */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{lang === 'en' ? 'Trip Duration' : '旅行天数'}</span>
                  <span className="font-mono text-cyan-400 font-bold">{calcDays} {lang === 'en' ? 'Days' : '天'}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={calcDays}
                  onChange={(e) => setCalcDays(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Google Maps */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{lang === 'en' ? 'Maps Navigation' : '地图与导航'}</span>
                  <span className="font-mono text-cyan-400 font-bold">{calcMapsHours} {lang === 'en' ? 'hrs/day' : '小时/天'}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="8"
                  step="0.5"
                  value={calcMapsHours}
                  onChange={(e) => setCalcMapsHours(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Social Media */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{lang === 'en' ? 'Social & Photos' : '社媒/微信/小红书'}</span>
                  <span className="font-mono text-cyan-400 font-bold">{calcSocialHours} {lang === 'en' ? 'hrs/day' : '小时/天'}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="6"
                  step="0.5"
                  value={calcSocialHours}
                  onChange={(e) => setCalcSocialHours(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Video & Streaming */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{lang === 'en' ? 'Video / Calls' : '高清视频/通话'}</span>
                  <span className="font-mono text-cyan-400 font-bold">{calcVideoMins} {lang === 'en' ? 'mins/day' : '分钟/天'}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="180"
                  step="15"
                  value={calcVideoMins}
                  onChange={(e) => setCalcVideoMins(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            </div>

            {/* Calculator Output */}
            <div className="bg-slate-950/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-blue-500/30">
              <div className="text-xs space-y-0.5 text-center sm:text-left">
                <span className="text-cyan-400 font-mono block">{lang === 'en' ? 'Estimated Total Consumption:' : '根据您的使用习惯推荐：'}</span>
                <p className="text-slate-200 font-medium">
                  {lang === 'en'
                    ? `For ${calcDays} days of travel, a ${Math.ceil(Number(estimatedGB))} GB plan or higher is recommended.`
                    : `在 ${calcDays} 天的旅程中，建议选择 ${Math.ceil(Number(estimatedGB))} GB 或以上的套餐，保障全程畅爽无忧。`}
                </p>
              </div>
              <div className="text-center sm:text-right bg-blue-600/40 px-6 py-2.5 rounded-xl border border-blue-400/40">
                <span className="text-[10px] text-cyan-300 block uppercase font-mono">{lang === 'en' ? 'Suggested Data' : '建议流量'}</span>
                <span className="text-2xl font-extrabold font-mono text-white">~{estimatedGB} GB</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search & Region Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box with Cyber Style */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'en'
                  ? 'Search country, region or telecom (e.g. USA Native IP, Japan, Europe, T-Mobile, Docomo)...'
                  : '搜索目的地、运营商或网络类型（如 美国纯净IP, 日本, 欧洲42国, T-Mobile, Docomo）...'
              }
              className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:border-cyan-500/50 shadow-inner"
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
                    ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/30'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
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
            <span className="text-xs text-cyan-400 font-medium font-mono">
              {lang === 'en' ? 'Click card to view plan options' : '点击目的地展开查看具体套餐'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredDestinations.map((dest, idx) => {
              const isSelected = selectedDestination?.id === dest.id;
              const startingPrice = Math.min(...dest.packages.map((p) => p.priceUSD));
              const startingConverted = (startingPrice * currInfo.rate).toFixed(2);

              return (
                <motion.div
                  key={dest.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.03, 0.3), duration: 0.35 }}
                  onClick={() => setSelectedDestination(dest)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? 'bg-gradient-to-br from-blue-950/80 via-slate-900 to-indigo-950/80 border-cyan-400 shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-400/40'
                      : 'bg-slate-900/80 border-slate-800/90 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  {/* Native IP Badge or Popular ribbon */}
                  {dest.isUsCardPlayerRecommended ? (
                    <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-bl-lg font-mono flex items-center gap-1">
                      <ShieldCheck className="h-2.5 w-2.5 text-cyan-300" />
                      CLEAN IP
                    </span>
                  ) : dest.isPopular ? (
                    <span className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg font-mono">
                      POPULAR
                    </span>
                  ) : null}

                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl p-1 bg-slate-800 rounded-xl shadow-xs border border-slate-700">
                        {dest.flag}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors font-display">
                          {lang === 'en' ? dest.countryNameEn : dest.countryNameZh}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {dest.speeds.map((s) => (
                            <span
                              key={s}
                              className="text-[10px] px-1.5 py-0.2 bg-blue-950 text-cyan-300 border border-blue-800/60 font-bold rounded font-mono"
                            >
                              {s}
                            </span>
                          ))}
                          {dest.isCleanNativeIp && (
                            <span className="text-[10px] px-1.5 py-0.2 bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-bold rounded font-mono">
                              0 KYC
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-mono text-[11px] truncate max-w-[140px]">
                      {dest.networkPartners[0]}
                    </span>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 mr-1">{lang === 'en' ? 'From' : '起价'}</span>
                      <span className="font-bold text-white font-mono text-sm group-hover:text-cyan-400 transition-colors">
                        {currInfo.symbol}
                        {startingConverted}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Destination Packages & Network Details (5 cols) */}
        <div className="lg:col-span-5">
          {selectedDestination ? (
            <motion.div
              key={selectedDestination.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}
              className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-2xl sticky top-24 space-y-6"
            >
              {/* Country Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <span className="text-4xl">{selectedDestination.flag}</span>
                  <div>
                    <h3 className="text-base font-extrabold text-white font-display">
                      {lang === 'en' ? selectedDestination.countryNameEn : selectedDestination.countryNameZh}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {selectedDestination.coverageCountriesCount > 1
                        ? lang === 'en'
                        ? `Multi-Country Roaming Pass (${selectedDestination.coverageCountriesCount} destinations)`
                        : `多国漫游通行证（含 ${selectedDestination.coverageCountriesCount} 个国家）`
                        : lang === 'en'
                        ? 'Single Destination 5G eSIM'
                        : '单国原生 5G 高速 eSIM'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Carrier & Feature Badges */}
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2.5 text-xs">
                <div className="flex items-center space-x-2 text-slate-200">
                  <Wifi className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                  <span className="font-semibold">{lang === 'en' ? 'Carriers:' : '合作运营商：'}</span>
                  <span className="font-mono text-slate-400 truncate">
                    {selectedDestination.networkPartners.join(' • ')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-200">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    <span className="font-semibold">{lang === 'en' ? 'eKYC Requirement:' : '实名认证要求：'}</span>
                    <span className="text-emerald-400 font-bold font-mono">
                      {lang === 'en' ? '0 KYC (Instant Provision)' : '免实名认证 (即插即用)'}
                    </span>
                  </div>
                </div>

                {/* APN display */}
                <div className="flex items-center justify-between text-slate-200 pt-1 border-t border-slate-800">
                  <div className="flex items-center space-x-2">
                    <Radio className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                    <span className="font-semibold">APN:</span>
                    <span className="font-mono text-slate-300 text-[11px]">{selectedDestination.apnSetting}</span>
                  </div>
                  <button
                    onClick={() => handleCopyApn(selectedDestination.apnSetting)}
                    className="text-cyan-400 hover:text-cyan-300 font-mono text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    {copiedApn ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedApn ? (lang === 'en' ? 'Copied' : '已复制') : (lang === 'en' ? 'Copy' : '复制')}</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
                  {lang === 'en' ? selectedDestination.coverageDetailsEn : selectedDestination.coverageDetailsZh}
                </p>
              </div>

              {/* Package Category Filter Tabs */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  {lang === 'en' ? 'Plan Categories' : '套餐分类'}
                </label>
                <div className="flex overflow-x-auto gap-1.5 pb-1 scrollbar-none">
                  {categoryTabs.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setPlanCategory(cat.id as PlanCategory)}
                      className={`px-3 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer border ${
                        planCategory === cat.id
                          ? 'bg-blue-600 text-white border-blue-500 shadow-xs'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750 hover:text-white'
                      }`}
                    >
                      {lang === 'en' ? cat.labelEn : cat.labelZh}
                    </button>
                  ))}
                </div>
              </div>

              {/* Available Packages List */}
              <div className="space-y-2.5">
                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {activePackages.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-2xl">
                      {lang === 'en' ? 'No packages found under this category' : '当前分类下暂无套餐，请切换分类查看'}
                    </div>
                  ) : (
                    activePackages.map((pkg, pIdx) => {
                      const convertedPrice = (pkg.priceUSD * currInfo.rate).toFixed(2);
                      const originalConverted = pkg.originalPriceUSD
                        ? (pkg.originalPriceUSD * currInfo.rate).toFixed(2)
                        : null;
                      const dailyRate = (pkg.priceUSD / pkg.validityDays * currInfo.rate).toFixed(2);

                      return (
                        <motion.div
                          key={pkg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: pIdx * 0.04, duration: 0.3 }}
                          className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-950 transition-all space-y-2.5 group"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-sm font-extrabold text-white font-mono">
                                  {pkg.dataAmount}
                                </span>
                                <span className="text-[11px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md font-medium">
                                  {pkg.validityDays} {lang === 'en' ? 'Days' : '天'}
                                </span>
                                {pkg.isBestValue && (
                                  <span className="text-[10px] px-1.5 py-0.2 bg-indigo-950 text-indigo-300 border border-indigo-700 font-bold rounded">
                                    BEST VALUE
                                  </span>
                                )}
                                {pkg.isPopular && (
                                  <span className="text-[10px] px-1.5 py-0.2 bg-amber-950 text-amber-300 border border-amber-700 font-bold rounded">
                                    POPULAR
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 leading-tight">
                                {lang === 'en' ? pkg.descriptionEn : pkg.descriptionZh}
                              </p>
                            </div>

                            <div className="text-right flex-shrink-0">
                              <div className="text-base font-extrabold text-cyan-400 font-mono">
                                {currInfo.symbol}
                                {convertedPrice}
                              </div>
                              {originalConverted && (
                                <div className="text-[10px] text-slate-500 line-through font-mono">
                                  {currInfo.symbol}
                                  {originalConverted}
                                </div>
                              )}
                              <div className="text-[10px] text-slate-400 font-mono">
                                ~{currInfo.symbol}{dailyRate}/{lang === 'en' ? 'day' : '天'}
                              </div>
                            </div>
                          </div>

                          {/* Features row */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px]">
                            <div className="flex flex-wrap gap-1">
                              {pkg.features?.slice(0, 2).map((feat, fi) => (
                                <span key={fi} className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 font-mono border border-slate-800">
                                  {feat}
                                </span>
                              ))}
                            </div>

                            <button
                              onClick={() => onSelectPlan(selectedDestination, pkg)}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/30 active:scale-95 flex items-center space-x-1 cursor-pointer"
                            >
                              <span>{lang === 'en' ? 'Buy eSIM' : '立即购买'}</span>
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Secure Checkout Note */}
              <div className="pt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-cyan-400" />
                <span>
                  {lang === 'en'
                    ? 'Apple Pay, Visa/MC/Amex, WeChat Pay, Alipay & Crypto'
                    : '支持 信用卡, Apple Pay, 微信, 支付宝, USDT 极速结算'}
                </span>
              </div>
            </motion.div>
          ) : (
            <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 text-center text-slate-400 text-xs">
              {lang === 'en' ? 'Select a destination on the left' : '请在左侧选择目的地'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
