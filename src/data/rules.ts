export interface CreditRule {
  id: string;
  name: string;
  bank: string;
  summary: string;
  description: string;
  impact: string;
  tip: string;
}

export const US_CREDIT_RULES: CreditRule[] = [
  {
    id: 'chase-524',
    name: 'Chase 5/24 规则 (核心规则)',
    bank: 'Chase',
    summary: '24个月内开卡数不能 >= 5张',
    description: '不论是哪个银行发行的信用卡，只要在过去 24 个月内，你在信用报告上增加了 5 个或更多的个人信用卡账户（包括部分银行的副卡），Chase 就会直接自动拒绝你的申请。',
    impact: '任何有志于攒美卡积分的人，都应该优先申请 Chase 的信用卡。一旦超过 5/24，你就需要等待老卡时间过 24 个月才能重新申请。部分商业卡 (Business Card) 不计入 5/24 计数，但申请时仍需要你在 5/24 以内才能获批。',
    tip: '规划美卡顺序时，应将 Chase 蓝宝石 (CSP/CSR)、Freedom 放入最先开卡的 1-4 张中，不要因为小卡占用了宝贵的 5/24 名额。'
  },
  {
    id: 'amex-lifetime',
    name: 'Amex 一生一次与家族门槛规则',
    bank: 'American Express',
    summary: '开卡奖励一生只能拿一次，且有向上兼容门槛',
    description: 'American Express 的开卡奖励条款中带有“Once in a Lifetime”限制，即如果你曾经持有过某张卡，即使销卡了，这辈子通常也无法再拿到该卡的开卡奖励。此外，近年来 Amex 引入了家族限制（Family Language）：如果你持有或曾持有高级别的卡（如 Platinum），就会失去低级别卡（如 Gold, Green）的开卡奖励资格。',
    impact: '如果你打算开 Amex 绿卡、金卡和白金卡，你应当采取“由低到高”的申请顺序（Green -> Gold -> Platinum）。如果你直接先开了白金卡，你讲无法再拿到金卡或绿卡的开卡奖励。',
    tip: '每次申请 Amex 时，一定要注意看有没有“弹窗警告”(Pop-up window)。如果弹窗提示你没有开卡奖励资格，千万不要点击继续申请，应选择撤回或换时间尝试。'
  },
  {
    id: 'chase-230',
    name: 'Chase 2/30 限制',
    bank: 'Chase',
    summary: '30天内最多批准2张卡',
    description: 'Chase 限制在 30 天内最多只能批准 2 张信用卡（包含个人卡和商业卡），否则第三张申请会被秒拒。',
    impact: '短期内如果想连续申请多张 Chase 信用卡，一定要隔开 30 天以上，否则不仅浪费 Hard Pull，还会引发风控。',
    tip: '对于信用历史较短的新手，建议每两张 Chase 信用卡之间隔开 3 个月以上，以保证批卡概率，并且不容易被 Chase 风控部门（Shutdown）盯上。'
  },
  {
    id: 'capitalone-16',
    name: 'Capital One 1/6 与严苛批卡风格',
    bank: 'Capital One',
    summary: '每6个月只能申请一张卡，对信用记录要求极刁钻',
    description: 'Capital One (C1) 严格限制每 6 个月内只能批一张个人卡（不管是通过还是拒绝）。同时，C1 极其喜欢调取三大信用局（Experian, Equifax, TransUnion）的信用报告（一申三拉），并且他们更倾向于批卡给不那么追求大量高端卡、负债率适中、有存款往来的用户。',
    impact: '如果你的信用历史太丰富、近半年内 Hard Pull (HP) 过多、或者有大量的其他银行高级卡，Capital One 可能会以“卡片过多”为由拒绝你，哪怕你的信用分数高达 800+。',
    tip: 'Venture X 是神级性价比的高端卡，建议在信用历史中前期、HP 较少的时候尽早申请，千万别等手上有 10+ 张卡了再去碰运气。'
  },
  {
    id: 'citi-865',
    name: 'Citi 8/65 规则与 1/24 限制',
    bank: 'Citi',
    summary: '8天内最多一申，65天内最多两申',
    description: 'Citi（花旗银行）规定：8 天之内只能申请 1 张卡，65 天之内最多申请 2 张卡。同时，Citi 曾有 24 个月限制（1/24）：在 24 个月内，如果你开过或关过同一系列（如 ThankYou 积分系列）的卡，将无法获得该系列其他卡的开卡奖励。',
    impact: '频繁申请极易触发 8/65 被秒拒，需要精细化控制时间节点。',
    tip: 'Citi 比较看重最近 6 个月内的 Hard Pull。如果近半年内 HP 超过 6 个，批卡几率会大幅度暴跌，建议“歇火”一段时间再去申请。'
  }
];

export interface StrategyStep {
  phase: string;
  title: string;
  duration: string;
  recommendedCards: string[];
  actionItems: string[];
  reasoning: string;
}

