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

export default function ResultScreen() {
  const { user } = useApp();
  const mbti = user.mbtiResult;
  const personality = PERSONALITIES[mbti];
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 60,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  if (!personality) {
    return (
      <LinearGradient colors={['#0F172A', '#1a1f35']} style={styles.container}>
        <Text style={styles.errorText}>测试结果加载中...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0F172A', '#1a1f35', '#0F172A']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.content,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Stars decoration */}
          <Text style={styles.starsDecor}>✦ · · · ✦ · · · ✦</Text>

          {/* MBTI Badge */}
          <View style={styles.mbtiBadgeContainer}>
            <LinearGradient
              colors={['rgba(212,175,55,0.15)', 'rgba(212,175,55,0.05)']}
              style={styles.mbtiBadge}
            >
              <Text style={styles.mbtiText}>{mbti}</Text>
            </LinearGradient>
          </View>

          {/* Title */}
          <Text style={styles.personalityTitle}>{personality.title}</Text>
          <Text style={styles.personalitySubtitle}>{personality.subtitle}</Text>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerSymbol}>◈</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Quote */}
          <View style={styles.quoteContainer}>
            <Text style={styles.quoteText}>"{personality.quote}"</Text>
          </View>

          {/* Basic Info Card */}
          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>✦ 本命星轨解析</Text>
            <Text style={styles.infoCardContent}>{personality.chapter1.content}</Text>
          </View>

          {/* CTA Buttons */}
          <Pressable
            style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
            onPress={() => router.replace('/(tabs)')}
          >
            <LinearGradient
              colors={['#D4AF37', '#B8960C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryButtonGradient}
            >
              <Text style={styles.primaryButtonText}>进入我的星轨 →</Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
            onPress={() => router.push('/deep-report')}
          >
            <Text style={styles.secondaryButtonText}>✦ 解锁深度命运之书</Text>
          </Pressable>

          <Text style={styles.footerText}>· 你的灵魂密码已被星轨记录 ·</Text>
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
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  content: {
    alignItems: 'center',
    paddingTop: 20,
  },
  errorText: {
    color: '#E2E8F0',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
  },
  starsDecor: {
    fontSize: 12,
    color: '#D4AF37',
    letterSpacing: 4,
    marginBottom: 24,
    opacity: 0.6,
  },
  mbtiBadgeContainer: {
    marginBottom: 16,
  },
  mbtiBadge: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#D4AF37',
    alignItems: 'center',
  },
  mbtiText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#D4AF37',
    letterSpacing: 8,
  },
  personalityTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#E2E8F0',
    letterSpacing: 2,
    marginBottom: 4,
    textAlign: 'center',
  },
  personalitySubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    letterSpacing: 4,
    marginBottom: 24,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#334155',
  },
  dividerSymbol: {
    fontSize: 16,
    color: '#D4AF37',
    marginHorizontal: 12,
  },
  quoteContainer: {
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
    borderLeftWidth: 2,
    borderLeftColor: '#D4AF37',
    paddingLeft: 16,
    paddingVertical: 12,
    paddingRight: 12,
    borderRadius: 4,
    marginBottom: 24,
    width: '100%',
  },
  quoteText: {
    fontSize: 14,
    color: '#CBD5E1',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  infoCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
    width: '100%',
    marginBottom: 28,
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D4AF37',
    letterSpacing: 2,
    marginBottom: 12,
  },
  infoCardContent: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 24,
  },
  primaryButton: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
  },
  primaryButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: 1,
  },
  secondaryButton: {
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D4AF37',
    marginBottom: 24,
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
  },
  secondaryButtonText: {
    fontSize: 14,
    color: '#D4AF37',
    fontWeight: '600',
    letterSpacing: 1,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  footerText: {
    fontSize: 11,
    color: '#475569',
    letterSpacing: 2,
  },
});
