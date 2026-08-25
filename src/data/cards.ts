export interface CardEarning {
  category: string;
  rate: string;
  description: string;
}

export interface CreditCard {
  id: string;
  nameEn: string;
  nameZh: string;
  bank: 'Chase' | 'American Express' | 'Capital One' | 'Citi' | 'Discover';
  annualFee: number;
  rewardType: 'Points' | 'Cashback' | 'Miles';
  pointType?: 'UR' | 'MR' | 'Capital One' | 'TYP' | 'Cash';
  signupBonus: string;
  signupBonusValue: number; // Estimated value in USD
  earningRates: CardEarning[];
  perks: string[];
  creditRequired: 'Excellent' | 'Good' | 'Building';
  foreignTransactionFee: boolean;
  introApr?: string;
  imageUrl: string; // We can use placeholder icon or styling
  applyUrl: string;
}

export const US_CREDIT_CARDS: CreditCard[] = [
  {
    id: 'chase-sapphire-preferred',
    nameEn: 'Chase Sapphire Preferred® Card',
    nameZh: 'Chase Sapphire Preferred (CSP) 蓝宝石主打卡',
    bank: 'Chase',
    annualFee: 95,
    rewardType: 'Points',
    pointType: 'UR',
    signupBonus: '开卡 3 个月内消费满 $4,000 赠送 60,000 UR 积分',
    signupBonusValue: 960, // 60k UR @ 1.6 cents/point
    earningRates: [
      { category: '旅行', rate: '5x / 2x', description: '通过 Chase Travel 消费 5x，其他旅行消费 2x' },
      { category: '餐饮', rate: '3x', description: '全球餐厅用餐（包括外卖和送餐服务）' },
      { category: '流媒体 & 线上买菜', rate: '3x', description: '指定流媒体及线上超市买菜消费（不含 Target/Walmart/Costco）' },
      { category: '其他消费', rate: '1x', description: '每消费 $1 获得 1 积分' }
    ],
    perks: [
      '每年 $50 酒店报销（需通过 Chase Travel 预订）',
      '每年开卡周年获得上一年度总消费 10% 的额外积分红利',
      '无境外消费手续费 (No Foreign Transaction Fee)',
      'UR 积分可 1:1 转给优质常旅客计划（如凯悦酒店 Hyatt、联合航空 UA）',
      '提供超强的旅行延误险、行李丢失险及租车碰撞险 (Primary Auto Rental Collision Damage Waiver)'
    ],
    creditRequired: 'Excellent',
    foreignTransactionFee: false,
    applyUrl: 'https://www.chase.com',
    imageUrl: '💳'
  },
  {
    id: 'chase-sapphire-reserve',
    nameEn: 'Chase Sapphire Reserve®',
    nameZh: 'Chase Sapphire Reserve (CSR) 蓝宝石高端卡',
    bank: 'Chase',
    annualFee: 550,
    rewardType: 'Points',
    pointType: 'UR',
    signupBonus: '开卡 3 个月内消费满 $4,000 赠送 60,000 UR 积分',
    signupBonusValue: 960,
    earningRates: [
      { category: '旅行', rate: '10x / 5x / 3x', description: '通过 Chase 订酒店/机票/租车最高 10x，其他旅行 3x' },
      { category: '餐饮', rate: '10x / 3x', description: '通过 Chase Dining 10x，普通餐饮 3x' },
      { category: '其他消费', rate: '1x', description: '每消费 $1 获得 1 积分' }
    ],
    perks: [
      '每年容易获取的 $300 旅行杂费报销（自动报销，涵盖机票、酒店、过路费、打车等）',
      '无限次 Priority Pass 机场贵宾厅权益（可免费携带 2 名同行者）',
      '积分在 Chase 门户兑换旅行时价值提升 50%（1.5 cents/point 价值）',
      '免费送 1 年 Lyft Pink All Access 以及 DoorDash DashPass 会员权益',
      '顶级的 Primary 租车险和旅行延误/取消保险'
    ],
    creditRequired: 'Excellent',
    foreignTransactionFee: false,
    applyUrl: 'https://www.chase.com',
    imageUrl: '👑'
  },
  {
    id: 'chase-freedom-flex',
    nameEn: 'Chase Freedom Flex℠',
    nameZh: 'Chase Freedom Flex (CFF) 季度 5% 消费神卡',
    bank: 'Chase',
    annualFee: 0,
    rewardType: 'Points',
    pointType: 'UR',
    signupBonus: '开卡 3 个月内消费满 $500 赠送 $200 (等值 20,000 UR 积分)',
    signupBonusValue: 320, // 20k UR @ 1.6
    earningRates: [
      { category: '季度轮替', rate: '5x', description: '每季度特定类别前 $1,500 消费享受 5% 返现/积分（如超市、加油站、亚马逊等）' },
      { category: '餐饮', rate: '3x', description: '包括堂食、外卖和送餐' },
      { category: '药店 (Drugstore)', rate: '3x', description: '在指定药店消费' },
      { category: 'Chase Travel', rate: '5x', description: '通过 Chase 门户购买的旅行' },
      { category: '其他消费', rate: '1x', description: '所有其他日常消费 1%' }
    ],
    perks: [
      '无年费，积攒的返现可以以 UR 积分形式提取（可与 CSP/CSR 合并转航司/酒店）',
      '包含手机保护险 (Cell Phone Protection)，每次最高赔付 $800（有 $50 免赔额）',
      '首 15 个月 0% 消费 APR'
    ],
    creditRequired: 'Good',
    foreignTransactionFee: true,
    applyUrl: 'https://www.chase.com',
    imageUrl: '🔄'
  },
  {
    id: 'chase-freedom-unlimited',
    nameEn: 'Chase Freedom Unlimited®',
    nameZh: 'Chase Freedom Unlimited (CFU) 日常全能消费卡',
    bank: 'Chase',
    annualFee: 0,
    rewardType: 'Points',
    pointType: 'UR',
    signupBonus: '开卡 3 个月内消费满 $500 赠送 $200 (等值 20,000 UR 积分)',
    signupBonusValue: 320,
    earningRates: [
      { category: '日常无脑消费', rate: '1.5x', description: '所有不属于其他特分类别的日常消费，享 1.5% 返现/积分' },
      { category: '餐饮', rate: '3x', description: '包括堂食和外卖' },
      { category: '药店 (Drugstore)', rate: '3x', description: '药店消费' },
      { category: 'Chase Travel', rate: '5x', description: '通过 Chase 门户购买的旅行' }
    ],
    perks: [
      '无年费，日常底线 1.5x 攒点，是凑齐 Chase 三剑客 (Trifecta) 的日常主力卡',
      '首 15 个月 0% 消费 APR'
    ],
    creditRequired: 'Good',
    foreignTransactionFee: true,
    applyUrl: 'https://www.chase.com',
    imageUrl: '♾️'
  },
  {
    id: 'amex-gold',
    nameEn: 'American Express® Gold Card',
    nameZh: 'Amex Gold 运通金卡 (神级餐饮超市卡)',
    bank: 'American Express',
    annualFee: 325,
    rewardType: 'Points',
    pointType: 'MR',
    signupBonus: '开卡 6 个月内消费满 $6,000 赠送 60,000 MR 积分（经常有 90k/100k 史高神车）',
    signupBonusValue: 960, // 60k @ 1.6
    earningRates: [
      { category: '餐饮', rate: '4x', description: '全球餐厅消费，包括外卖及送餐（最高 $50,000 消费/年）' },
      { category: '超市 (Groceries)', rate: '4x', description: '美国超市买菜消费（最高 $25,000 消费/年）' },
      { category: '机票', rate: '3x', description: '直接向航空公司预订或在 Amex Travel 购买的机票' },
      { category: '其他消费', rate: '1x', description: '每消费 $1 积 1 分' }
    ],
    perks: [
      '每年 $120 Uber Cash 报销（每月 $10，绑定卡即可，可用于 Uber 乘车或 Uber Eats 送餐）',
      '每年 $120 Dining Credit 餐饮报销（每月 $10，适用于 Grubhub, Five Guys, Shake Shack 等）',
      '每年 $100 Resy Credit 餐饮报销（每半年 $50）',
      '每年 $84 Dunkin\' Credit 报销（每月 $7）',
      '高颜值金属卡（玫瑰金 Rose Gold 可选，非常受欢迎）',
      'MR 点数可 1:1 转换为全日空 ANA、达美 Delta、新加坡航空、希尔顿酒店等'
    ],
    creditRequired: 'Excellent',
    foreignTransactionFee: false,
    applyUrl: 'https://www.americanexpress.com',
    imageUrl: '🟡'
  },
  {
    id: 'amex-platinum',
    nameEn: 'The Platinum Card® from American Express',
    nameZh: 'Amex Platinum 运通白金卡 (机场贵宾厅之王)',
    bank: 'American Express',
    annualFee: 695,
    rewardType: 'Points',
    pointType: 'MR',
    signupBonus: '开卡 6 个月内消费满 $8,000 赠送 80,000 MR 积分（经常有 125k/150k + 消费返现史高）',
    signupBonusValue: 1280, // 80k @ 1.6
    earningRates: [
      { category: '机票预订', rate: '5x', description: '直接向航司或通过 Amex Travel 预订机票（最高每年 $500,000 消费）' },
      { category: '酒店预订', rate: '5x', description: '通过 Amex Travel 预订的预付酒店' },
      { category: '其他消费', rate: '1x', description: '普通消费 1x 点数' }
    ],
    perks: [
      '全方位的贵宾厅网络：无限次免费进入 Amex Centurion 百夫长贵宾室、Delta Sky Club 及 Priority Pass',
      '每年 $200 航空杂费报销 (Airline Fee Credit)',
      '每年 $200 酒店信用报销（需通过 Fine Hotels + Resorts® / The Hotel Collection 预订）',
      '每年 $200 Uber Cash 报销（每月 $15，12月 $35）',
      '每年 $240 数字娱乐报销（每月 $20，适用于 Disney+, Hulu, Peacock, NY Times 等）',
      '每年 $155 Walmart+ 会员费自动报销，每月送 $12.95',
      '每年 $189 CLEAR Plus 快速安检报销',
      '每年 $100 Saks Fifth Avenue 时尚百货报销（每半年 $50）',
      '免费赠送万豪旅享家 Marriott 金卡、希尔顿 Hilton 金卡会员资格',
      '高档重质感纯金属卡'
    ],
    creditRequired: 'Excellent',
    foreignTransactionFee: false,
    applyUrl: 'https://www.americanexpress.com',
    imageUrl: '⚪'
  },
  {
    id: 'amex-blue-cash-everyday',
    nameEn: 'Blue Cash Everyday® Card from American Express',
    nameZh: 'Amex Blue Cash Everyday (BCE) 日常省钱小能手',
    bank: 'American Express',
    annualFee: 0,
    rewardType: 'Cashback',
    pointType: 'Cash',
    signupBonus: '开卡 3 个月内消费满 $2,000 赠送 $200 返现',
    signupBonusValue: 200,
    earningRates: [
      { category: '超市 (Groceries)', rate: '3%', description: '美国超市买菜返现（年消费上限 $6,000，之后 1%）' },
      { category: '网购 (Online Retail)', rate: '3%', description: '美国各大线上零售网站购物返现（年消费上限 $6,000，之后 1%）' },
      { category: '加油 (Gas Stations)', rate: '3%', description: '美国加油站加油消费（年消费上限 $6,000，之后 1%）' },
      { category: '其他消费', rate: '1%', description: '所有其他消费享无限制 1% 返现' }
    ],
    perks: [
      '无年费，超强的日常“超市+网购+加油”三位一体 3% 返现组合',
      '每月 $7 的 Disney Bundle 专属订阅返现报销（年返 $84）',
      'Home Chef 预订送最高 $180 报销（每月 $15）'
    ],
    creditRequired: 'Good',
    foreignTransactionFee: true,
    applyUrl: 'https://www.americanexpress.com',
    imageUrl: '🔵'
  },
  {
    id: 'capital-one-venture-x',
    nameEn: 'Capital One Venture X Rewards Credit Card',
    nameZh: 'Capital One Venture X (VX) 神仙负等效年费高端卡',
    bank: 'Capital One',
    annualFee: 395,
    rewardType: 'Points',
    pointType: 'Capital One',
    signupBonus: '开卡 3 个月内消费满 $4,000 赠送 75,000 里程积分',
    signupBonusValue: 1050, // 75k @ 1.4 cents/point
    earningRates: [
      { category: '酒店 & 租车', rate: '10x', description: '通过 Capital One Travel 预订酒店和租车' },
      { category: '机票', rate: '5x', description: '通过 Capital One Travel 预订机票' },
      { category: '日常无脑消费', rate: '2x', description: '所有其他任何消费一律无脑 2x 点数积攒！' }
    ],
    perks: [
      '每年 $300 Capital One Travel 门票旅行抵扣报销',
      '每年账户周年自动赠送 10,000 里程积分奖励（价值至少 $100，抵消年费完成“负年费”）',
      '无限次进入 Capital One Lounges、Plaza Premium 贵宾室和 Priority Pass 贵宾室',
      '主卡及“免费添加的副卡”持有者均可携伴享机场贵宾厅权益（副卡也是金属卡，业界良心）',
      '无境外手续费，附带极其丰富的手机丢失险及旅行险'
    ],
    creditRequired: 'Excellent',
    foreignTransactionFee: false,
    applyUrl: 'https://www.capitalone.com',
    imageUrl: '🛸'
  },
  {
    id: 'capital-one-savor-one',
    nameEn: 'Capital One SavorOne Cash Rewards Credit Card',
    nameZh: 'Capital One SavorOne 娱乐生活神卡',
    bank: 'Capital One',
    annualFee: 0,
    rewardType: 'Cashback',
    pointType: 'Cash',
    signupBonus: '开卡 3 个月内消费满 $500 赠送 $200 现金奖励',
    signupBonusValue: 200,
    earningRates: [
      { category: '餐饮', rate: '3%', description: '餐饮、堂食、外卖和酒吧消费' },
      { category: '超市 (Groceries)', rate: '3%', description: '超市买菜消费（不含超级市场如 Target/Walmart）' },
      { category: '娱乐 & 流媒体', rate: '3%', description: '指定娱乐消费（电影院、主题公园、现场表演）及指定流媒体' },
      { category: '其他消费', rate: '1%', description: '其他日常消费一律 1% 无限制返现' }
    ],
    perks: [
      '无年费，无境外交易手续费 (FTF)，带出国买菜刷卡聚餐的最佳免年费利器',
      '可将返现 1:1 转化为 Venture 系列信用卡的里程积分，玩法极多',
      '部分演出订票平台 Capital One Entertainment 特享 8% 或 10% 返现'
    ],
    creditRequired: 'Good',
    foreignTransactionFee: false,
    applyUrl: 'https://www.capitalone.com',
    imageUrl: '🍕'
  },
  {
    id: 'citi-custom-cash',
    nameEn: 'Citi Custom Cash® Card',
    nameZh: 'Citi Custom Cash 智能自适应 5% 消费神卡',
    bank: 'Citi',
    annualFee: 0,
    rewardType: 'Points',
    pointType: 'TYP',
    signupBonus: '开卡 3 个月内消费满 $1,500 赠送 $200 (等值 20,000 TYP 积分)',
    signupBonusValue: 280, // 20k @ 1.4 cents
    earningRates: [
      { category: '主力最高类别', rate: '5%', description: '每个账单周期内在你的最高消费类别前 $500 自动享受 5% 返现（如餐饮、超市、加油、旅行、药店等）' },
      { category: '其他消费', rate: '1%', description: '所有其他类别和超过上限的消费享 1% 返现' }
    ],
    perks: [
      '无年费。极其省心！系统会自动检测你在哪个类别花钱最多，并在该类提供 5% 返现，最适合做特定消费的主力专刷卡',
      '积攒的 ThankYou Points (TYP) 可以跟 Citi Strata Premier 等卡合并，转入国泰、长荣等航空会员换里程机票'
    ],
    creditRequired: 'Good',
    foreignTransactionFee: true,
    applyUrl: 'https://www.citi.com',
    imageUrl: '🎯'
  },
  {
    id: 'citi-double-cash',
    nameEn: 'Citi® Double Cash Card',
    nameZh: 'Citi Double Cash 双倍返现全能基座',
    bank: 'Citi',
    annualFee: 0,
    rewardType: 'Points',
    pointType: 'TYP',
    signupBonus: '开卡 3 个月内消费满 $1,500 赠送 $200 (等值 20,000 TYP 积分)',
    signupBonusValue: 280,
    earningRates: [
      { category: '消费全包揽', rate: '2%', description: '消费时获得 1% 点数，还款时再获得 1% 点数，等效无脑双倍点数/返现！' }
    ],
    perks: [
      '无年费，日常底线消费无脑 2x 积攒 ThankYou Points (TYP)',
      '没有消费种类限制，非常适合作为不想分类记账的无脑常备主力卡'
    ],
    creditRequired: 'Good',
    foreignTransactionFee: true,
    applyUrl: 'https://www.citi.com',
    imageUrl: '♊'
  },
  {
    id: 'discover-it',
    nameEn: 'Discover it® Cash Back',
    nameZh: 'Discover it 留学生/新手首选返现神卡',
    bank: 'Discover',
    annualFee: 0,
    rewardType: 'Cashback',
    pointType: 'Cash',
    signupBonus: '第一年结束时，Discover 会 100% 匹配你在这一年内赚取的所有返现（首年相当于双倍，季度轮替变 10% ！）',
    signupBonusValue: 150, // estimated matching value
    earningRates: [
      { category: '季度轮替', rate: '5%', description: '每季度在特定的商家或类别前 $1,500 消费享受 5% 返现（需要手动激活）' },
      { category: '其他消费', rate: '1%', description: '所有其他日常消费 1%' }
    ],
    perks: [
      '无年费。申请门槛极低，无信用历史亦有机会通过（非常适合留学生作为美国第一张信用卡）',
      '无境外交易手续费 (No Foreign Transaction Fee)，且在国内走银联通道刷卡通过率高',
      '免费提供 FICO 信用分数查询，卡面图案有数百种可以免费任选更换'
    ],
    creditRequired: 'Building',
    foreignTransactionFee: false,
    applyUrl: 'https://www.discover.com',
    imageUrl: '🚀'
  }
];
