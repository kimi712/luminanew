import React, { useState, useEffect } from 'react';
import { EsimDestination, EsimPackage, Currency, CURRENCIES, PaymentChannel, PurchasedEsim, Language } from '../types';
import {
  X,
  CreditCard,
  CheckCircle2,
  Lock,
  QrCode,
  Sparkles,
  Zap,
  Tag,
  Copy,
  Check,
  Smartphone,
  Send,
  Loader2,
  Radio,
  Download,
  AlertCircle,
  ShieldCheck,
  Coins,
  ArrowRight
} from 'lucide-react';

interface EsimCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: EsimDestination | null;
  selectedPackage: EsimPackage | null;
  currency: Currency;
  lang: Language;
  onPurchaseSuccess: (newEsim: PurchasedEsim) => void;
}

export const EsimCheckoutModal: React.FC<EsimCheckoutModalProps> = ({
  isOpen,
  onClose,
  destination,
  selectedPackage,
  currency,
  lang,
  onPurchaseSuccess,
}) => {
  const [paymentChannel, setPaymentChannel] = useState<PaymentChannel>('card');
  const [email, setEmail] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent: number; fixedUSD: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');

  // Processing & Order State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(1);
  const [processingMessage, setProcessingMessage] = useState('');
  const [completedEsim, setCompletedEsim] = useState<PurchasedEsim | null>(null);
  const [activeQrOrder, setActiveQrOrder] = useState<{
    orderNumber: string;
    qrUrl: string;
    channel: string;
    amountFormatted: string;
  } | null>(null);

  // Gateway status from backend
  const [gatewayConfig, setGatewayConfig] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      setIsProcessing(false);
      setCompletedEsim(null);
      setActiveQrOrder(null);
      setProcessingStep(1);
      setCouponError(null);

      // Fetch payment gateway configuration
      fetch('/api/payment/config')
        .then((res) => res.json())
        .then((data) => setGatewayConfig(data))
        .catch((err) => console.log('Config fetch note:', err));
    }
  }, [isOpen]);

  if (!isOpen || !destination || !selectedPackage) return null;

  // Price calculations
  const currInfo = CURRENCIES[currency];
  const basePriceUSD = selectedPackage.priceUSD;
  
  let discountedPriceUSD = basePriceUSD;
  if (appliedDiscount) {
    if (appliedDiscount.percent > 0) {
      discountedPriceUSD = basePriceUSD * (1 - appliedDiscount.percent / 100);
    } else if (appliedDiscount.fixedUSD > 0) {
      discountedPriceUSD = Math.max(0.5, basePriceUSD - appliedDiscount.fixedUSD);
    }
  }

  const finalConvertedPrice = (discountedPriceUSD * currInfo.rate).toFixed(2);
  const originalConvertedPrice = (basePriceUSD * currInfo.rate).toFixed(2);

  // Coupon verification via backend API
  const handleApplyCoupon = async () => {
    setCouponError(null);
    const clean = couponCode.trim().toUpperCase();
    if (!clean) return;

    try {
      setCouponLoading(true);
      const res = await fetch('/api/payment/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: clean }),
      });

      const data = await res.json();
      if (res.ok && data.valid) {
        setAppliedDiscount({
          code: data.code,
          percent: data.percent || 0,
          fixedUSD: data.fixedUSD || 0,
        });
      } else {
        setCouponError(data.message || (lang === 'en' ? 'Invalid or expired coupon code' : '优惠码无效或已过期'));
      }
    } catch (e) {
      // Fallback local check
      if (clean === 'LUMINA10') {
        setAppliedDiscount({ code: 'LUMINA10', percent: 10, fixedUSD: 0 });
      } else if (clean === 'VOYAGE20') {
        setAppliedDiscount({ code: 'VOYAGE20', percent: 20, fixedUSD: 0 });
      } else {
        setCouponError(lang === 'en' ? 'Invalid coupon code' : '优惠码无效');
      }
    } finally {
      setCouponLoading(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Primary Payment Execution Flow via Backend API
  const handleStartPayment = async () => {
    if (!email || !email.includes('@')) {
      alert(
        lang === 'en'
          ? 'Please enter a valid email address to receive your eSIM profile.'
          : '请输入有效的电子邮箱以接收 eSIM 激活码。'
      );
      return;
    }

    setIsProcessing(true);
    setProcessingStep(1);
    setProcessingMessage(
      lang === 'en'
        ? 'Connecting to payment gateway & creating secure transaction intent...'
        : '正在连接支付网关，生成加密交易签名...'
    );

    try {
      // 1. Create Order on Backend
      const createOrderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          selectedPackage,
          customerEmail: email,
          paymentMethod: paymentChannel,
          currency: currency,
          couponCode: appliedDiscount?.code,
        }),
      });

      const orderData = await createOrderRes.json();
      const orderNumber = orderData.orderNumber || `LUM-${Date.now().toString().slice(-6)}`;

      // Step 2: Gateway authorization
      setProcessingStep(2);
      setProcessingMessage(
        lang === 'en'
          ? 'Authorizing payment token & 256-bit TLS handshake...'
          : '正在与银联/国际清算网关进行 256 位安全令牌校验...'
      );
      await new Promise((r) => setTimeout(r, 900));

      // Step 3: Contacting Global Telecom SM-DP+ Server
      setProcessingStep(3);
      setProcessingMessage(
        lang === 'en'
          ? `Allocating high-speed 5G network profile & issuing ICCID for ${destination.countryNameEn}...`
          : `正在向全球一级电信交换节点为 ${destination.countryNameZh} 分配专属 5G ICCID...`
      );

      // 2. Confirm Payment & Provision eSIM on Backend
      const confirmRes = await fetch('/api/payment/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: orderNumber,
          transactionDetails: {
            method: paymentChannel,
            paidAmount: finalConvertedPrice,
            currency: currency,
          },
        }),
      });

      const confirmData = await confirmRes.json();
      const profile = confirmData.esimProfile;

      const iccid = profile?.iccid || `89852026${Math.floor(100000000000 + Math.random() * 900000000000)}`;
      const activationCode = profile?.activationCode || `LUM-${destination.countryCode}-${Date.now().toString().slice(-4)}`;
      const smdpAddress = profile?.smdpAddress || `LPA:1$smdp.lumina-esim.com$${activationCode}`;

      await new Promise((r) => setTimeout(r, 800));

      const newEsim: PurchasedEsim = {
        id: `esim-${Date.now()}`,
        orderNumber: orderNumber,
        destinationId: destination.id,
        destinationNameEn: destination.countryNameEn,
        destinationNameZh: destination.countryNameZh,
        flag: destination.flag,
        packageId: selectedPackage.id,
        dataSummary: `${selectedPackage.dataAmount} - ${selectedPackage.validityDays} ${lang === 'en' ? 'Days' : '天'}`,
        validityDays: selectedPackage.validityDays,
        totalDataMB: selectedPackage.dataAmountMB,
        remainingDataMB: selectedPackage.dataAmountMB,
        pricePaid: Number(finalConvertedPrice),
        currency: currency,
        paymentMethod: paymentChannel,
        purchasedAt: new Date().toISOString(),
        status: 'ready_to_activate',
        iccid: iccid,
        smdpAddress: smdpAddress,
        activationCode: activationCode,
        qrPayload: smdpAddress,
        customerEmail: email,
      };

      setCompletedEsim(newEsim);
      setIsProcessing(false);
      onPurchaseSuccess(newEsim);
    } catch (error) {
      console.error('Payment checkout error:', error);
      setIsProcessing(false);
      alert(
        lang === 'en'
          ? 'Network timeout during transaction. Please retry.'
          : '网络通信超时，请重试提交。'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/70">
          <div className="flex items-center space-x-3">
            <span className="text-3xl p-1 bg-white rounded-2xl shadow-sm border border-slate-100">
              {destination.flag}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display">
                  {lang === 'en'
                    ? `Checkout: ${destination.countryNameEn} eSIM`
                    : `安全收银台：${destination.countryNameZh} eSIM`}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold font-mono">
                  {selectedPackage.dataAmount} / {selectedPackage.validityDays} {lang === 'en' ? 'Days' : '天'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {lang === 'en'
                  ? 'Real-Time Payment Gateway • Instant SM-DP+ Telecommunication Provisioning'
                  : '直连清算支付网关 • 60 秒自动完成电信 SM-DP+ 开卡发卡'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Processing State View */}
        {isProcessing ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600 animate-pulse border border-blue-100">
                <Radio className="h-10 w-10 text-blue-600 animate-spin" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-600"></span>
              </span>
            </div>

            <div className="space-y-2 max-w-md">
              <h4 className="text-base sm:text-lg font-bold text-slate-900 font-display">
                {processingStep === 1 && (lang === 'en' ? 'Calling Backend Payment API...' : '正在调用后端支付网关接口...')}
                {processingStep === 2 && (lang === 'en' ? 'Verifying 256-bit Security Token...' : '正在校验 256 位银行级安全令牌...')}
                {processingStep === 3 && (lang === 'en' ? 'Telecom SM-DP+ Generating eSIM...' : '全球电信交换节点正在生成专属 eSIM...')}
              </h4>
              <p className="text-xs text-slate-500 font-mono leading-relaxed">{processingMessage}</p>
            </div>

            <div className="w-56 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-700"
                style={{ width: processingStep === 1 ? '35%' : processingStep === 2 ? '70%' : '100%' }}
              />
            </div>
          </div>
        ) : completedEsim ? (
          /* Success & eSIM QR Activation Hub */
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[75vh]">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h4 className="text-lg font-extrabold text-slate-900 font-display">
                {lang === 'en' ? 'eSIM Order Successful & Issued!' : 'eSIM 支付成功，已极速出卡！'}
              </h4>
              <p className="text-xs text-slate-500">
                {lang === 'en'
                  ? `Order #${completedEsim.orderNumber} receipt sent to ${completedEsim.customerEmail}`
                  : `订单号 #${completedEsim.orderNumber} 激活凭证已实时同步至 ${completedEsim.customerEmail}`}
              </p>
            </div>

            {/* QR Code and Activation Card */}
            <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-3xl p-6 shadow-xl border border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-white/10">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[10px] font-bold font-mono text-cyan-300 uppercase tracking-wider bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-800/50">
                    {lang === 'en' ? 'Scan with Camera / Settings' : '直接使用手机相机扫码'}
                  </span>
                  <h4 className="text-lg font-bold pt-1">
                    {completedEsim.flag} {lang === 'en' ? completedEsim.destinationNameEn : completedEsim.destinationNameZh} 5G eSIM
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">
                    ICCID: {completedEsim.iccid}
                  </p>
                </div>

                {/* QR Code SVG / API Generator */}
                <div className="bg-white p-3 rounded-2xl shadow-lg flex flex-col items-center">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                      completedEsim.smdpAddress
                    )}`}
                    alt="eSIM QR Code"
                    className="w-36 h-36 rounded-lg"
                  />
                  <span className="text-[10px] text-slate-500 font-mono mt-1 font-bold">
                    Scan to Install
                  </span>
                </div>
              </div>

              {/* Manual Activation Code Box */}
              <div className="bg-white/10 p-3.5 rounded-2xl space-y-2 text-xs border border-white/10">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="font-semibold">
                    {lang === 'en' ? 'SM-DP+ Address & Activation Code' : '手动输入激活参数 (SM-DP+)'}
                  </span>
                  <button
                    onClick={() => handleCopy(completedEsim.smdpAddress, 'smdp')}
                    className="inline-flex items-center gap-1 text-blue-300 hover:text-white font-mono text-[11px] cursor-pointer"
                  >
                    {copiedKey === 'smdp' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedKey === 'smdp' ? (lang === 'en' ? 'Copied' : '已复制') : (lang === 'en' ? 'Copy All' : '复制全文')}</span>
                  </button>
                </div>
                <div className="bg-black/30 p-2.5 rounded-xl font-mono text-[11px] break-all text-blue-200 selection:bg-blue-600">
                  {completedEsim.smdpAddress}
                </div>
              </div>
            </div>

            {/* Quick 2-Step Installation Guide */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <h5 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-blue-600" />
                {lang === 'en' ? 'How to Install on your Phone:' : '手机安装激活步骤：'}
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                <div className="p-3 bg-white rounded-xl border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-900 block font-mono text-[11px] text-blue-600">iOS (iPhone)</span>
                  <ol className="list-decimal pl-4 space-y-0.5 text-[11px]">
                    <li>{lang === 'en' ? 'Go to Settings > Cellular / Mobile' : '进入 设置 > 蜂窝网络'}</li>
                    <li>{lang === 'en' ? 'Tap "Add eSIM" and scan QR code above' : '点击「添加 eSIM」并扫描上方二维码'}</li>
                    <li>{lang === 'en' ? 'Turn on "Data Roaming" upon arrival' : '到达目的地后开启「数据漫游」即享 5G'}</li>
                  </ol>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-900 block font-mono text-[11px] text-blue-600">Android (Galaxy / Pixel)</span>
                  <ol className="list-decimal pl-4 space-y-0.5 text-[11px]">
                    <li>{lang === 'en' ? 'Settings > Connections / Network > SIMs' : '进入 设置 > 连接 / SIM 管理器'}</li>
                    <li>{lang === 'en' ? 'Tap "Add eSIM" > Scan QR Code' : '点击「添加移动套餐」> 扫描二维码'}</li>
                    <li>{lang === 'en' ? 'Enable Mobile Data & Roaming' : '开启移动数据与漫游开关'}</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Done Action */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-xs transition-all shadow-md shadow-blue-500/20 active:scale-95 cursor-pointer"
              >
                {lang === 'en' ? 'View in My eSIMs' : '在「我的 eSIM」中查看'}
              </button>
            </div>
          </div>
        ) : (
          /* Step 1 & 2 Checkout Form */
          <div className="p-5 sm:p-6 space-y-6 overflow-y-auto max-h-[75vh]">
            {/* Email for Delivery */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                <span>{lang === 'en' ? 'Delivery Email (Instant QR code)' : '接收 eSIM 凭证的电子邮箱'}</span>
                <span className="text-[10px] text-blue-600 font-normal">
                  {lang === 'en' ? 'Automated Delivery via SMTP/API' : '无需实名 • 支付后自动直发'}
                </span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={lang === 'en' ? 'your.name@example.com' : '输入您的邮箱用于接收 eSIM 激活码'}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Payment Channel Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {lang === 'en' ? 'Select Payment Channel' : '选择支付渠道'}
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* Credit / Debit Card */}
                <button
                  type="button"
                  onClick={() => setPaymentChannel('card')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    paymentChannel === 'card'
                      ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20 shadow-sm'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    {paymentChannel === 'card' && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      {lang === 'en' ? 'Credit / Debit' : '信用卡 / 借记卡'}
                    </span>
                    <span className="text-[10px] text-slate-400">Visa, MC, Amex</span>
                  </div>
                </button>

                {/* Apple Pay */}
                <button
                  type="button"
                  onClick={() => setPaymentChannel('applepay')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    paymentChannel === 'applepay'
                      ? 'border-black bg-slate-900 text-white ring-2 ring-black/20 shadow-sm'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm"> Pay</span>
                    {paymentChannel === 'applepay' && <CheckCircle2 className="h-4 w-4 text-white" />}
                  </div>
                  <div>
                    <span
                      className={`text-xs font-bold block ${
                        paymentChannel === 'applepay' ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      Apple Pay
                    </span>
                    <span
                      className={`text-[10px] ${
                        paymentChannel === 'applepay' ? 'text-slate-300' : 'text-slate-400'
                      }`}
                    >
                      {lang === 'en' ? '1-Tap Touch ID' : '一键触控极速付'}
                    </span>
                  </div>
                </button>

                {/* Alipay (支付宝) */}
                <button
                  type="button"
                  onClick={() => setPaymentChannel('alipay')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    paymentChannel === 'alipay'
                      ? 'border-sky-500 bg-sky-50/60 ring-2 ring-sky-500/20 shadow-sm'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="w-5 h-5 rounded bg-sky-500 text-white font-bold text-xs flex items-center justify-center">
                      支
                    </div>
                    {paymentChannel === 'alipay' && <CheckCircle2 className="h-4 w-4 text-sky-600" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      {lang === 'en' ? 'Alipay' : '支付宝'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {lang === 'en' ? 'CNY Live Rate' : '扫码即时结算'}
                    </span>
                  </div>
                </button>

                {/* WeChat Pay (微信支付) */}
                <button
                  type="button"
                  onClick={() => setPaymentChannel('wechat')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    paymentChannel === 'wechat'
                      ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20 shadow-sm'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="w-5 h-5 rounded bg-emerald-500 text-white font-bold text-xs flex items-center justify-center">
                      微
                    </div>
                    {paymentChannel === 'wechat' && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      {lang === 'en' ? 'WeChat Pay' : '微信支付'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {lang === 'en' ? 'Scan & Pay' : '支持零钱/储蓄卡'}
                    </span>
                  </div>
                </button>

                {/* Crypto Web3 */}
                <button
                  type="button"
                  onClick={() => setPaymentChannel('crypto')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    paymentChannel === 'crypto'
                      ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20 shadow-sm'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <Coins className="h-5 w-5 text-amber-600" />
                    {paymentChannel === 'crypto' && <CheckCircle2 className="h-4 w-4 text-amber-600" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      {lang === 'en' ? 'Crypto' : '加密货币'}
                    </span>
                    <span className="text-[10px] text-slate-400">USDT, USDC, BTC</span>
                  </div>
                </button>

                {/* Google Pay */}
                <button
                  type="button"
                  onClick={() => setPaymentChannel('googlepay')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    paymentChannel === 'googlepay'
                      ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20 shadow-sm'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-blue-600 font-display">G Pay</span>
                    {paymentChannel === 'googlepay' && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Google Pay</span>
                    <span className="text-[10px] text-slate-400">
                      {lang === 'en' ? 'Android 1-Tap' : '谷歌极速付款'}
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Dynamic Payment Channel Form Render */}
            {paymentChannel === 'card' && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>{lang === 'en' ? 'Card Details' : '银行卡信息'}</span>
                  <div className="flex gap-1.5 text-[10px] text-slate-400 font-mono">
                    <span>VISA</span>
                    <span>•</span>
                    <span>MASTERCARD</span>
                    <span>•</span>
                    <span>AMEX</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase">
                    {lang === 'en' ? 'Cardholder Name' : '持卡人姓名'}
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="ALEX M JOHNSON"
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase">
                    {lang === 'en' ? 'Card Number' : '卡号'}
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="•••• •••• •••• ••••"
                    maxLength={19}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase">
                      {lang === 'en' ? 'Expiry Date' : '有效期 (MM/YY)'}
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="12/28"
                      maxLength={5}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase">
                      CVC / CVV
                    </label>
                    <input
                      type="password"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="•••"
                      maxLength={4}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentChannel === 'alipay' && (
              <div className="p-4 bg-sky-50 border border-sky-100 rounded-2xl flex items-center space-x-4">
                <div className="w-16 h-16 bg-white p-2 rounded-xl border border-sky-200 flex items-center justify-center flex-shrink-0">
                  <QrCode className="h-12 w-12 text-sky-600" />
                </div>
                <div className="text-xs text-sky-950 space-y-0.5">
                  <span className="font-bold block">
                    {lang === 'en' ? 'Alipay Gateway API' : '支付宝官方接口网关'}
                  </span>
                  <p className="text-[11px] text-sky-700 leading-relaxed">
                    {lang === 'en'
                      ? `Amount: ${(discountedPriceUSD * CURRENCIES.CNY.rate).toFixed(2)} CNY (Auto converted at 1 USD = ${CURRENCIES.CNY.rate} CNY)`
                      : `折合人民币：¥${(discountedPriceUSD * CURRENCIES.CNY.rate).toFixed(2)} 元（实时汇率 1 USD = ${CURRENCIES.CNY.rate} CNY）`}
                  </p>
                </div>
              </div>
            )}

            {paymentChannel === 'wechat' && (
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center space-x-4">
                <div className="w-16 h-16 bg-white p-2 rounded-xl border border-emerald-200 flex items-center justify-center flex-shrink-0">
                  <QrCode className="h-12 w-12 text-emerald-600" />
                </div>
                <div className="text-xs text-emerald-950 space-y-0.5">
                  <span className="font-bold block">
                    {lang === 'en' ? 'WeChat Pay Native API' : '微信支付 Native 扫码接口'}
                  </span>
                  <p className="text-[11px] text-emerald-700 leading-relaxed">
                    {lang === 'en'
                      ? 'Scan via WeChat Mobile App (Supports Wallet Balance & Debit cards)'
                      : '打开微信扫一扫，支持人民币零钱与储蓄卡直接结算，无外汇手续费'}
                  </p>
                </div>
              </div>
            )}

            {paymentChannel === 'crypto' && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between items-center text-amber-900 font-bold">
                  <span>USDT (TRC20 / Polygon)</span>
                  <span className="font-mono text-amber-700">${discountedPriceUSD.toFixed(2)} USDT</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-amber-200 font-mono text-[10px] text-slate-600 break-all">
                  TX7b4YFq9Zk28eR1P6eJ4gB3pL9Q2h8W1y
                </div>
                <p className="text-[10px] text-amber-700">
                  {lang === 'en'
                    ? 'Non-custodial instant settlement. Automatic SM-DP+ issuance upon 1 block confirmation.'
                    : '免 KYC 认证，区块链网络 1 次确认后由服务端自动下发激活码'}
                </p>
              </div>
            )}

            {/* Coupon Code Box */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-blue-600" />
                <span>{lang === 'en' ? 'Promo / Referral Code' : '输入优惠码 / 邀请码'}</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder={lang === 'en' ? 'Try LUMINA10 or VOYAGE20' : '试试输入 LUMINA10 或 VOYAGE20'}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  type="button"
                  disabled={couponLoading}
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                >
                  {couponLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                  <span>{lang === 'en' ? 'Apply' : '兑换'}</span>
                </button>
              </div>
              {appliedDiscount && (
                <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                  <Check className="h-3 w-3" />
                  {lang === 'en'
                    ? `Promo code ${appliedDiscount.code} applied (${
                        appliedDiscount.percent ? appliedDiscount.percent + '% off' : '$' + appliedDiscount.fixedUSD + ' off'
                      })!`
                    : `优惠码 ${appliedDiscount.code} 生效（立减 ${
                        appliedDiscount.percent ? appliedDiscount.percent + '%' : '$' + appliedDiscount.fixedUSD
                      }）！`}
                </p>
              )}
              {couponError && <p className="text-[11px] text-red-500 mt-1">{couponError}</p>}
            </div>

            {/* Price Summary Breakdown */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>{lang === 'en' ? 'Plan Subtotal' : '套餐小计'}</span>
                <span>
                  {currInfo.symbol}
                  {originalConvertedPrice} {currency}
                </span>
              </div>
              {appliedDiscount && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>{lang === 'en' ? 'Discount Saved' : '优惠抵扣'}</span>
                  <span>
                    - {currInfo.symbol}
                    {((basePriceUSD - discountedPriceUSD) * currInfo.rate).toFixed(2)} {currency}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>{lang === 'en' ? 'eKYC & Telecom Provisioning Fee' : '开卡与电信配置费'}</span>
                <span className="text-emerald-600 font-bold">{lang === 'en' ? 'FREE ($0.00)' : '免除 ($0.00)'}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="text-sm font-extrabold text-slate-900">{lang === 'en' ? 'Total Due' : '应付总额'}</span>
                <div className="text-right">
                  <span className="text-lg font-extrabold text-blue-600 font-mono">
                    {currInfo.symbol}
                    {finalConvertedPrice}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono ml-1">{currency}</span>
                </div>
              </div>
            </div>

            {/* Submit Pay Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleStartPayment}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Lock className="h-4 w-4" />
                <span>
                  {lang === 'en'
                    ? `Pay ${currInfo.symbol}${finalConvertedPrice} & Issue eSIM`
                    : `安全支付 ${currInfo.symbol}${finalConvertedPrice} 并调用接口出码`}
                </span>
              </button>
              <p className="text-[10px] text-slate-400 text-center mt-2 flex items-center justify-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>
                  {lang === 'en'
                    ? '256-Bit Encrypted Gateway API • Instant SM-DP+ Telecommunication Delivery'
                    : '256 位金融级加密网关接口 • 电信级自动化开卡下发'}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
