import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Helper to check if API key exists
const isGeminiApiKeyConfigured = () => {
  return !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY';
};

// Initialize Gemini client lazily
let aiClient: GoogleGenAI | null = null;
const getGeminiClient = (): GoogleGenAI => {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsing middleware
  app.use(express.json());

  // API Check Status
  app.get('/api/status', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: isGeminiApiKeyConfigured(),
    });
  });

  // AI Recommend Card Endpoint
  app.post('/api/recommend', async (req, res) => {
    const {
      lang = 'en',
      creditScore,
      creditHistoryMonths,
      travelPreference,
      monthlySpending,
      carrierPreferences,
      hasAnnualFeePreference,
    } = req.body;

    if (!isGeminiApiKeyConfigured()) {
      return res.status(400).json({
        error: 'API_KEY_MISSING',
        message:
          lang === 'en'
            ? 'GEMINI_API_KEY is not configured in Settings > Secrets. Please configure your key in AI Studio to enable intelligent recommendations.'
            : '您的管理员尚未在 Settings > Secrets 里面配置 GEMINI_API_KEY！请在 AI Studio 侧边栏的 Settings 中填入您的密钥以启用 AI 智能推荐。',
      });
    }

    try {
      const ai = getGeminiClient();

      const isEnglish = lang === 'en';

      const spendingText = isEnglish
        ? `
- Dining & Takeout: $${monthlySpending?.dining || 0}/mo
- Supermarkets & Groceries: $${monthlySpending?.groceries || 0}/mo
- Travel & Flights: $${monthlySpending?.travel || 0}/mo
- Gas & Transit: $${monthlySpending?.gas || 0}/mo
- Everyday Retail & Others: $${monthlySpending?.other || 0}/mo
`
        : `
- 餐饮消费 (Dining): $${monthlySpending?.dining || 0}/月
- 超市买菜 (Groceries): $${monthlySpending?.groceries || 0}/月
- 旅游出行 (Travel): $${monthlySpending?.travel || 0}/月
- 加油出行 (Gas): $${monthlySpending?.gas || 0}/月
- 其他零售 (Others): $${monthlySpending?.other || 0}/月
`;

      const systemInstruction = isEnglish
        ? `
You are Lumina's premier Global Travel & US Credit Card Strategist.
Your goal is to provide a comprehensive, ultra-practical, high-ROI travel rewards & credit card roadmap tailored to the user's spending profile, goals, and credit history.

Format your output in clean, elegant GitHub-style Markdown with clear headers, bullet points, and highlight badges.
Ensure you cover:
1. **Spending Profile Analysis**: Identify their highest yield categories and spending velocity.
2. **Top Recommended Cards (1-2 Cards)**: Detail the exact card name, welcome offer, return multipliers, and net value after credits.
3. **Sequential Roadmap (Chase 5/24 & Timing)**: Clarify strict underwriting rules (Chase 5/24 rule, Amex popup jail, Capital One velocity) and suggest the next 2-3 cards in order.
4. **Point Redemption & Travel Optimization Strategy**: Explain high-value transfer partners (Hyatt, ANA, Air France Flying Blue, Avios, Virgin Atlantic) and tips on travel connectivity (e.g., pairing cards with high cell phone protection or zero foreign transaction fees with international travel eSIMs).

Maintain an encouraging, authoritative, and sophisticated tone.
`
        : `
你是一位极其专业、资深且幽默的美国信用卡专家（美卡达人）。
你的任务是根据用户的信用状况、月度消费习惯和偏好，为他们量身制定一份**最长远、最高收益、最合理**的美卡申请建议和路线。

你的回复必须生动活泼，使用中文，且排版优雅美观。需要包含以下几个部分：
1. **用户消费画像分析**：用幽默专业的话语分析他们的消费结构，指出他们最大的消费“痛点”或“攒点沃土”在哪里。
2. **首选卡片推荐**：给出 1-2 张绝对最适合他们当前的信用卡（写出中英文名字，并解释为什么这张卡能最大化他们的收益）。
3. **远期美卡路线图 (Roadmap)**：给出一套 2-3 步的开卡计划，特别是考虑 Chase 5/24 规则、Amex 家族语言、或信用历史积攒问题。
4. **攒点玩法小贴士**：告诉他们他们推荐卡片所对应点数体系（如 Chase UR, Amex MR, Capital One 里程等）的最佳转换/兑换姿势。例如凯悦酒店 Hyatt 换房，或者转 ANA/国泰里程。

请直接返回格式优美的 Markdown 文本。
`;

      const prompt = isEnglish
        ? `
Please generate an optimized Credit Card & Travel Strategy for me:
- Credit Score Bracket: ${creditScore} (Credit history: ~${creditHistoryMonths || 0} months)
- Primary Reward Goal: ${travelPreference}
- Annual Fee Preference: ${
            hasAnnualFeePreference === 'yes'
              ? 'Open to premium fees for high luxury perks'
              : hasAnnualFeePreference === 'no'
              ? 'Strictly $0 no annual fee only'
              : 'Flexible based on net return ROI'
          }
- Preferred Airlines / Hotels: ${carrierPreferences || 'No specific preference'}

Monthly Spend Breakdown:
${spendingText}

Please provide your top expert strategy.
`
        : `
请为我制定一份美卡申请规划：
- 我的信用等级: ${creditScore} (信用历史约 ${creditHistoryMonths || 0} 个月)
- 我最注重的福利/权益: ${travelPreference}
- 我对年费的态度: ${hasAnnualFeePreference === 'yes' ? '愿意接受合理年费换取高端福利' : hasAnnualFeePreference === 'no' ? '只考虑免年费信用卡' : '无所谓，看收益性价比'}
- 我偏好的航空/酒店品牌: ${carrierPreferences || '无特别偏好'}

我的月度日常消费详情如下：
${spendingText}

请按照系统指示为我输出最专业的定制美卡路线规划指南。
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({
        recommendationMarkdown: response.text,
      });
    } catch (error: any) {
      console.error('Gemini Recommendation Error:', error);
      res.status(500).json({
        error: 'GENAI_ERROR',
        message:
          lang === 'en'
            ? 'Error generating AI recommendation report: ' + (error.message || error)
            : '生成 AI 推荐报告时出错，请稍后重试。详细错误：' + (error.message || error),
      });
    }
  });

  // Vite middleware for development or Static File serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express Full-Stack server booted and running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
