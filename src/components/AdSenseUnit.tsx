import React, { useEffect } from 'react';
import { AdSenseConfig } from '../types';
import { Sparkles, ExternalLink, Code2, AlertCircle } from 'lucide-react';

interface AdSenseUnitProps {
  type: 'header' | 'inArticle' | 'sidebar' | 'bottom';
  config: AdSenseConfig;
  className?: string;
}

export const AdSenseUnit: React.FC<AdSenseUnitProps> = ({ type, config, className = '' }) => {
  if (config.displayMode === 'hidden') {
    return null;
  }

  // Determine slot ID and dimension presets based on type
  let slotId = '';
  let label = '';
  let dimensions = '';
  let aspectClass = '';

  switch (type) {
    case 'header':
      slotId = config.slots.headerBanner || '1234567890';
      label = '页头广告位 (Header Leaderboard Banner)';
      dimensions = '728 x 90 px / Responsive';
      aspectClass = 'min-h-[90px] w-full max-w-[728px]';
      break;
    case 'inArticle':
      slotId = config.slots.inArticle || '2345678901';
      label = '文章内嵌流广告 (In-Article Native Ad)';
      dimensions = '流式自适应 / Fluid Responsive';
      aspectClass = 'min-h-[140px] w-full';
      break;
    case 'sidebar':
      slotId = config.slots.sidebar || '3456789012';
      label = '侧边栏粘性广告 (Sidebar Medium Rectangle)';
      dimensions = '300 x 250 px / 300 x 600 px';
      aspectClass = 'min-h-[250px] w-full max-w-[300px]';
      break;
    case 'bottom':
      slotId = config.slots.bottomBanner || '4567890123';
      label = '文章底部长条广告 (Below Article Leaderboard)';
      dimensions = '728 x 90 px / Responsive';
      aspectClass = 'min-h-[100px] w-full';
      break;
  }

  // For live mode: push to adsbygoogle array
  useEffect(() => {
    if (config.displayMode === 'live' && config.publisherId && window) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.warn('AdSense script error:', err);
      }
    }
  }, [config.displayMode, config.publisherId, slotId]);

  // In preview or clean audit mode prior to live approval, return null so the site UI is completely clean and authentic
  if (config.displayMode === 'preview') {
    return null;
  }

  // Render Live Mode
  if (!config.publisherId) {
    return null;
  }

  return (
    <div className={`my-6 text-center ${aspectClass} ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={config.publisherId}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};
