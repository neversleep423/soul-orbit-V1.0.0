import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/lib/app-context';

const PLANS = [
  {
    id: 'report',
    title: '命运之书',
    subtitle: '深度人格解析报告',
    price: '¥9.9',
    originalPrice: '¥29.9',
    features: [
      '✦ 完整16维度人格解析',
      '✦ 天赋密码与阴影面剖析',
      '✦ 职业命轨与财运走向',
      '✦ 情感模式与灵魂伴侣图谱',
      '✦ 专属塔罗牌阵解读',
    ],
    highlight: false,
  },
  {
    id: 'premium',
    title: '星轨永久会员',
    subtitle: '解锁全部功能',
    price: '¥18.0',
    originalPrice: '¥68.0',
    features: [
      '✦ 包含命运之书全部内容',
      '✦ 无限宿命羁绊沙盘槽位',
      '✦ 每日专属能量播报',
      '✦ 未来功能永久免费使用',
      '✦ 优先体验新功能',
    ],
    highlight: true,
  },
];

export default function PaywallScreen() {
  const { setIsPremiumUser } = useApp();
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = async () => {
    setIsProcessing(true);
    // Simulate payment process
    setTimeout(async () => {
      setIsProcessing(false);
      Alert.alert(
        '✦ 支付演示',
        '这是支付功能的展示界面。在实际产品中，此处将跳转至支付宝/微信支付完成购买。',
        [
          {
            text: '模拟支付成功',
            onPress: async () => {
              await setIsPremiumUser(true);
              Alert.alert('✦ 解锁成功', '你的星轨已永久解锁！', [
                { text: '进入星轨', onPress: () => router.replace('/(tabs)') },
              ]);
            },
          },
          { text: '取消', style: 'cancel' },
        ]
      );
    }, 800);
  };

  return (
    <LinearGradient colors={['#0F172A', '#1a1f35', '#0F172A']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← 返回</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.decorText}>✦ · · · ✦ · · · ✦</Text>
          <Text style={styles.title}>解锁命运之书</Text>
          <Text style={styles.subtitle}>让星轨为你揭示灵魂的全部密码</Text>
        </View>

        {/* Plans */}
        {PLANS.map((plan) => (
          <Pressable
            key={plan.id}
            style={[
              styles.planCard,
              selectedPlan === plan.id && styles.planCardSelected,
              plan.highlight && styles.planCardHighlight,
            ]}
            onPress={() => setSelectedPlan(plan.id)}
          >
            {plan.highlight && (
              <View style={styles.recommendBadge}>
                <Text style={styles.recommendBadgeText}>推荐</Text>
              </View>
            )}
            <View style={styles.planHeader}>
              <View style={styles.planRadio}>
                {selectedPlan === plan.id && <View style={styles.planRadioInner} />}
              </View>
              <View style={styles.planTitleContainer}>
                <Text style={styles.planTitle}>{plan.title}</Text>
                <Text style={styles.planSubtitle}>{plan.subtitle}</Text>
              </View>
              <View style={styles.planPriceContainer}>
                <Text style={styles.planPrice}>{plan.price}</Text>
                <Text style={styles.planOriginalPrice}>{plan.originalPrice}</Text>
              </View>
            </View>
            <View style={styles.planFeatures}>
              {plan.features.map((feature, i) => (
                <Text key={i} style={styles.planFeatureText}>{feature}</Text>
              ))}
            </View>
          </Pressable>
        ))}

        {/* Payment Methods */}
        <View style={styles.paymentMethods}>
          <Text style={styles.paymentMethodsTitle}>支持支付方式</Text>
          <View style={styles.paymentMethodsRow}>
            <View style={styles.paymentMethodBadge}>
              <Text style={styles.paymentMethodText}>💚 微信支付</Text>
            </View>
            <View style={styles.paymentMethodBadge}>
              <Text style={styles.paymentMethodText}>💙 支付宝</Text>
            </View>
          </View>
        </View>

        {/* Purchase Button */}
        <Pressable
          style={({ pressed }) => [styles.purchaseButton, pressed && styles.buttonPressed, isProcessing && styles.buttonDisabled]}
          onPress={handlePurchase}
          disabled={isProcessing}
        >
          <LinearGradient
            colors={['#D4AF37', '#B8960C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.purchaseButtonGradient}
          >
            <Text style={styles.purchaseButtonText}>
              {isProcessing ? '处理中...' : `立即解锁 ${PLANS.find(p => p.id === selectedPlan)?.price}`}
            </Text>
          </LinearGradient>
        </Pressable>

        {/* Terms */}
        <Text style={styles.termsText}>
          购买即表示同意《用户协议》和《隐私政策》{'\n'}
          一次购买，永久有效 · 不支持退款
        </Text>

        {/* Demo Notice */}
        <View style={styles.demoNotice}>
          <Text style={styles.demoNoticeText}>
            📌 演示说明：此为支付功能展示界面，点击"立即解锁"可体验完整支付流程演示
          </Text>
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
  header: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 15,
    color: '#94A3B8',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  titleSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  decorText: {
    fontSize: 12,
    color: '#D4AF37',
    letterSpacing: 4,
    marginBottom: 12,
    opacity: 0.6,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#E2E8F0',
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 22,
  },
  planCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#334155',
    marginBottom: 16,
    position: 'relative',
  },
  planCardSelected: {
    borderColor: '#D4AF37',
  },
  planCardHighlight: {
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
  },
  recommendBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: '#D4AF37',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  recommendBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: 1,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  planRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D4AF37',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  planRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D4AF37',
  },
  planTitleContainer: {
    flex: 1,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E2E8F0',
    marginBottom: 2,
  },
  planSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  planPriceContainer: {
    alignItems: 'flex-end',
  },
  planPrice: {
    fontSize: 22,
    fontWeight: '900',
    color: '#D4AF37',
  },
  planOriginalPrice: {
    fontSize: 12,
    color: '#475569',
    textDecorationLine: 'line-through',
  },
  planFeatures: {
    gap: 6,
  },
  planFeatureText: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 22,
  },
  paymentMethods: {
    marginBottom: 24,
    alignItems: 'center',
  },
  paymentMethodsTitle: {
    fontSize: 12,
    color: '#475569',
    letterSpacing: 2,
    marginBottom: 12,
  },
  paymentMethodsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  paymentMethodBadge: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  paymentMethodText: {
    fontSize: 13,
    color: '#94A3B8',
  },
  purchaseButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
  },
  purchaseButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  purchaseButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: 1,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  termsText: {
    fontSize: 11,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  demoNotice: {
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  demoNoticeText: {
    fontSize: 12,
    color: '#D4AF37',
    lineHeight: 20,
    textAlign: 'center',
  },
});
