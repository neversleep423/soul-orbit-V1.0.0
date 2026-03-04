import { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/lib/app-context';
import { calculateRelation } from '@/constants/content';

const RELATION_ICONS: Record<string, string> = {
  '灵魂镜像': '🪞',
  '宿命天敌': '⚔️',
  '天作之合': '💫',
  '相爱相杀': '🔥',
  '星轨交错': '🌌',
};

export default function RelationResultScreen() {
  const { user } = useApp();
  const params = useLocalSearchParams<{
    friendName: string;
    friendMbti: string;
    relationType: string;
  }>();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const relation = calculateRelation(user.mbtiResult, params.friendMbti || '');
  const icon = RELATION_ICONS[relation.type] || '✦';

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <LinearGradient colors={['#0F172A', '#1a1f35', '#0F172A']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>← 返回</Text>
        </Pressable>
        <Text style={styles.headerTitle}>宿命羁绊</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.content,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          {/* Orbit Visualization */}
          <View style={styles.orbitContainer}>
            <View style={styles.orbitOuter}>
              <View style={styles.orbitInner}>
                {/* My MBTI */}
                <View style={[styles.orbitNode, styles.orbitNodeLeft]}>
                  <Text style={styles.orbitNodeMbti}>{user.mbtiResult}</Text>
                  <Text style={styles.orbitNodeLabel}>我</Text>
                </View>

                {/* Connection Icon */}
                <View style={styles.orbitCenter}>
                  <Text style={styles.orbitCenterIcon}>{icon}</Text>
                </View>

                {/* Friend MBTI */}
                <View style={[styles.orbitNode, styles.orbitNodeRight]}>
                  <Text style={styles.orbitNodeMbti}>{params.friendMbti}</Text>
                  <Text style={styles.orbitNodeLabel}>{params.friendName}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Relation Type */}
          <View style={styles.relationTypeBadge}>
            <Text style={styles.relationTypeText}>{relation.type}</Text>
          </View>

          {/* Tarot Card */}
          <View style={styles.tarotCard}>
            <LinearGradient
              colors={['rgba(212,175,55,0.12)', 'rgba(212,175,55,0.03)']}
              style={styles.tarotCardGradient}
            >
              <Text style={styles.tarotCardLabel}>命运塔罗</Text>
              <Text style={styles.tarotCardName}>{relation.card}</Text>
            </LinearGradient>
          </View>

          {/* Quote */}
          <View style={styles.quoteContainer}>
            <Text style={styles.quoteText}>"{relation.quote}"</Text>
          </View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerSymbol}>◈</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Details */}
          <View style={styles.detailCard}>
            <Text style={styles.detailTitle}>✦ 星轨交汇解析</Text>
            <Text style={styles.detailText}>
              {user.mbtiResult} 与 {params.friendMbti} 的灵魂频率在宇宙的星轨中形成了「{relation.type}」的羁绊模式。
              {'\n\n'}
              {relation.quote}
            </Text>
          </View>

          {/* Back Button */}
          <Pressable
            style={({ pressed }) => [styles.backButton, pressed && styles.buttonPressed]}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>返回沙盘</Text>
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
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  content: {
    alignItems: 'center',
  },
  orbitContainer: {
    marginBottom: 24,
    marginTop: 8,
  },
  orbitOuter: {
    width: 280,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  orbitNode: {
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
  },
  orbitNodeLeft: {},
  orbitNodeRight: {},
  orbitNodeMbti: {
    fontSize: 16,
    fontWeight: '900',
    color: '#D4AF37',
    letterSpacing: 2,
  },
  orbitNodeLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  orbitCenter: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitCenterIcon: {
    fontSize: 24,
  },
  relationTypeBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    borderWidth: 1.5,
    borderColor: '#D4AF37',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginBottom: 20,
  },
  relationTypeText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#D4AF37',
    letterSpacing: 3,
  },
  tarotCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    marginBottom: 20,
    width: '100%',
  },
  tarotCardGradient: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tarotCardLabel: {
    fontSize: 12,
    color: '#94A3B8',
    letterSpacing: 2,
  },
  tarotCardName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#D4AF37',
    letterSpacing: 2,
  },
  quoteContainer: {
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
    borderLeftWidth: 2,
    borderLeftColor: '#D4AF37',
    paddingLeft: 16,
    paddingVertical: 12,
    paddingRight: 12,
    borderRadius: 4,
    marginBottom: 20,
    width: '100%',
  },
  quoteText: {
    fontSize: 14,
    color: '#CBD5E1',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
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
  detailCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
    width: '100%',
    marginBottom: 24,
  },
  detailTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D4AF37',
    letterSpacing: 2,
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 26,
  },
  backButton: {
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  backButtonText: {
    fontSize: 15,
    color: '#94A3B8',
  },
  buttonPressed: {
    opacity: 0.7,
  },
});
