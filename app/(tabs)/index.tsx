import { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/lib/app-context';
import { PERSONALITIES } from '@/constants/personalities';
import { getDailyEnergy } from '@/constants/content';

export default function HomeScreen() {
  const { user } = useApp();
  const mbti = user.mbtiResult;
  const personality = mbti ? PERSONALITIES[mbti] : null;
  const dailyEnergy = mbti ? getDailyEnergy(mbti) : '';
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  if (!user.isTestCompleted) {
    return (
      <LinearGradient colors={['#0F172A', '#1a1f35']} style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>☽◯☾</Text>
          <Text style={styles.emptyTitle}>你的星轨尚未开启</Text>
          <Text style={styles.emptyText}>完成灵魂测试，解锁你的专属星轨密码</Text>
          <Pressable
            style={({ pressed }) => [styles.startButton, pressed && styles.buttonPressed]}
            onPress={() => router.push('/test')}
          >
            <LinearGradient
              colors={['#D4AF37', '#B8960C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.startButtonGradient}
            >
              <Text style={styles.startButtonText}>开始灵魂测试</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0F172A', '#1a1f35', '#0F172A']} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>✦ 灵魂星轨</Text>
              <Text style={styles.date}>{new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })}</Text>
            </View>
            <Pressable
              style={styles.mbtiChip}
              onPress={() => router.push('/result')}
            >
              <Text style={styles.mbtiChipText}>{mbti}</Text>
            </Pressable>
          </View>

          {/* Personality Card */}
          {personality && (
            <View style={styles.personalityCard}>
              <LinearGradient
                colors={['rgba(212,175,55,0.12)', 'rgba(212,175,55,0.04)']}
                style={styles.personalityCardGradient}
              >
                <View style={styles.personalityCardHeader}>
                  <Text style={styles.personalityCardLabel}>本命星轨</Text>
                  <Text style={styles.personalityCardMbti}>{mbti}</Text>
                </View>
                <Text style={styles.personalityCardTitle}>{personality.title}</Text>
                <Text style={styles.personalityCardSubtitle}>{personality.subtitle}</Text>
                <View style={styles.personalityDivider} />
                <Text style={styles.personalityCardQuote}>"{personality.quote}"</Text>
              </LinearGradient>
            </View>
          )}

          {/* Daily Energy Card */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>今日能量播报</Text>
            <Text style={styles.sectionDecor}>✦</Text>
          </View>

          <View style={styles.energyCard}>
            <View style={styles.energyCardHeader}>
              <Text style={styles.energyCardIcon}>🌙</Text>
              <Text style={styles.energyCardLabel}>星轨日签</Text>
            </View>
            <Text style={styles.energyText}>{dailyEnergy}</Text>
          </View>

          {/* Quick Actions */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>星轨功能</Text>
            <Text style={styles.sectionDecor}>✦</Text>
          </View>

          <View style={styles.actionsGrid}>
            <Pressable
              style={({ pressed }) => [styles.actionCard, pressed && styles.actionCardPressed]}
              onPress={() => router.push('/deep-report')}
            >
              <Text style={styles.actionIcon}>📖</Text>
              <Text style={styles.actionTitle}>命运之书</Text>
              <Text style={styles.actionDesc}>深度解析报告</Text>
              {!user.isPremiumUser && (
                <View style={styles.lockBadge}>
                  <Text style={styles.lockBadgeText}>¥9.9</Text>
                </View>
              )}
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.actionCard, pressed && styles.actionCardPressed]}
              onPress={() => router.push('/(tabs)/sandbox')}
            >
              <Text style={styles.actionIcon}>🌌</Text>
              <Text style={styles.actionTitle}>宿命羁绊</Text>
              <Text style={styles.actionDesc}>合盘沙盘</Text>
            </Pressable>
          </View>

          {/* Retake Test */}
          <Pressable
            style={({ pressed }) => [styles.retakeButton, pressed && styles.buttonPressed]}
            onPress={() => router.push('/test')}
          >
            <Text style={styles.retakeButtonText}>↺ 重新测试</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 56,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 24,
    color: '#D4AF37',
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#E2E8F0',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  startButton: {
    borderRadius: 14,
    overflow: 'hidden',
    width: '100%',
  },
  startButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 8,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: '#D4AF37',
    letterSpacing: 2,
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    color: '#64748B',
  },
  mbtiChip: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderWidth: 1,
    borderColor: '#D4AF37',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  mbtiChipText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D4AF37',
    letterSpacing: 2,
  },
  personalityCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    marginBottom: 24,
  },
  personalityCardGradient: {
    padding: 20,
  },
  personalityCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  personalityCardLabel: {
    fontSize: 11,
    color: '#D4AF37',
    letterSpacing: 3,
    fontWeight: '600',
  },
  personalityCardMbti: {
    fontSize: 16,
    fontWeight: '900',
    color: '#D4AF37',
    letterSpacing: 4,
  },
  personalityCardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E2E8F0',
    marginBottom: 2,
  },
  personalityCardSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    letterSpacing: 3,
    marginBottom: 12,
  },
  personalityDivider: {
    height: 1,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    marginBottom: 12,
  },
  personalityCardQuote: {
    fontSize: 13,
    color: '#CBD5E1',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 2,
  },
  sectionDecor: {
    fontSize: 12,
    color: '#D4AF37',
    opacity: 0.6,
  },
  energyCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 24,
  },
  energyCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  energyCardIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  energyCardLabel: {
    fontSize: 12,
    color: '#D4AF37',
    fontWeight: '600',
    letterSpacing: 2,
  },
  energyText: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 24,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    position: 'relative',
  },
  actionCardPressed: {
    opacity: 0.7,
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E2E8F0',
    marginBottom: 4,
  },
  actionDesc: {
    fontSize: 11,
    color: '#64748B',
    letterSpacing: 1,
  },
  lockBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#D4AF37',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  lockBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0F172A',
  },
  retakeButton: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  retakeButtonText: {
    fontSize: 14,
    color: '#64748B',
    letterSpacing: 1,
  },
  buttonPressed: {
    opacity: 0.7,
  },
});
