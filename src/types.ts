export type Language = 'en' | 'zh';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CNY';

export interface CurrencyRate {
  code: Currency;
  symbol: string;
  rate: number; // relative to USD (1 USD = rate * Currency)
  label: string;
}

export const CURRENCIES: Record<Currency, CurrencyRate> = {
  USD: { code: 'USD', symbol: '$', rate: 1.0, label: 'USD ($)' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92, label: 'EUR (€)' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.79, label: 'GBP (£)' },
  JPY: { code: 'JPY', symbol: '¥', rate: 155.0, label: 'JPY (¥)' },
  CNY: { code: 'CNY', symbol: '¥', rate: 7.25, label: 'CNY (¥)' },
};

export type EsimRegion = 'all' | 'popular' | 'asia' | 'europe' | 'north-america' | 'global' | 'oceania' | 'latam';

export interface EsimPackage {
  id: string;
  dataAmount: string; // e.g. "1 GB", "3 GB", "5 GB", "10 GB", "20 GB", "Unlimited"
  dataAmountMB: number; // for tracking
  validityDays: number;
  priceUSD: number;
  originalPriceUSD?: number;
  isPopular?: boolean;
  type: 'fixed' | 'daily_unlimited';
  descriptionEn: string;
  descriptionZh: string;
}

export type EsimPlan = EsimPackage;

export interface EsimDestination {
  id: string;
  countryCode: string;
  countryNameEn: string;
  countryNameZh: string;
  flag: string;
  region: EsimRegion;
  networkPartners: string[];
  speeds: ('5G' | '4G LTE')[];
  hotspot: boolean;
  ekycRequired: boolean;
  coverageDetailsEn: string;
  coverageDetailsZh: string;
  coverageCountriesCount: number;
  packages: EsimPackage[];
  isPopular?: boolean;
  isRegional?: boolean;
}

export type PaymentChannel = 'card' | 'applepay' | 'googlepay' | 'alipay' | 'wechat' | 'paypal' | 'crypto';

export interface PurchasedEsim {
  id: string;
  orderNumber: string;
  destinationId: string;
  destinationNameEn: string;
  destinationNameZh: string;
  flag: string;
  packageId: string;
  dataSummary: string;
  validityDays: number;
  totalDataMB: number;
  remainingDataMB: number;
  pricePaid: number;
  currency: Currency;
  paymentMethod: PaymentChannel;
  purchasedAt: string;
  status: 'active' | 'ready_to_activate' | 'expired';
  iccid: string;
  smdpAddress: string;
  activationCode: string;
  qrPayload: string;
  customerEmail: string;
}

export interface CompatibilityDevice {
  brand: string;
  models: string[];
}
