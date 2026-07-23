export interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  categoryId: string;
  categoryName: string;
  categoryNameCn: string;
  author: {
    name: string;
    avatar: string;
    role: string;
    bio: string;
  };
  publishDate: string;
  updatedDate: string;
  readTimeMinutes: number;
  coverImage: string;
  tags: string[];
  views: number;
  likes: number;
  featured?: boolean;
  tableOfContents: { id: string; title: string; level: number }[];
}

export interface Category {
  id: string;
  name: string;
  nameCn: string;
  description: string;
  iconName: string;
  coverImage: string;
  articleCount: number;
}

export interface Comment {
  id: string;
  articleId: string;
  authorName: string;
  avatar: string;
  date: string;
  content: string;
  likes: number;
  isUserComment?: boolean;
}

export interface AdSenseConfig {
  publisherId: string; // e.g., 'ca-pub-1234567890123456'
  autoAdsEnabled: boolean;
  displayMode: 'preview' | 'live' | 'hidden';
  slots: {
    headerBanner: string; // slot ID
    inArticle: string;
    sidebar: string;
    bottomBanner: string;
    stickyFooter: string;
  };
}

export interface AdSenseAuditItem {
  id: string;
  category: 'Required Pages' | 'Content Quality' | 'User Experience' | 'Technical & SEO';
  categoryCn: '必备规章页面' | '高质量内容规章' | '用户体验与导航' | '技术与SEO合规';
  title: string;
  titleCn: string;
  descriptionCn: string;
  status: 'pass' | 'warning' | 'fail';
  recommendationCn: string;
  importance: 'critical' | 'high' | 'medium';
}

export interface SeoConfig {
  siteName: string;
  siteDescription: string;
  siteKeywords: string[];
  canonicalBaseUrl: string;
  ogImage: string;
  publisherName: string;
  language: string;
}

export interface SpeedMetric {
  name: string;
  label: string;
  score: number; // 0-100
  value: string;
  status: 'good' | 'needs-improvement' | 'poor';
  recommendation: string;
}
