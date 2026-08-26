import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  FileText,
  Lock,
  Headphones,
  Award,
  Globe2,
  Mail,
  MapPin,
  Clock,
  PhoneCall,
  CheckCircle2,
  Send,
  Sparkles,
  Zap,
  Radio,
  Server,
  Layers,
} from 'lucide-react';
import { Language } from '../types';
import { LegalModalType } from './FooterLegal';

interface LegalModalProps {
  type: LegalModalType;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  type,
  isOpen,
  onClose,
  lang,
}) => {
  // Contact Form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('Order & eSIM Delivery');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen || !type) return null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedSuccess(true);
      setTimeout(() => {
        setSubmittedSuccess(false);
        onClose();
      }, 3000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 text-slate-100 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              {type === 'about' && <Award className="h-5 w-5" />}
              {type === 'contact' && <Headphones className="h-5 w-5" />}
              {type === 'terms' && <FileText className="h-5 w-5" />}
              {type === 'privacy' && <ShieldCheck className="h-5 w-5" />}
              {type === 'refund' && <Lock className="h-5 w-5" />}
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white font-display">
                {type === 'about' && (lang === 'en' ? 'About Lumina Global' : '关于 Lumina Global')}
                {type === 'contact' && (lang === 'en' ? 'Contact Global Support' : '联系我们 (24/7 客服)')}
                {type === 'terms' && (lang === 'en' ? 'Terms of Service' : '服务条款 (Terms of Service)')}
                {type === 'privacy' && (lang === 'en' ? 'Privacy & Data Protection' : '隐私与数据安全条款')}
                {type === 'refund' && (lang === 'en' ? 'Refund & SLA Policy' : '退款保障与 SLA 政策')}
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                {type === 'about' && 'DIGITAL CROSS-BORDER TRAVEL & TELECOM PLATFORM'}
                {type === 'contact' && 'TIER-1 TELECOM NOC & ENTERPRISE TICKETING'}
                {type === 'terms' && 'GLOBAL TELECOMMUNICATION ACCESS AGREEMENT'}
                {type === 'privacy' && 'GDPR & CCPA COMPLIANT DATA PROTECTION'}
                {type === 'refund' && '100% DELIVERY GUARANTEE & SERVICE SLA'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-sm text-slate-300 leading-relaxed">
          {/* ===================== ABOUT US ===================== */}
          {type === 'about' && (
            <div className="space-y-6">
              {/* Highlight Mission Quote */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/80 to-indigo-950/80 border border-blue-500/30 text-slate-100">
                <p className="text-sm font-medium leading-relaxed">
                  <strong className="text-blue-300 font-bold">Lumina Global operates a digital cross-border travel platform</strong> providing instant high-speed travel eSIM data packages and travel optimization tools for international travelers across 200+ countries.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Globe2 className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase font-mono">200+ Destinations</h4>
                  <p className="text-xs text-slate-400">
                    Direct interconnect agreements with tier-1 telecom giants across Americas, Europe, and Asia Pacific.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase font-mono">Clean Native IP</h4>
                  <p className="text-xs text-slate-400">
                    100% clean residential ISP routing tailored for US cardholders & banking fraud risk elimination.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Zap className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase font-mono">Instant Provisioning</h4>
                  <p className="text-xs text-slate-400">
                    Sub-5-second SM-DP+ eSIM profile delivery with universal Apple Pay, Card, WeChat, Alipay & Crypto support.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-bold text-white font-display">
                  {lang === 'en' ? 'Our Core Vision' : '我们的愿景与使命'}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {lang === 'en'
                    ? 'Born out of the frustration of physical SIM swaps, predatory airport roaming fees, and dirty datacenter VPN bans while attempting to manage overseas banking, Lumina Global bridges the gap between global telecommunications and smart financial mobility.'
                    : '传统国际漫游费用高昂，插拔实体卡繁琐易失，而普通 VPN 节点常因机房脏 IP 导致海外银行账户、Apple ID 及出海业务被封控。Lumina Global 应运而生，深度打通全球一级电信运营商，为全球常旅客与美卡玩家提供即买即用、纯净高速的数字化出海基础设施。'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-slate-400">Headquarters: San Francisco, CA & Global Remote NOC</span>
                <span className="font-mono text-blue-400">SOC2 & GSMA Compliant</span>
              </div>
            </div>
          )}

          {/* ===================== CONTACT US ===================== */}
          {type === 'contact' && (
            <div className="space-y-6">
              {submittedSuccess ? (
                <div className="p-8 rounded-3xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-white font-display">
                    {lang === 'en' ? 'Message Dispatched Successfully!' : '工单已提交成功！'}
                  </h3>
                  <p className="text-xs text-emerald-200 max-w-md mx-auto">
                    {lang === 'en'
                      ? 'Our 24/7 telecom support engineers have received your inquiry. A ticket response will be sent to your email within 15 minutes.'
                      : '我们的 24/7 全球网络运维中心已接收您的工单，工程师将在 15 分钟内通过邮件回复您。'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Contact Info Cards (5 cols) */}
                  <div className="lg:col-span-5 space-y-3">
                    <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-white">
                        <Mail className="h-4 w-4 text-blue-400" />
                        <span>Email Support</span>
                      </div>
                      <p className="text-xs text-blue-300 font-mono">support@lumina-global.io</p>
                      <p className="text-[11px] text-slate-400">Average response time: &lt; 15 mins</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-white">
                        <Headphones className="h-4 w-4 text-emerald-400" />
                        <span>Live Telecom NOC</span>
                      </div>
                      <p className="text-xs text-slate-300 font-mono">24/7/365 Continuous Coverage</p>
                      <p className="text-[11px] text-slate-400">ICCID provisioning & manual top-ups</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-white">
                        <MapPin className="h-4 w-4 text-purple-400" />
                        <span>Global Dispatch</span>
                      </div>
                      <p className="text-xs text-slate-400">North America • Europe • Asia Pacific</p>
                    </div>
                  </div>

                  {/* Form (7 cols) */}
                  <form onSubmit={handleContactSubmit} className="lg:col-span-7 space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">
                          {lang === 'en' ? 'Your Name' : '您的称呼'}
                        </label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Alex Morgan"
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">
                          {lang === 'en' ? 'Email Address' : '电子邮箱'}
                        </label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="alex@traveler.com"
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        {lang === 'en' ? 'Subject Category' : '咨询类别'}
                      </label>
                      <select
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                      >
                        <option value="Order & eSIM Delivery">Order & eSIM Delivery (订单与发卡)</option>
                        <option value="APN & Device Configuration">APN & Device Setup (APN与机型设置)</option>
                        <option value="Clean IP & US Card Banking">Clean IP & US Card Banking (美卡与纯净IP)</option>
                        <option value="Bulk & Corporate Inquiries">Bulk & Corporate Inquiries (企业与大客户)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        {lang === 'en' ? 'Message or ICCID Details' : '详细内容或 ICCID 订单号'}
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder={
                          lang === 'en'
                            ? 'Please describe your request or include your order number (e.g. LUM-884291)...'
                            : '请简要说明您的需求，如已购买请附上订单号（如 LUM-884291）...'
                        }
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span>{lang === 'en' ? 'Transmitting to NOC...' : '正在提交至运维中心...'}</span>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" />
                          <span>{lang === 'en' ? 'Send Priority Inquiry' : '发送优先服务工单'}</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ===================== TERMS OF SERVICE ===================== */}
          {type === 'terms' && (
            <div className="space-y-4 text-xs leading-relaxed text-slate-300">
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-slate-200">
                <p className="font-semibold text-white">1. Service Provision & SM-DP+ Profile Delivery</p>
                <p className="mt-1">
                  Lumina Global provides digital eSIM data profiles via remote SIM provisioning (GSMA RSP architecture). Upon successful payment authorization, LPA activation codes and QR codes are generated instantly.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-slate-200">
                <p className="font-semibold text-white">2. Device Compatibility & Unlocked Status</p>
                <p className="mt-1">
                  The user agrees to ensure their hardware device is carrier-unlocked and supports eSIM technology prior to purchase. Please use our built-in Device Compatibility Checker tool.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-slate-200">
                <p className="font-semibold text-white">3. Network Access & Acceptable Use</p>
                <p className="mt-1">
                  All telecommunication data packages are intended for legitimate international travel, business communication, and lawful cross-border digital activities. Malicious network abuse or spam distribution is strictly prohibited.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-slate-200">
                <p className="font-semibold text-white">4. Validity & Data Expiration</p>
                <p className="mt-1">
                  Package validity starts either upon first network handshake with destination local towers or upon manual profile installation, as detailed in the specific product package specifications.
                </p>
              </div>
            </div>
          )}

          {/* ===================== PRIVACY POLICY ===================== */}
          {type === 'privacy' && (
            <div className="space-y-4 text-xs leading-relaxed text-slate-300">
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-slate-200">
                <p className="font-semibold text-white">1. Zero KYC by Design</p>
                <p className="mt-1">
                  We believe in minimal data retention. Most of our international travel eSIM packages do not require real-name identity uploads, passports, or facial recognition scans.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-slate-200">
                <p className="font-semibold text-white">2. Payment Security & Encryption</p>
                <p className="mt-1">
                  All financial transactions (Apple Pay, Credit Cards, WeChat, Alipay, Crypto) are encrypted via PCI-DSS Level 1 compliant gateway protocols. Lumina Global never stores raw card security codes or private keys.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-slate-200">
                <p className="font-semibold text-white">3. Telecommunication Traffic Privacy</p>
                <p className="mt-1">
                  Lumina Global does not inspect, log, or sell browsing habits, user payloads, or application telemetry. Data routing is directly handled by tier-1 telecom interconnect agreements.
                </p>
              </div>
            </div>
          )}

          {/* ===================== REFUND SLA ===================== */}
          {type === 'refund' && (
            <div className="space-y-4 text-xs leading-relaxed text-slate-300">
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-100">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  100% Unactivated Profile Refund Guarantee
                </p>
                <p className="mt-1 text-emerald-200 text-xs">
                  If an eSIM QR code has never been scanned or installed on any device, customers are eligible for a 100% full refund within 30 days of purchase without penalty.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-slate-200">
                <p className="font-semibold text-white">Network Failure SLA Compensation</p>
                <p className="mt-1">
                  In the rare event that a verified destination local network outage prevents connectivity and our 24/7 NOC cannot resolve the issue within 2 hours, a replacement profile or pro-rata credit will be issued immediately.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex justify-between items-center text-xs">
          <span className="text-slate-400 font-mono">Lumina Global Legal Trust Center • v2.6</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all cursor-pointer"
          >
            {lang === 'en' ? 'Close Window' : '关闭窗口'}
          </button>
        </div>
      </div>
    </div>
  );
};
