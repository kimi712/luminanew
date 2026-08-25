import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { EsimStore } from './components/EsimStore';
import { MyEsims } from './components/MyEsims';
import { EsimCheckoutModal } from './components/EsimCheckoutModal';
import { CompatibilityModal } from './components/CompatibilityModal';
import { CardList } from './components/CardList';
import { CardCompare } from './components/CardCompare';
import { RewardsCalculator } from './components/RewardsCalculator';
import { StrategyGuide } from './components/StrategyGuide';
import { AiConsultant } from './components/AiConsultant';
import { CreditCard } from './data/cards';
import { INITIAL_PURCHASED_ESIMS, ESIM_DESTINATIONS } from './data/esimData';
import { Language, Currency, EsimDestination, EsimPackage, PurchasedEsim } from './types';
import { Sparkles, Globe2, ShieldCheck, Zap, Wifi } from 'lucide-react';

export default function App() {
  // Primary language default to English
  const [lang, setLang] = useState<Language>('en');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [activeTab, setActiveTab] = useState<string>('esim-store');
  const [compareList, setCompareList] = useState<CreditCard[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // eSIM state
  const [purchasedEsims, setPurchasedEsims] = useState<PurchasedEsim[]>(() => {
    try {
      const saved = localStorage.getItem('lumina_purchased_esims');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PURCHASED_ESIMS;
  });

  // Persist purchased eSIMs
  useEffect(() => {
    try {
      localStorage.setItem('lumina_purchased_esims', JSON.stringify(purchasedEsims));
    } catch (e) {
      console.error(e);
    }
  }, [purchasedEsims]);

  // Checkout modal state
  const [checkoutTarget, setCheckoutTarget] = useState<{
    destination: EsimDestination;
    plan: EsimPackage;
  } | null>(null);

  // Compatibility modal state
  const [showCompatibility, setShowCompatibility] = useState<boolean>(false);

  const handleToggleCompare = (card: CreditCard) => {
    setErrorMessage(null);
    const exists = compareList.some((c) => c.id === card.id);
    if (exists) {
      setCompareList(compareList.filter((c) => c.id !== card.id));
    } else {
      if (compareList.length >= 3) {
        setErrorMessage(
          lang === 'en'
            ? 'Comparison tray is limited to 3 credit cards maximum!'
            : '对比箱最多只能同时加入 3 张信用卡进行比较哦！'
        );
        setTimeout(() => setErrorMessage(null), 3500);
        return;
      }
      setCompareList([...compareList, card]);
    }
  };

  const handleRemoveCompare = (card: CreditCard) => {
    setCompareList(compareList.filter((c) => c.id !== card.id));
  };

  const handleClearCompare = () => {
    setCompareList([]);
  };

  const handleSelectPlan = (destination: EsimDestination, pkg: EsimPackage) => {
    setCheckoutTarget({ destination, plan: pkg });
  };

  const handleCompletePurchase = (newEsim: PurchasedEsim) => {
    setPurchasedEsims((prev) => [newEsim, ...prev]);
    setCheckoutTarget(null);
    setActiveTab('my-esims');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTopUp = (esim: PurchasedEsim) => {
    const dest = ESIM_DESTINATIONS.find((d) => d.id === esim.destinationId) || ESIM_DESTINATIONS[0];
    const pkg = dest.packages[0];
    setCheckoutTarget({ destination: dest, plan: pkg });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        compareCount={compareList.length}
        myEsimsCount={purchasedEsims.length}
        lang={lang}
        setLang={setLang}
        currency={currency}
        setCurrency={setCurrency}
      />

      {/* Main Content Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner/Alert messages */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-4 py-3 rounded-2xl shadow-sm text-center animate-bounce">
            {errorMessage}
          </div>
        )}

        {/* Global eSIM Hero Banner when on eSIM store */}
        {activeTab === 'esim-store' && (
          <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-6 sm:p-10 border border-slate-800 shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#2563eb,transparent_35%)] opacity-35 animate-mesh" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_75%,#06b6d4,transparent_40%)] opacity-25 animate-mesh" />
            <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl space-y-4">
              <span className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-500/20 text-xs font-bold font-display tracking-wide text-blue-300 border border-blue-400/20">
                <Wifi className="h-3.5 w-3.5 text-cyan-400" />
                <span>
                  {lang === 'en'
                    ? 'Instant Global Connectivity • 200+ Countries 5G eSIM'
                    : '全球即时连接 • 200+ 国家与地区高速 5G eSIM'}
                </span>
              </span>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display leading-tight text-white">
                {lang === 'en' ? (
                  <>
                    Borderless High-Speed Travel eSIMs <br className="hidden sm:inline" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300">
                      With Multi-Channel Instant Checkout
                    </span>
                  </>
                ) : (
                  <>
                    无缝高速出境跨境 eSIM <br className="hidden sm:inline" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300">
                      支持 Apple Pay、国际信用卡、微信支付宝与加密支付
                    </span>
                  </>
                )}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                {lang === 'en'
                  ? 'Connect immediately upon arrival in 200+ countries with Tier-1 5G/4G local networks. Zero physical SIM swaps, no exorbitant roaming fees, and automated QR provisioning within 60 seconds.'
                  : '落地即连，畅享全球顶尖运营商原生 5G/4G 极速漫游。无需插拔实体卡，无高额漫游费账单，60秒内自动完成即时发卡与扫码激活。'}
              </p>

              {/* Fast feature metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 text-xs">
                <div className="flex items-center space-x-2 text-slate-200">
                  <Globe2 className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                  <span>{lang === 'en' ? '200+ Countries' : '覆盖 200+ 国家'}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-200">
                  <Zap className="h-4 w-4 text-amber-400 flex-shrink-0" />
                  <span>{lang === 'en' ? 'Instant QR Code' : '60秒即时交付'}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-200">
                  <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  <span>{lang === 'en' ? 'Tier-1 Networks' : '原生高速网络'}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-200">
                  <Sparkles className="h-4 w-4 text-purple-400 flex-shrink-0" />
                  <span>{lang === 'en' ? 'Multi-Payment' : '多渠道便捷付'}</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Credit Card Hero Banner when on Library */}
        {activeTab === 'library' && (
          <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 sm:p-10 border border-blue-950 shadow-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#2563eb,transparent_40%)] opacity-30 animate-mesh" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,#06b6d4,transparent_45%)] opacity-20 animate-mesh" />

            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-xs font-bold font-display tracking-wide text-blue-200">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                <span>
                  {lang === 'en'
                    ? 'US Travel Credit Card Rewards Intelligence'
                    : '2026 美卡精英常旅客及点数指南'}
                </span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display leading-tight">
                {lang === 'en' ? 'Maximize Travel Points & Free Flights' : '最大化您的刷卡回血，开启奢华商旅'}
              </h2>
              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed max-w-lg">
                {lang === 'en'
                  ? 'Master Chase 5/24 rules, unlock premium airline & hotel transfer partners (Hyatt, ANA, Air France), and calculate real net returns with our automated analytics.'
                  : '深入了解 Chase 5/24 限制，精确测算哪张信用卡在您的日常开销中最省钱，配合 Gemini AI 大师亲自为您号脉推荐最佳开卡序列。'}
              </p>
            </div>
          </section>
        )}

        {/* Tab Router Render */}
        <div className="transition-all duration-300">
          {activeTab === 'esim-store' && (
            <EsimStore
              lang={lang}
              currency={currency}
              onSelectPlan={handleSelectPlan}
              onOpenCompatibility={() => setShowCompatibility(true)}
            />
          )}

          {activeTab === 'my-esims' && (
            <MyEsims
              esims={purchasedEsims}
              lang={lang}
              onGoToStore={() => {
                setActiveTab('esim-store');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onTopUp={handleTopUp}
            />
          )}

          {activeTab === 'library' && (
            <CardList
              lang={lang}
              compareList={compareList}
              onToggleCompare={handleToggleCompare}
              onClearCompare={handleClearCompare}
              onGoToCompare={() => {
                setActiveTab('compare');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {activeTab === 'compare' && (
            <CardCompare
              lang={lang}
              compareList={compareList}
              onRemoveCard={handleRemoveCompare}
              onClearAll={handleClearCompare}
              onGoToLibrary={() => {
                setActiveTab('library');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {activeTab === 'calculator' && <RewardsCalculator lang={lang} />}

          {activeTab === 'strategy' && <StrategyGuide lang={lang} />}

          {activeTab === 'ai-consultant' && <AiConsultant lang={lang} />}
        </div>
      </main>

      {/* Checkout Modal */}
      <EsimCheckoutModal
        isOpen={!!checkoutTarget}
        onClose={() => setCheckoutTarget(null)}
        destination={checkoutTarget?.destination || null}
        selectedPackage={checkoutTarget?.plan || null}
        currency={currency}
        lang={lang}
        onPurchaseSuccess={handleCompletePurchase}
      />

      {/* Device Compatibility Modal */}
      <CompatibilityModal
        isOpen={showCompatibility}
        onClose={() => setShowCompatibility(false)}
        lang={lang}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto text-center text-xs text-slate-400 space-y-1.5">
        <p className="font-semibold text-slate-600">
          {lang === 'en'
            ? 'Lumina Global Travel & eSIM Intelligence © 2026'
            : '美卡精英 & Lumina 全球商旅 eSIM © 2026. All Rights Reserved.'}
        </p>
        <p className="max-w-xl mx-auto leading-relaxed px-4 text-[11px] text-slate-400">
          {lang === 'en'
            ? 'Notice: eSIM connectivity is powered by Tier-1 telecommunication roaming agreements. Credit card rewards and point valuations are for strategic estimation only and subject to issuer approval.'
            : '声明：本站提供之全球 eSIM 服务由顶级运营商直连漫游承载；信用卡点数估值、福利细节仅供参考，不构成任何硬性申请承诺。理财需理性，畅享全球无界之旅。'}
        </p>
      </footer>
    </div>
  );
}
