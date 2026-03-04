// 每日能量播报库（日签池）
export const DAILY_ENERGY_POOL = [
  '星轨行至静默之域。今日的能量不再向外辐射，而是向内坍缩。外界的喧嚣如同掠过深渊的风，无法触及你的内核。宜闭门，宜守拙，宜在精神的内海里点亮一盏孤灯。',
  '火元素正在你的命宫沸腾。旧的秩序出现裂痕，你的言语将成为今日劈开迷雾的利刃。不要畏惧碰撞，燃烧本身就是你存在的意义。去打破，去重组。',
  '水象能量漫过脚踝，直觉将在今日凌驾于逻辑之上。你可能会感知到平时忽略的微小情绪，或是捕捉到梦境的残影。不要试图用理性去解析，允许自己随波逐流。',
  '土元素的沉稳降临。今天是将漂浮的灵感锚定在现实的绝佳时机。处理账单、整理房间或完成一份枯燥的表格，这些具象的触感将为你带来极大的灵魂安宁。',
  '风的流向变得无序。今日你可能会遭遇计划的突变或信息过载。无需抵抗这股乱流，把它当成一次命运的即兴演奏。保持轻盈，你会在偏离的航道上发现新的星系。',
];

// 宿命羁绊字典
export interface RelationResult {
  type: string;
  card: string;
  quote: string;
  description: string;
}

export const RELATION_DICT: Record<string, RelationResult> = {
  SOUL_MIRROR: {
    type: '灵魂镜像',
    card: '魔术师',
    quote: '凝视深渊时的水面回影。你们是彼此的孤岛，也是彼此的锚。你们拥有同一套破译世界的密码，不需要言语，只需一个眼神就能共振。',
    description: '4个字母完全相同',
  },
  DESTINED_ENEMY: {
    type: '宿命天敌',
    card: '高塔',
    quote: '冰与火的渊源。你们带着截然不同的法则降临，每一次靠近都是对彼此立场的拷问。这是命运安排的试炼——要么在烈火中淬炼出新的边界，要么在碰撞后各自归于寂静。',
    description: '0个字母相同（全部相反）',
  },
  PERFECT_MATCH: {
    type: '天作之合',
    card: '恋人',
    quote: '这并非初次相遇，而是久别重逢。你们的灵魂齿轮在此刻完美咬合——你缺失的拼图，正是他与生俱来的锋芒。在彼此的镜子里，你们看见了更完整的自己。',
    description: '中间两字母相同，两端字母相反',
  },
  LOVE_HATE: {
    type: '相爱相杀',
    card: '战车',
    quote: '你们的星轨靠得太近，难免产生摩擦的火花。你们在90%的事物上高度契合，却总会在那10%的核心理念上爆发争夺。这是一种极具生命力的羁绊，谁也不服谁，但谁也离不开谁。',
    description: '有3个字母相同，仅1个不同',
  },
  ORBIT_CROSS: {
    type: '星轨交错',
    card: '命运之轮',
    quote: '你们的相遇是庞大宇宙计算中的一次随机漫步。你们带着各自的轨迹短暂交汇，存在着理解的壁垒，但也保留了探索的余地。保持适当的物理与精神距离，你们会成为彼此生命中不错的观测者。',
    description: '不符合上述所有规则的其他情况',
  },
};

// 计算合盘结果
export function calculateRelation(mbtiA: string, mbtiB: string): RelationResult {
  if (mbtiA === mbtiB) {
    return RELATION_DICT.SOUL_MIRROR;
  }

  let sameCount = 0;
  for (let i = 0; i < 4; i++) {
    if (mbtiA[i] === mbtiB[i]) sameCount++;
  }

  if (sameCount === 0) {
    return RELATION_DICT.DESTINED_ENEMY;
  }

  // 天作之合：中间两字母相同，两端字母相反
  if (mbtiA[1] === mbtiB[1] && mbtiA[2] === mbtiB[2] && mbtiA[0] !== mbtiB[0] && mbtiA[3] !== mbtiB[3]) {
    return RELATION_DICT.PERFECT_MATCH;
  }

  if (sameCount === 3) {
    return RELATION_DICT.LOVE_HATE;
  }

  return RELATION_DICT.ORBIT_CROSS;
}

// 计算每日能量（基于日期+MBTI的哈希）
export function getDailyEnergy(mbti: string): string {
  const today = new Date();
  const dateStr = `${today.getFullYear()}${today.getMonth()}${today.getDate()}`;
  const seed = dateStr + mbti;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  const index = Math.abs(hash) % DAILY_ENERGY_POOL.length;
  return DAILY_ENERGY_POOL[index];
}

// 计算MBTI结果
export function calculateMBTI(answers: Record<number, 'A' | 'B'>): string {
  // E/I: Q1-7, A=E, B=I
  let eCount = 0;
  for (let i = 1; i <= 7; i++) {
    if (answers[i] === 'A') eCount++;
  }
  const ei = eCount >= 4 ? 'E' : 'I';

  // S/N: Q8-15, A=S, B=N
  let sCount = 0;
  for (let i = 8; i <= 15; i++) {
    if (answers[i] === 'A') sCount++;
  }
  const sn = sCount >= 4 ? 'S' : 'N';

  // T/F: Q16-23, A=T, B=F
  let tCount = 0;
  for (let i = 16; i <= 23; i++) {
    if (answers[i] === 'A') tCount++;
  }
  const tf = tCount >= 4 ? 'T' : 'F';

  // J/P: Q24-30, A=J, B=P
  let jCount = 0;
  for (let i = 24; i <= 30; i++) {
    if (answers[i] === 'A') jCount++;
  }
  const jp = jCount >= 4 ? 'J' : 'P';

  return `${ei}${sn}${tf}${jp}`;
}
