import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
import { FooterLegal, LegalModalType } from './components/FooterLegal';
import { LegalModal } from './components/LegalModal';
import { CyberHeroTelemetry } from './components/CyberHeroTelemetry';
import { CreditCard } from './data/cards';
import { INITIAL_PURCHASED_ESIMS, ESIM_DESTINATIONS } from './data/esimData';
import { Language, Currency, EsimDestination, EsimPackage, PurchasedEsim } from './types';
import { Sparkles, Globe2, ShieldCheck, Zap, Wifi, Radio, Cpu, ArrowUpRight } from 'lucide-react';

export default function App() {
  // Primary language default to English
  const [lang, setLang] = useState<Language>('en');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [activeTab, setActiveTab] = useState<string>('esim-store');
  const [compareList, setCompareList] = useState<CreditCard[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Legal Modal State (about, contact, terms, privacy, refund)
  const [activeLegalModal, setActiveLegalModal] = useState<LegalModalType>(null);

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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 flex flex-col antialiased relative overflow-x-hidden">
      {/* Dynamic Cyber Gradient Glow Orbs in Background */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="fixed bottom-10 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

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
        onOpenLegalModal={(type) => setActiveLegalModal(type)}
      />

      {/* Main Content Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Banner/Alert messages */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-950/90 border border-red-500/50 text-red-200 text-xs font-semibold px-4 py-3 rounded-2xl shadow-lg text-center"
            >
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global eSIM Futuristic Cyber Hero with Live Telecom NOC Telemetry */}
        {activeTab === 'esim-store' && (
          <CyberHeroTelemetry
            lang={lang}
            onExploreClick={() => {
              const el = document.getElementById('store-packages-section');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.scrollBy({ top: 450, behavior: 'smooth' });
              }
            }}
            onOpenCompatibility={() => setShowCompatibility(true)}
          />
        )}

        {/* Credit Card Hero Banner when on Library */}
        {activeTab === 'library' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-10 border border-slate-800 shadow-2xl"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#2563eb,transparent_40%)] opacity-30 animate-mesh" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,#06b6d4,transparent_45%)] opacity-20 animate-mesh" />

            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-xs font-bold font-mono tracking-wide text-cyan-300 border border-cyan-400/30">
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
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
                {lang === 'en'
                  ? 'Master Chase 5/24 rules, unlock premium airline & hotel transfer partners (Hyatt, ANA, Air France), and calculate real net returns with our automated analytics.'
                  : '深入了解 Chase 5/24 限制，精确测算哪张信用卡在您的日常开销中最省钱，配合 Gemini AI 大师亲自为您号脉推荐最佳开卡序列。'}
              </p>
            </div>
          </motion.section>
        )}

        {/* Tab Router Render with Smooth Animated Fade */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            id="store-packages-section"
          >
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
          </motion.div>
        </AnimatePresence>
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

      {/* Comprehensive Legal, About, Contact Modals */}
      <LegalModal
        type={activeLegalModal}
        isOpen={!!activeLegalModal}
        onClose={() => setActiveLegalModal(null)}
        lang={lang}
      />

      {/* Futuristic Black Luxury Global Footer */}
      <FooterLegal
        lang={lang}
        onOpenModal={(type) => setActiveLegalModal(type)}
        onSelectCategory={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
