import React, { useState } from 'react';
import { 
  X, Code2, Copy, Check, ExternalLink, Terminal, 
  Github, CheckCircle2, Server, Globe, ArrowRight, ShieldCheck
} from 'lucide-react';

interface GitHubPagesModalProps {
  onClose: () => void;
}

export const GitHubPagesModal: React.FC<GitHubPagesModalProps> = ({ onClose }) => {
  const [copiedWorkflow, setCopiedWorkflow] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(false);

  const workflowYaml = `name: Deploy AdSense Site to GitHub Pages

on:
  push:
    branches: ["main"]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Build Static Site
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4`;

  const headCodeSnippet = `<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Lumina Edge - Digital Media Hub</title>
  
  <!-- Google AdSense Auto Ads Script (过审专用脚本) -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"
          crossorigin="anonymous"></script>
</head>`;

  const copyText = (text: string, type: 'workflow' | 'index') => {
    navigator.clipboard.writeText(text);
    if (type === 'workflow') {
      setCopiedWorkflow(true);
      setTimeout(() => setCopiedWorkflow(false), 2000);
    } else {
      setCopiedIndex(true);
      setTimeout(() => setCopiedIndex(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 flex items-center justify-center font-bold">
              <Github className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                无需 VPS 服务器：零成本挂载 GitHub Pages 教程
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                纯静态结构 + CDN 全球分发 + 自动化 Git 推送更新 + AdSense 合规集成
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-stone-800 dark:text-stone-200 text-xs">
          {/* Highlights banner */}
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-200 text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>为什么 GitHub Pages 非常适合提交 Google AdSense 审核？</span>
            </div>
            <ul className="text-emerald-800 dark:text-emerald-300 space-y-1 list-disc pl-5 text-xs">
              <li><strong>免费且稳定</strong>：无需购买云服务器 (VPS) 或担心续费宕机，具有极高的 uptime（在线率）。</li>
              <li><strong>自带 HTTPS SSL 证书</strong>：谷歌 AdSense 要求全站具备高安全性 HTTPS 保护，GitHub Pages 默认免费启用。</li>
              <li><strong>高速静态 CDN</strong>：秒级打开，非常有利于通过 Core Web Vitals 测速指标。</li>
            </ul>
          </div>

          {/* Steps Tutorial */}
          <div className="space-y-4">
            <h3 className="font-bold uppercase tracking-wider text-stone-500 text-xs">
              四步上线您的 AdSense 网站 (Standard Deployment Workflow)
            </h3>

            {/* Step 1 */}
            <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 space-y-2">
              <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-stone-100">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">1</span>
                <span>在 GitHub 上新建仓库 (Create Repository)</span>
              </div>
              <p className="text-stone-600 dark:text-stone-400 pl-8">
                登录您的 GitHub 账号，创建一个公共仓库，如 <code className="bg-stone-200 dark:bg-stone-700 px-1 py-0.5 rounded font-mono">my-adsense-media-hub</code>。
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-stone-100">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">2</span>
                  <span>创建 GitHub Actions 部署工作流文件 (deploy.yml)</span>
                </div>
                <button
                  onClick={() => copyText(workflowYaml, 'workflow')}
                  className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                >
                  {copiedWorkflow ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedWorkflow ? '已复制 Workflow' : '复制 deploy.yml'}</span>
                </button>
              </div>
              <p className="text-stone-600 dark:text-stone-400 pl-8">
                在代码根目录下添加文件：<code className="bg-stone-200 dark:bg-stone-700 px-1.5 py-0.5 rounded font-mono text-emerald-600 dark:text-emerald-400">.github/workflows/deploy.yml</code>，内容如下：
              </p>
              <pre className="ml-8 p-3 bg-stone-900 text-stone-200 rounded-lg font-mono text-[11px] overflow-x-auto max-h-40 border border-stone-800">
                {workflowYaml}
              </pre>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 space-y-2">
              <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-stone-100">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">3</span>
                <span>开启 GitHub Pages 权限 (Settings -&gt; Pages)</span>
              </div>
              <p className="text-stone-600 dark:text-stone-400 pl-8">
                进入仓库的 <strong>Settings -&gt; Pages -&gt; Source</strong>，选择 <code className="bg-stone-200 dark:bg-stone-700 px-1 py-0.5 rounded font-mono font-bold text-emerald-600">GitHub Actions</code>。每次您执行 <code className="bg-stone-200 dark:bg-stone-700 px-1 py-0.5 rounded font-mono">git push</code>，代码将自动构建并上线！
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-stone-100">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">4</span>
                  <span>在 index.html 的 &lt;head&gt; 中插入谷歌 AdSense 过审脚本</span>
                </div>
                <button
                  onClick={() => copyText(headCodeSnippet, 'index')}
                  className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                >
                  {copiedIndex ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIndex ? '已复制 Snippet' : '复制 head 脚本'}</span>
                </button>
              </div>
              <pre className="ml-8 p-3 bg-stone-900 text-amber-300 rounded-lg font-mono text-[11px] overflow-x-auto border border-stone-800">
                {headCodeSnippet}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 flex justify-between items-center text-xs text-stone-500">
          <span>提示：完成 GitHub Pages 挂载后，用分配到的 https://yourname.github.io 网址提交 AdSense 审核即可！</span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-stone-800 hover:bg-stone-700 rounded-xl transition-colors shadow-sm"
          >
            完成了解
          </button>
        </div>
      </div>
    </div>
  );
};
