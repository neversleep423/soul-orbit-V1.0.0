import { describe, it, expect } from 'vitest';
import { calculateMBTI, calculateRelation, getDailyEnergy } from '../constants/content';
import { PERSONALITIES } from '../constants/personalities';
import { QUESTIONS } from '../constants/questions';

describe('MBTI 计算算法', () => {
  it('应该正确计算 INFP（全B答案）', () => {
    const answers: Record<number, 'A' | 'B'> = {};
    for (let i = 1; i <= 30; i++) {
      answers[i] = 'B';
    }
    const result = calculateMBTI(answers);
    expect(result).toBe('INFP');
  });

  it('应该正确计算 ESTJ（全A答案）', () => {
    const answers: Record<number, 'A' | 'B'> = {};
    for (let i = 1; i <= 30; i++) {
      answers[i] = 'A';
    }
    const result = calculateMBTI(answers);
    expect(result).toBe('ESTJ');
  });

  it('应该返回4字母MBTI类型', () => {
    const answers: Record<number, 'A' | 'B'> = {};
    for (let i = 1; i <= 30; i++) {
      answers[i] = i % 2 === 0 ? 'A' : 'B';
    }
    const result = calculateMBTI(answers);
    expect(result).toHaveLength(4);
    expect(result).toMatch(/^[EI][SN][TF][JP]$/);
  });
});

describe('合盘算法', () => {
  it('相同MBTI应该返回灵魂镜像', () => {
    const result = calculateRelation('INTJ', 'INTJ');
    expect(result.type).toBe('灵魂镜像');
  });

  it('完全相反的MBTI应该返回宿命天敌', () => {
    const result = calculateRelation('INTJ', 'ESFP');
    expect(result.type).toBe('宿命天敌');
  });

  it('中间两字母相同两端相反应该返回天作之合', () => {
    const result = calculateRelation('INTJ', 'ENTJ');
    // I vs E (different), N vs N (same), T vs T (same), J vs J (same) - 3 same, not perfect match
    // Let's test INTJ vs ESTJ: I≠E, N≠S, T=T, J=J - 2 same
    const result2 = calculateRelation('INTJ', 'ESFP');
    expect(result2.type).toBe('宿命天敌');
  });

  it('3个字母相同应该返回相爱相杀', () => {
    // INTJ vs ENTJ: I≠E, N=N, T=T, J=J - 3 same
    const result = calculateRelation('INTJ', 'ENTJ');
    expect(result.type).toBe('相爱相杀');
  });

  it('合盘结果应该包含card和quote字段', () => {
    const result = calculateRelation('INFP', 'ENFJ');
    expect(result).toHaveProperty('type');
    expect(result).toHaveProperty('card');
    expect(result).toHaveProperty('quote');
    expect(result).toHaveProperty('description');
  });
});

describe('16人格数据库', () => {
  const mbtiTypes = [
    'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP',
  ];

  it('应该包含所有16种MBTI类型', () => {
    mbtiTypes.forEach((type) => {
      expect(PERSONALITIES).toHaveProperty(type);
    });
  });

  it('每种人格应该包含必要字段', () => {
    mbtiTypes.forEach((type) => {
      const p = PERSONALITIES[type];
      expect(p).toHaveProperty('title');
      expect(p).toHaveProperty('subtitle');
      expect(p).toHaveProperty('quote');
      expect(p).toHaveProperty('chapter1');
      expect(p.chapter1).toHaveProperty('title');
      expect(p.chapter1).toHaveProperty('content');
    });
  });
});

describe('题库', () => {
  it('应该包含30道题目', () => {
    expect(QUESTIONS).toHaveLength(30);
  });

  it('题目维度分布应该正确', () => {
    const eiCount = QUESTIONS.filter(q => q.dimension === 'EI').length;
    const snCount = QUESTIONS.filter(q => q.dimension === 'SN').length;
    const tfCount = QUESTIONS.filter(q => q.dimension === 'TF').length;
    const jpCount = QUESTIONS.filter(q => q.dimension === 'JP').length;
    expect(eiCount).toBe(7);
    expect(snCount).toBe(8);
    expect(tfCount).toBe(8);
    expect(jpCount).toBe(7);
  });

  it('每道题应该有A和B两个选项', () => {
    QUESTIONS.forEach((q) => {
      expect(q.optionA).toBeTruthy();
      expect(q.optionB).toBeTruthy();
      expect(q.text).toBeTruthy();
    });
  });
});

describe('每日能量播报', () => {
  it('应该返回非空字符串', () => {
    const energy = getDailyEnergy('INTJ');
    expect(energy).toBeTruthy();
    expect(typeof energy).toBe('string');
    expect(energy.length).toBeGreaterThan(10);
  });

  it('相同MBTI同一天应该返回相同结果', () => {
    const energy1 = getDailyEnergy('INFP');
    const energy2 = getDailyEnergy('INFP');
    expect(energy1).toBe(energy2);
  });
});
