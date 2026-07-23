import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { 
  Article, Comment, AdSenseConfig 
} from '../types';
import { AdSenseUnit } from './AdSenseUnit';
import { 
  Clock, Calendar, ThumbsUp, Bookmark, Share2, Send, 
  ArrowLeft, Check, Sparkles, User, MessageSquare, ShieldCheck
} from 'lucide-react';

interface ArticleDetailProps {
  article: Article;
  relatedArticles: Article[];
  onSelectArticle: (article: Article) => void;
  onBack: () => void;
  adConfig: AdSenseConfig;
  isBookmarked: boolean;
  onToggleBookmark: (articleId: string) => void;
  onNavigateCompliance: (pageId: string) => void;
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({
  article,
  relatedArticles,
  onSelectArticle,
  onBack,
  adConfig,
  isBookmarked,
  onToggleBookmark,
  onNavigateCompliance,
}) => {
  const [likes, setLikes] = useState(article.likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Comments State
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 'c1',
      articleId: article.id,
      authorName: '张智睿 (AI 研发工程师)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      date: '2026-07-21 14:32',
      content: '文章分析得非常透彻！特别是第二部分关于向量检索（RAG）切分策略的提炼，我们在企业私有知识库实践中遇到了完全一致的痛点，受教了！',
      likes: 12,
    },
    {
      id: 'c2',
      articleId: article.id,
      authorName: '李思源 (产品经理)',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      date: '2026-07-21 16:10',
      content: '请问作者在多模态图片生成部分，有推荐的最佳提示词（Prompt）约束格式吗？我们团队尝试生成统一品牌的宣传图时总是遇到风格漂移的问题。',
      likes: 8,
    },
  ]);
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentContent, setNewCommentContent] = useState('');
  const [commentSuccess, setCommentSuccess] = useState(false);

  // Track Reading Scroll Progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLike = () => {
    if (!hasLiked) {
      setLikes(likes + 1);
      setHasLiked(true);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentContent.trim()) return;

    const item: Comment = {
      id: `comment-${Date.now()}`,
      articleId: article.id,
      authorName: newCommentName.trim() || '热心读者',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      date: new Date().toLocaleString(),
      content: newCommentContent.trim(),
      likes: 0,
      isUserComment: true,
    };

    setComments([item, ...comments]);
    setNewCommentContent('');
    setCommentSuccess(true);
    setTimeout(() => setCommentSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 pb-16">
      {/* Top Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 z-50 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 bg-white dark:bg-stone-900 px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回文章列表</span>
        </button>

        {/* Article Header */}
        <header className="space-y-4 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold px-3 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
              {article.categoryNameCn}
            </span>
            <span className="text-stone-400 text-xs">•</span>
            <span className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1 font-mono">
              <Calendar className="w-3.5 h-3.5" /> {article.publishDate}
            </span>
            <span className="text-stone-400 text-xs">•</span>
            <span className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5" /> 预计阅读时间 {article.readTimeMinutes} 分钟
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-stone-900 dark:text-stone-100 font-serif leading-tight">
            {article.title}
          </h1>

          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed font-sans bg-emerald-50/50 dark:bg-emerald-950/30 p-4 rounded-xl border-l-4 border-emerald-500">
            {article.summary}
          </p>

          {/* Author Card Header */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-3">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/30"
              />
              <div>
                <div className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  {article.author.name}
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400">
                  {article.author.role}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                  hasLiked
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                    : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{likes}</span>
              </button>

              <button
                onClick={() => onToggleBookmark(article.id)}
                className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                  isBookmarked
                    ? 'bg-amber-500 text-stone-950 border-amber-600 shadow-sm'
                    : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
                }`}
                title={isBookmarked ? '已取消收藏' : '收藏本篇'}
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-100 transition-colors"
              >
                {copiedShare ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedShare ? '链接已复制' : '分享'}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Feature Cover Image */}
        <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-stone-200 dark:bg-stone-800 mb-8 shadow-md">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Markdown Body */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xs">
              <div className="markdown-body prose dark:prose-invert max-w-none text-stone-800 dark:text-stone-200 leading-relaxed font-sans text-sm sm:text-base space-y-4">
                <Markdown>{article.content}</Markdown>
              </div>

              {/* In-Article AdSense Unit */}
              <div className="my-8 pt-6 border-t border-stone-100 dark:border-stone-800">
                <AdSenseUnit type="inArticle" config={adConfig} />
              </div>

              {/* Article Tags */}
              <div className="pt-6 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-stone-400 mr-2">包含主题标签：</span>
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs px-2.5 py-1 rounded-lg font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Author Bio Card (Critical for Google E-E-A-T AdSense Audit) */}
            <div className="p-6 bg-gradient-to-tr from-stone-900 to-stone-800 text-stone-200 rounded-2xl border border-stone-700 shadow-md flex flex-col sm:flex-row items-start gap-4">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-emerald-400 shrink-0"
              />
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white">{article.author.name}</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
                    认证专栏作者
                  </span>
                </div>
                <div className="text-xs text-emerald-400 font-medium">{article.author.role}</div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {article.author.bio}
                </p>
                <div className="pt-2 text-[11px] text-stone-400 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" />
                  <span>所有文章均遵循 Lumina Edge 原创事实核查准则。</span>
                </div>
              </div>
            </div>

            {/* Bottom AdSense Banner */}
            <AdSenseUnit type="bottom" config={adConfig} />

            {/* Comments & Interactive Section */}
            <section className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                  <span>读者交流与互动区 ({comments.length})</span>
                </h3>
                <span className="text-xs text-stone-500">延长停留时间以提升 AdSense 权重</span>
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="space-y-3 bg-stone-50 dark:bg-stone-800/50 p-4 rounded-xl border border-stone-200 dark:border-stone-700">
                <div className="text-xs font-bold text-stone-800 dark:text-stone-200">
                  发表您的洞见或提问：
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="您的称呼（可选，默认为热心读者）"
                    value={newCommentName}
                    onChange={(e) => setNewCommentName(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <textarea
                  rows={3}
                  required
                  placeholder="写下您的思考、使用心得或延伸探讨..."
                  value={newCommentContent}
                  onChange={(e) => setNewCommentContent(e.target.value)}
                  className="w-full p-3 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />

                <div className="flex items-center justify-between">
                  {commentSuccess ? (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <Check className="w-4 h-4" /> 评论提交成功！
                    </span>
                  ) : (
                    <span className="text-[11px] text-stone-400">遵守文明交流规章</span>
                  )}
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>提交评论</span>
                  </button>
                </div>
              </form>

              {/* Comment List */}
              <div className="space-y-4 pt-2">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-4 rounded-xl border border-stone-100 dark:border-stone-800/80 bg-stone-50/40 dark:bg-stone-950/40 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={comment.avatar}
                          alt={comment.authorName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="text-xs font-bold text-stone-800 dark:text-stone-200">
                            {comment.authorName}
                          </div>
                          <div className="text-[10px] text-stone-400 font-mono">
                            {comment.date}
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] text-stone-400 flex items-center gap-1 font-mono">
                        <ThumbsUp className="w-3 h-3 text-stone-400" /> {comment.likes}
                      </span>
                    </div>

                    <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed pl-10">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sticky Sidebar */}
          <aside className="space-y-6">
            {/* Table of Contents */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs sticky top-20">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-3">
                文章大纲目录 (Contents)
              </h3>
              <ul className="space-y-2 text-xs">
                {article.tableOfContents.map((toc) => (
                  <li key={toc.id}>
                    <a
                      href={`#${toc.id}`}
                      className="text-stone-600 dark:text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors line-clamp-1 block py-0.5"
                    >
                      {toc.title}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Sidebar AdSense Box */}
              <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800">
                <AdSenseUnit type="sidebar" config={adConfig} />
              </div>
            </div>
          </aside>
        </div>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <section className="mt-16 pt-8 border-t border-stone-200 dark:border-stone-800 space-y-6">
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-serif">
              延伸阅读精选 (Related Articles)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => {
                    onSelectArticle(rel);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group cursor-pointer bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 hover:border-emerald-500 transition-all shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                      {rel.categoryNameCn}
                    </span>
                    <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug">
                      {rel.title}
                    </h4>
                  </div>
                  <div className="text-[10px] text-stone-400 mt-3 pt-2 border-t border-stone-100 dark:border-stone-800 flex justify-between font-mono">
                    <span>{rel.readTimeMinutes} 分钟阅读</span>
                    <span>{rel.views} 阅读</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
