import React, { useState } from 'react';
import { X, Smartphone, Search, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { COMPATIBILITY_DEVICES } from '../data/esimData';
import { Language } from '../types';

interface CompatibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const CompatibilityModal: React.FC<CompatibilityModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredBrands = COMPATIBILITY_DEVICES.map((b) => ({
    ...b,
    models: b.models.filter((m) => m.toLowerCase().includes(search.toLowerCase())),
  })).filter((b) => b.models.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                {lang === 'en' ? 'eSIM Compatible Devices Check' : 'eSIM 兼容设备查验清单'}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'en'
                  ? 'Verify if your smartphone or tablet supports digital eSIM profiles'
                  : '核对您的手机或平板是否支持安装电子 eSIM 漫游卡'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Quick instructions check */}
          <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 space-y-2 text-xs text-slate-700">
            <div className="flex items-center space-x-2 font-bold text-blue-900">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              <span>{lang === 'en' ? 'Quick Dial Test (*#06#)' : '快速拨号检测 (*#06#)'}</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              {lang === 'en' ? (
                <>
                  Open your phone's dialer and enter <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 font-mono font-bold text-blue-700">*#06#</code>. If you see an <strong>EID (Embedded Identity Document)</strong> number or barcode on screen, your device fully supports eSIM!
                </>
              ) : (
                <>
                  打开手机拨号盘输入 <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 font-mono font-bold text-blue-700">*#06#</code>。如果屏幕弹出 <strong>EID</strong> 条形码或 32 位数字，代表您的设备硬件原生支持 eSIM！
                </>
              )}
            </p>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={lang === 'en' ? 'Search your device model (e.g. iPhone 15, S24, Pixel 8)...' : '搜索手机型号 (如 iPhone 15, S24, Pixel 8)...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
            />
          </div>

          {/* Device list by brands */}
          <div className="space-y-4">
            {filteredBrands.map((brand) => (
              <div key={brand.brand} className="border border-slate-200/80 rounded-2xl p-4 bg-white space-y-2.5">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-display flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-blue-600" />
                  <span>{brand.brand}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {brand.models.map((model) => (
                    <div
                      key={model}
                      className="flex items-center space-x-2 text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                      <span className="truncate">{model}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {filteredBrands.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-400">
                {lang === 'en' ? 'No devices found matching your search.' : '未搜索到匹配的手机型号。'}
              </div>
            )}
          </div>

          {/* Carrier Lock Notice */}
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200/60 rounded-2xl p-3.5 text-xs text-amber-900">
            <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {lang === 'en' ? (
                <>
                  <strong>Carrier Lock Notice:</strong> Devices purchased on US carrier contracts (AT&T, Verizon, T-Mobile) must be network unlocked (Carrier Lock: No SIM restrictions in Settings &gt; General &gt; About).
                </>
              ) : (
                <>
                  <strong>运营商有锁机提示：</strong> 如果您的手机是美国合约机（如 AT&T、Verizon、T-Mobile），请确保在【设置 &gt; 通用 &gt; 关于本机】显示为“无 SIM 卡限制”（已解锁状态）方可添加任意 eSIM。
                </>
              )}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            {lang === 'en' ? 'Got It' : '已了解'}
          </button>
        </div>
      </div>
    </div>
  );
};