export const APPLICANT_ROADMAPS: Record<string, StrategyStep[]> = {
  beginner: [
    {
      phase: '阶段 1',
      title: '积攒信用起点 (零信用记录或留学生首卡)',
      duration: '第 0 - 6 个月',
      recommendedCards: ['discover-it'],
      actionItems: [
        '开通无年费、低门槛的 Discover it 开启美国信用历史',
        '如果可能，开通一个 Chase College Checking / Checking 账户，存入 $1,000+ 搬砖，为后续 Chase 批卡打下基础',
        '每月按时全额还款，千万不要只还 Minimum 产生利息，保持低于 10% 的额度占用率'
      ],
      reasoning: 'Discover it 拥有几乎最低的门槛，且无年费、首年返现翻倍，是建立良好 FICO 分数的绝对首选。'
    },
    {
      phase: '阶段 2',
      title: '进军 Chase 基础卡 (凑 Freedom 两兄弟)',
      duration: '第 6 - 12 个月',
      recommendedCards: ['chase-freedom-unlimited', 'chase-freedom-flex'],
      actionItems: [
        '当信用历史满 6 个月、且有 Chase 存款账户时，优先申请 Chase Freedom Unlimited (CFU) 锁定日常 1.5x 无脑攒点卡',
        '再过 3 个月左右，申请 Chase Freedom Flex (CFF) 锁定每季度 5x 消费轮替神卡',
        '此时已消耗 2 个 5/24 名额，剩余 3 个名额'
      ],
      reasoning: 'Freedom 系列无年费，能产生极为高价值的 UR 点数，通过越早申请，可以让信用卡片年限长线增长。'
    },
    {
      phase: '阶段 3',
      title: '开启点数引擎 (拿下蓝宝石或 Venture X)',
      duration: '第 12 - 18 个月',
      recommendedCards: ['chase-sapphire-preferred', 'capital-one-venture-x'],
      actionItems: [
        '当信用历史达到 1 年，重头戏来了！申请 Chase Sapphire Preferred (CSP)，将前面积攒的 Freedom UR 积分彻底盘活，可 1:1 换成凯悦酒店 (Hyatt) 或美联航里程',
        '尝试申请 Capital One Venture X。由于 Venture X 是负等效年费的高端卡且极度看重中前期信用历史，此时申请通过率最高'
      ],
      reasoning: 'CSP 是转分核心卡，而 Venture X 则是负等效年费的常驻高端卡，主打日常 2x 攒点与免费机场贵宾厅。'
    }
  ],
  traveler: [
    {
      phase: '阶段 1',
      title: '搭建点数转分基础',
      duration: '第 1 - 6 个月',
      recommendedCards: ['chase-sapphire-preferred', 'chase-freedom-flex'],
      actionItems: [
        '优先申请 Chase 蓝宝石 CSP 锁定高额开卡礼和 1:1 伙伴转点权限',
        '配合 Freedom 季度 5x 轮换积累 Ultimate Rewards 点数'
      ],
      reasoning: 'Chase UR 积分在兑换 Hyatt 酒店和美联航 UA、英航 BA、法航里程时是绝对的高端主力，用出 1.6+ cents/point 的极高价值。'
    },
    {
      phase: '阶段 2',
      title: '入局 Amex 运通帝国并完成低向高申请',
      duration: '第 6 - 15 个月',
      recommendedCards: ['amex-gold', 'amex-platinum'],
      actionItems: [
        '先申请 Amex Gold 金卡，锁定餐饮和超市 4x 积分！',
        '在拥有金卡后，申请 Amex Platinum 白金卡，解锁顶级机场贵宾厅 (百夫长 + SkyClub) 权益，极高额度的旅游报销',
        '千万不要倒过来申请，否则会因为白金卡的家族限制错失金卡庞大的开卡奖积分'
      ],
      reasoning: 'Amex Membership Rewards (MR) 的 1:1 伙伴转点涵盖了全日空 ANA（换中美商务舱神器）、达美 Delta、国泰航空等。金卡赚日常，白金卡打旅行，是商务舱与奢华酒店绝佳伴侣。'
    },
    {
      phase: '阶段 3',
      title: '补齐无脑刷与一站式航司伴侣',
      duration: '第 15 个月以上',
      recommendedCards: ['capital-one-venture-x'],
      actionItems: [
        '在 5/24 计数以及信用历史允许下，拿下 Capital One Venture X 作为无脑 2x 攒分备用卡。',
        'Venture X 可与副卡持有者共享机场贵宾厅权益，特别适合结伴出行'
      ],
      reasoning: '作为高频出行者，Venture X 的等效正收益以及强大的贵宾室福利，能够补充 Amex 和 Chase 无法完全覆盖的机场及日常 2x 无脑刷网。'
    }
  ]
};
