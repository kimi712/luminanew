import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  Radio,
  Wifi,
  ShieldCheck,
  Zap,
  Globe2,
  Server,
  Terminal,
  Cpu,
  Lock,
  ArrowUpRight,
  Sparkles,
  Signal,
  CheckCircle2,
} from 'lucide-react';
import { Language } from '../types';

interface CyberHeroTelemetryProps {
  lang: Language;
  onExploreClick: () => void;
  onOpenCompatibility: () => void;
}

export const CyberHeroTelemetry: React.FC<CyberHeroTelemetryProps> = ({
  lang,
  onExploreClick,
  onOpenCompatibility,
}) => {
  // Real-time simulated ping & throughput metrics
  const [telemetry, setTelemetry] = useState([
    { city: 'San Jose (US-West)', code: 'SJC', ping: 12, isp: 'AT&T / T-Mobile 5G', status: 'Optimal', ip: 'Residential Clean' },
    { city: 'Tokyo (JP-East)', code: 'NRT', ping: 18, isp: 'NTT Docomo / SoftBank', status: 'Optimal', ip: 'Native ISP' },
    { city: 'Frankfurt (EU-Central)', code: 'FRA', ping: 24, isp: 'Deutsche Telekom 5G', status: 'Optimal', ip: 'Tier-1 Native' },
    { city: 'Singapore (APAC-South)', code: 'SIN', ping: 19, isp: 'Singtel Ultra 5G', status: 'Optimal', ip: 'Zero KYC' },
    { city: 'London (UK-Hub)', code: 'LHR', ping: 21, isp: 'EE / Vodafone 5G', status: 'Optimal', ip: 'Tier-1 Native' },
  ]);

  const [activeNodeIndex, setActiveNodeIndex] = useState(0);
  const [pulseCount, setPulseCount] = useState(0);

  // Periodically fluctuate ping and active node for live cyber effect
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseCount((prev) => prev + 1);
      setTelemetry((prev) =>
        prev.map((node, i) => {
          const delta = Math.floor(Math.random() * 5) - 2;
          const basePing = i === 0 ? 11 : i === 1 ? 16 : i === 2 ? 22 : i === 3 ? 18 : 20;
          return {
            ...node,
            ping: Math.max(8, basePing + delta),
          };
        })
      );
    }, 2400);

    const cycleInterval = setInterval(() => {
      setActiveNodeIndex((prev) => (prev + 1) % 5);
    }, 4500);

    return () => {
      clearInterval(interval);
      clearInterval(cycleInterval);
    };
  }, []);

  const activeNode = telemetry[activeNodeIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900/95 via-slate-950/98 to-slate-950 border border-slate-800 shadow-2xl p-6 sm:p-8 backdrop-blur-xl"
    >
      {/* Cyber Grid Background & Radar Scanner Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:28px_28px] opacity-40 pointer-events-none" />
      
      {/* Dynamic Radar Wave */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main HUD Container */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Hero Title & Core Tech Selling Points (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Top Live Telecom Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="inline-flex flex-wrap items-center gap-2"
          >
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-300 text-xs font-mono font-bold shadow-lg shadow-blue-500/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
              <span>SM-DP+ GSMA CLOUD NOC: ONLINE</span>
              <span className="text-slate-500">|</span>
              <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                <Zap className="h-3 w-3" />
                {activeNode.ping}ms
              </span>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-[11px] font-mono font-bold hidden sm:inline-block">
              200+ NATIVE ISPS
            </span>
          </motion.div>

          {/* Main Display Headline with Gradient */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="space-y-2"
          >
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-white leading-tight">
              {lang === 'en' ? (
                <>
                  Next-Gen Global Travel eSIM <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">
                    Clean Native IP & Instant Activation
                  </span>
                </>
              ) : (
                <>
                  次世代全球出境高速 eSIM <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">
                    美卡纯净原生 IP • 60秒极速扫码交付
                  </span>
                </>
              )}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl font-sans pt-1">
              <strong className="text-white font-bold">Lumina Global</strong> operates a digital cross-border travel platform providing instant high-speed travel eSIM data packages and travel optimization tools for international travelers across 200+ countries.
            </p>
          </motion.div>

          {/* Feature Badges with Cyber Accents */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2"
          >
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 font-mono">
                <ShieldCheck className="h-4 w-4" />
                <span>{lang === 'en' ? 'Clean Native IP' : '纯净住宅原生 IP'}</span>
              </div>
              <p className="text-[11px] text-slate-400">
                {lang === 'en' ? 'Pass Chase/Amex/Citi fraud filters 100%' : '美卡网银 100% 绿标直通防封控'}
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 font-mono">
                <Radio className="h-4 w-4 text-cyan-300 animate-pulse" />
                <span>{lang === 'en' ? 'Sub-5s Delivery' : '5秒极速发卡'}</span>
              </div>
              <p className="text-[11px] text-slate-400">
                {lang === 'en' ? 'Instant LPA QR code & profile download' : '自动化生成 LPA 二维码即扫即用'}
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl space-y-1 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400 font-mono">
                <Zap className="h-4 w-4" />
                <span>{lang === 'en' ? 'Omni Checkout' : '全通道支付'}</span>
              </div>
              <p className="text-[11px] text-slate-400">
                {lang === 'en' ? 'Apple Pay, Card, WeChat, Alipay, Crypto' : '微信、支付宝、信用卡与加密货币'}
              </p>
            </div>
          </motion.div>

          {/* CTA Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="flex flex-wrap items-center gap-3 pt-2"
          >
            <button
              onClick={onExploreClick}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold font-mono transition-all shadow-xl shadow-blue-600/30 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Globe2 className="h-4 w-4" />
              <span>{lang === 'en' ? 'BROWSE 200+ ESIM PACKAGES' : '选购全球 200+ 国家套餐'}</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={onOpenCompatibility}
              className="px-5 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold font-mono transition-all flex items-center gap-2 cursor-pointer"
            >
              <Cpu className="h-4 w-4 text-cyan-400" />
              <span>{lang === 'en' ? 'CHECK DEVICE COMPATIBILITY' : '检测手机机型支持'}</span>
            </button>
          </motion.div>
        </div>

        {/* Right Column: Interactive Live Telecom Telemetry HUD (5 cols) */}
        <div className="lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-slate-950/90 border border-blue-500/30 rounded-3xl p-5 shadow-2xl relative overflow-hidden space-y-4"
          >
            {/* Top Scanning Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-mono font-bold text-white tracking-wider">
                  TELECOM NOC TELEMETRY
                </span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                LIVE FEED #{pulseCount}
              </span>
            </div>

            {/* Active Node Live Spotlight */}
            <div className="bg-gradient-to-r from-blue-950/60 via-slate-900/80 to-indigo-950/60 border border-blue-500/40 rounded-2xl p-4 space-y-3 relative">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-blue-400 font-mono font-semibold uppercase">Active Node Backbone</span>
                  <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                    <span>{activeNode.city}</span>
                    <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-mono">
                      {activeNode.code}
                    </span>
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-mono">Latency</span>
                  <div className="text-lg font-extrabold text-emerald-400 font-mono flex items-center justify-end gap-1">
                    <Signal className="h-4 w-4" />
                    {activeNode.ping} ms
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1 border-t border-slate-800/80">
                <div>
                  <span className="text-slate-500 block">Carrier Partner</span>
                  <span className="text-slate-200 font-semibold">{activeNode.isp}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Routing Signature</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    {activeNode.ip}
                  </span>
                </div>
              </div>
            </div>

            {/* Global Node Matrix List */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono text-slate-400 flex justify-between px-1">
                <span>GLOBAL POP NODES</span>
                <span>STATUS / PING</span>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {telemetry.map((node, i) => (
                  <button
                    key={node.code}
                    onClick={() => setActiveNodeIndex(i)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                      activeNodeIndex === i
                        ? 'bg-blue-600/30 border border-blue-500/50 text-white shadow-xs'
                        : 'bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          activeNodeIndex === i ? 'bg-cyan-400 animate-ping' : 'bg-emerald-500'
                        }`}
                      />
                      <span className="font-bold text-white">{node.code}</span>
                      <span className="text-slate-400 text-[11px] truncate max-w-[120px]">{node.city.split(' ')[0]}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-emerald-400">{node.ping}ms</span>
                      <span className="text-[9px] px-1 rounded bg-slate-800 text-slate-400">5G OK</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Mini HUD Status Footer */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <div className="flex items-center gap-1.5">
                <Lock className="h-3 w-3 text-cyan-400" />
                <span>TLS 1.3 GSMA ENCRYPTION</span>
              </div>
              <span className="text-emerald-400 font-bold">100% SLA PASS</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
