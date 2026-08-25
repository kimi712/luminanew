import React, { useState } from 'react';
import { PurchasedEsim, Language } from '../types';
import {
  QrCode,
  Smartphone,
  Signal,
  CheckCircle,
  Copy,
  Check,
  RotateCw,
  PlusCircle,
  Wifi,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ShieldCheck,
  Share2
} from 'lucide-react';

interface MyEsimsProps {
  esims: PurchasedEsim[];
  lang: Language;
  onGoToStore: () => void;
  onTopUp: (esim: PurchasedEsim) => void;
}

export const MyEsims: React.FC<MyEsimsProps> = ({ esims, lang, onGoToStore, onTopUp }) => {
  const [selectedQrEsim, setSelectedQrEsim] = useState<PurchasedEsim | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-bold text-slate-900 font-display">
              {lang === 'en' ? 'My Active eSIMs & Travel Passes' : '我的 eSIM 凭证与漫游卡包'}
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold font-mono">
              {esims.length} {lang === 'en' ? 'Active' : '有效'}
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-xl">
            {lang === 'en'
              ? 'Manage your travel profiles, check real-time high-speed data balances, access activation QR codes, or top up.'
              : '管理您的旅行 eSIM 配置文件、查看剩余高速流量余额、随时调取二维码或一键充值。'}
          </p>
        </div>

        <button
          onClick={onGoToStore}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-blue-500/10 active:scale-95 flex items-center space-x-2 cursor-pointer flex-shrink-0"
        >
          <PlusCircle className="h-4 w-4" />
          <span>{lang === 'en' ? 'Buy New Travel eSIM' : '购买新目的地 eSIM'}</span>
        </button>
      </div>

      {/* eSIM Cards List */}
      {esims.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
            <Signal className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800 font-display">
              {lang === 'en' ? 'No eSIMs Purchased Yet' : '暂无已购 eSIM 凭证'}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {lang === 'en'
                ? 'Select a destination from the eSIM Store to enjoy zero-roaming 5G connectivity worldwide.'
                : '前往 eSIM 商店选择您的下一个旅游目的地，告别昂贵漫游费，享受极速 5G 联网。'}
            </p>
          </div>
          <button
            onClick={onGoToStore}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
          >
            {lang === 'en' ? 'Explore 140+ Destinations' : '浏览全球 140+ 目的地'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {esims.map((esim) => {
            const usagePercent = Math.min(
              100,
              Math.round(((esim.totalDataMB - esim.remainingDataMB) / esim.totalDataMB) * 100)
            );
            const remainingGB = (esim.remainingDataMB / 1024).toFixed(2);
            const totalGB = (esim.totalDataMB / 1024).toFixed(1);
            const isExpanded = expandedId === esim.id;

            return (
              <div
                key={esim.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between transition-all hover:border-slate-300"
              >
                <div className="p-6 space-y-5">
                  {/* Top Bar */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl p-1 bg-slate-50 rounded-2xl border border-slate-100">
                        {esim.flag}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900 font-display">
                            {lang === 'en' ? esim.destinationNameEn : esim.destinationNameZh}
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase ${
                              esim.status === 'active'
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'bg-blue-50 text-blue-600'
                            }`}
                          >
                            {esim.status === 'active'
                              ? (lang === 'en' ? 'In Use' : '使用中')
                              : (lang === 'en' ? 'Ready to Install' : '待激活')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono">Order #{esim.orderNumber}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedQrEsim(esim)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                    >
                      <QrCode className="h-4 w-4" />
                      <span>{lang === 'en' ? 'QR Code' : '二维码'}</span>
                    </button>
                  </div>

                  {/* Data Usage Bar */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 font-medium">
                        {lang === 'en' ? 'Remaining High-Speed 5G' : '剩余高速流量'}
                      </span>
                      <span className="font-mono font-bold text-slate-900">
                        {remainingGB} GB / {totalGB} GB
                      </span>
                    </div>

                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          usagePercent > 80 ? 'bg-amber-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${100 - usagePercent}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                      <span>{lang === 'en' ? `Validity: ${esim.validityDays} Days` : `有效期：${esim.validityDays} 天`}</span>
                      <span>
                        {lang === 'en' ? 'Auto-renews upon arrival' : '抵达目的地连接基站后自动开通'}
                      </span>
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-slate-50 rounded-xl">
                      <span className="text-[10px] text-slate-400 block uppercase font-mono">ICCID</span>
                      <span className="font-mono text-slate-700 text-[11px] truncate block">
                        {esim.iccid}
                      </span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-xl">
                      <span className="text-[10px] text-slate-400 block uppercase font-mono">
                        {lang === 'en' ? 'Delivery Email' : '凭证接收邮箱'}
                      </span>
                      <span className="font-mono text-slate-700 text-[11px] truncate block">
                        {esim.customerEmail}
                      </span>
                    </div>
                  </div>

                  {/* Expandable Manual Details */}
                  {isExpanded && (
                    <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-3 text-xs animate-fadeIn">
                      <div className="flex justify-between items-center text-slate-300">
                        <span className="font-mono font-bold text-[11px]">SM-DP+ Activation Code</span>
                        <button
                          onClick={() => handleCopy(esim.smdpAddress, esim.id)}
                          className="text-blue-300 hover:text-white flex items-center gap-1 font-mono text-[10px] cursor-pointer"
                        >
                          {copiedKey === esim.id ? (
                            <Check className="h-3 w-3 text-emerald-400" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                          <span>{copiedKey === esim.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <div className="bg-black/40 p-2 rounded-lg font-mono text-[10px] text-blue-200 break-all select-all">
                        {esim.smdpAddress}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Action Buttons */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-xs">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : esim.id)}
                    className="text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isExpanded ? (lang === 'en' ? 'Hide Details' : '收起参数') : (lang === 'en' ? 'Manual Code' : '手动参数')}</span>
                    {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>

                  <button
                    onClick={() => onTopUp(esim)}
                    className="px-4 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-xl transition-all shadow-2xs active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCw className="h-3.5 w-3.5 text-blue-600" />
                    <span>{lang === 'en' ? 'Top-Up Data' : '流量续充'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QR Code Popup Modal */}
      {selectedQrEsim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 text-center">
            <div className="flex justify-between items-center pb-2">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{selectedQrEsim.flag}</span>
                <h4 className="text-base font-bold text-slate-900 font-display">
                  {lang === 'en' ? `${selectedQrEsim.destinationNameEn} eSIM Profile` : `${selectedQrEsim.destinationNameZh} eSIM 二维码`}
                </h4>
              </div>
              <button
                onClick={() => setSelectedQrEsim(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* QR Visual */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 inline-block mx-auto">
              <div className="w-48 h-48 border-4 border-slate-900 rounded-xl p-2 flex flex-col justify-between bg-white mx-auto">
                <div className="flex justify-between">
                  <div className="w-10 h-10 bg-slate-900 rounded-sm" />
                  <div className="w-10 h-10 bg-slate-900 rounded-sm" />
                </div>
                <div className="my-auto flex flex-col items-center justify-center">
                  <QrCode className="h-16 w-16 text-slate-900" />
                  <span className="text-[9px] font-mono font-bold text-slate-900 mt-1">
                    {selectedQrEsim.orderNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <div className="w-10 h-10 bg-slate-900 rounded-sm" />
                  <div className="w-5 h-5 bg-blue-600 rounded-sm ml-auto" />
                </div>
              </div>
              <p className="text-xs text-slate-600 font-bold mt-3">
                {lang === 'en' ? 'Scan directly in Phone Settings' : '请使用手机进入「蜂窝网络」扫描添加'}
              </p>
            </div>

            {/* Copy LPA */}
            <div className="bg-slate-50 p-3 rounded-xl text-left text-xs border border-slate-200 space-y-1">
              <div className="flex justify-between items-center text-slate-500 font-mono text-[10px]">
                <span>LPA Activation String</span>
                <button
                  onClick={() => handleCopy(selectedQrEsim.smdpAddress, 'modal-smdp')}
                  className="text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'modal-smdp' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedKey === 'modal-smdp' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="font-mono text-[10px] text-slate-800 break-all select-all">
                {selectedQrEsim.smdpAddress}
              </div>
            </div>

            <button
              onClick={() => setSelectedQrEsim(null)}
              className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-500 cursor-pointer"
            >
              {lang === 'en' ? 'Close' : '关闭'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
