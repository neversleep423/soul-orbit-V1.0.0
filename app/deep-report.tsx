import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/lib/app-context';
import { PERSONALITIES } from '@/constants/personalities';

const LOCKED_CHAPTERS = [
  { id: 2, title: '天赋密码与阴影面', icon: '🌑', desc: '你不为人知的内在力量与潜藏的黑暗面' },
  { id: 3, title: '职业命轨与财运走向', icon: '⚡', desc: '星轨为你指引的职业方向与财富密码' },
  { id: 4, title: '情感模式与灵魂伴侣', icon: '💫', desc: '你的爱情模式与命中注定的灵魂伴侣图谱' },
  { id: 5, title: '专属塔罗牌阵解读', icon: '🃏', desc: '为你量身定制的塔罗牌阵与命运指引' },
];

export default function DeepReportScreen() {
  const { user } = useApp();
  const mbti = user.mbtiResult;
  const personality = mbti ? PERSONALITIES[mbti] : null;
  const [expandedChapter, setExpandedChapter] = useState<number | null>(1);

  if (!personality) {
    return (
      <LinearGradient colors={['#0F172A', '#1a1f35']} style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>请先完成灵魂测试</Text>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>返回</Text>
          </Pressable>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0F172A', '#1a1f35', '#0F172A']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>← 返回</Text>
        </Pressable>
        <Text style={styles.headerTitle}>命运之书</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Book Cover */}
        <View style={styles.bookCover}>
          <LinearGradient
            colors={['rgba(212,175,55,0.15)', 'rgba(212,175,55,0.03)']}
            style={styles.bookCoverGradient}
          >
            <Text style={styles.bookCoverDecor}>✦ · · · ✦</Text>
            <Text style={styles.bookCoverMbti}>{mbti}</Text>
            <Text style={styles.bookCoverTitle}>{personality.title}</Text>
            <Text style={styles.bookCoverSubtitle}>{personality.subtitle}</Text>
            <View style={styles.bookCoverDivider} />
            <Text style={styles.bookCoverLabel}>命运之书 · 深度解析</Text>
          </LinearGradient>
        </View>

        {/* Chapter 1 - Free */}
        <View style={styles.chapterSection}>
          <Text style={styles.sectionLabel}>✦ 免费章节</Text>

          <Pressable
            style={[styles.chapterCard, expandedChapter === 1 && styles.chapterCardExpanded]}
            onPress={() => setExpandedChapter(expandedChapter === 1 ? null : 1)}
          >
            <View style={styles.chapterHeader}>
              <View style={styles.chapterIconContainer}>
                <Text style={styles.chapterIcon}>☽</Text>
              </View>
              <View style={styles.chapterInfo}>
                <Text style={styles.chapterNum}>第一章</Text>
                <Text style={styles.chapterTitle}>{personality.chapter1.title}</Text>
              </View>
              <Text style={styles.chapterArrow}>{expandedChapter === 1 ? '▲' : '▼'}</Text>
            </View>
            {expandedChapter === 1 && (
              <View style={styles.chapterContent}>
                <View style={styles.chapterDivider} />
                <Text style={styles.chapterText}>{personality.chapter1.content}</Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* Locked Chapters */}
        <View style={styles.chapterSection}>
          <Text style={styles.sectionLabel}>🔒 付费章节</Text>

          {LOCKED_CHAPTERS.map((chapter) => (
            <View key={chapter.id} style={styles.lockedChapterCard}>
              <View style={styles.chapterHeader}>
                <View style={[styles.chapterIconContainer, styles.lockedIconContainer]}>
                  <Text style={styles.chapterIcon}>{chapter.icon}</Text>
                </View>
                <View style={styles.chapterInfo}>
                  <Text style={styles.chapterNum}>第{['', '一', '二', '三', '四', '五'][chapter.id]}章</Text>
                  <Text style={[styles.chapterTitle, styles.lockedTitle]}>{chapter.title}</Text>
                  <Text style={styles.chapterDesc}>{chapter.desc}</Text>
                </View>
                <View style={styles.lockIcon}>
                  <Text style={styles.lockIconText}>🔒</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Unlock CTA */}
        <View style={styles.unlockSection}>
          <Text style={styles.unlockTitle}>解锁完整命运之书</Text>
          <Text style={styles.unlockSubtitle}>
            一次购买，永久拥有你的专属命运解析
          </Text>

          <View style={styles.priceContainer}>
            <Text style={styles.priceOriginal}>原价 ¥29.9</Text>
            <Text style={styles.priceCurrent}>¥9.9</Text>
            <Text style={styles.priceDesc}>限时特惠</Text>
          </View>

          <Pressable
            style={({ pressed }) => [styles.unlockButton, pressed && styles.buttonPressed]}
            onPress={() => router.push('/paywall')}
          >
            <LinearGradient
              colors={['#D4AF37', '#B8960C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.unlockButtonGradient}
            >
              <Text style={styles.unlockButtonText}>✦ 立即解锁命运之书</Text>
            </LinearGradient>
          </Pressable>

          <Text style={styles.guaranteeText}>🔐 安全支付 · 一次购买永久有效</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 56,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#94A3B8',
    marginBottom: 16,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  backButtonText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backBtn: {
    paddingVertical: 8,
    width: 60,
  },
  backBtnText: {
    fontSize: 15,
    color: '#94A3B8',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E2E8F0',
    letterSpacing: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  bookCover: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    marginBottom: 28,
  },
  bookCoverGradient: {
    padding: 28,
    alignItems: 'center',
  },
  bookCoverDecor: {
    fontSize: 12,
    color: '#D4AF37',
    letterSpacing: 4,
    marginBottom: 12,
    opacity: 0.6,
  },
  bookCoverMbti: {
    fontSize: 40,
    fontWeight: '900',
    color: '#D4AF37',
    letterSpacing: 8,
    marginBottom: 8,
  },
  bookCoverTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E2E8F0',
    marginBottom: 4,
  },
  bookCoverSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    letterSpacing: 4,
    marginBottom: 16,
  },
  bookCoverDivider: {
    width: 60,
    height: 1,
    backgroundColor: 'rgba(212, 175, 55, 0.4)',
    marginBottom: 12,
  },
  bookCoverLabel: {
    fontSize: 11,
    color: '#D4AF37',
    letterSpacing: 3,
    opacity: 0.7,
  },
  chapterSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 12,
    color: '#94A3B8',
    letterSpacing: 2,
    marginBottom: 12,
  },
  chapterCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 8,
  },
  chapterCardExpanded: {
    borderColor: 'rgba(212, 175, 55, 0.4)',
  },
  lockedChapterCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 8,
    opacity: 0.7,
  },
  chapterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chapterIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  lockedIconContainer: {
    backgroundColor: '#0F172A',
    borderColor: '#334155',
  },
  chapterIcon: {
    fontSize: 18,
    color: '#D4AF37',
  },
  chapterInfo: {
    flex: 1,
  },
  chapterNum: {
    fontSize: 11,
    color: '#D4AF37',
    letterSpacing: 2,
    marginBottom: 2,
  },
  chapterTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  lockedTitle: {
    color: '#64748B',
  },
  chapterDesc: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
    lineHeight: 18,
  },
  chapterArrow: {
    fontSize: 12,
    color: '#D4AF37',
    opacity: 0.6,
  },
  lockIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIconText: {
    fontSize: 16,
  },
  chapterContent: {
    marginTop: 0,
  },
  chapterDivider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 12,
  },
  chapterText: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 26,
  },
  unlockSection: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    alignItems: 'center',
    marginTop: 8,
  },
  unlockTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E2E8F0',
    letterSpacing: 1,
    marginBottom: 8,
  },
  unlockSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  priceOriginal: {
    fontSize: 13,
    color: '#475569',
    textDecorationLine: 'line-through',
    marginBottom: 4,
  },
  priceCurrent: {
    fontSize: 44,
    fontWeight: '900',
    color: '#D4AF37',
    lineHeight: 52,
  },
  priceDesc: {
    fontSize: 12,
    color: '#D4AF37',
    letterSpacing: 2,
    opacity: 0.7,
  },
  unlockButton: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
  },
  unlockButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  unlockButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: 1,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  guaranteeText: {
    fontSize: 11,
    color: '#475569',
    letterSpacing: 1,
  },
});
