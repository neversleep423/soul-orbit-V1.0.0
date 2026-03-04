import { useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/lib/app-context';

const STARS: Array<{ top: `${number}%`; left: `${number}%`; size: number; opacity: number }> = [
  { top: '5%', left: '10%', size: 2, opacity: 0.8 },
  { top: '8%', left: '75%', size: 1.5, opacity: 0.6 },
  { top: '12%', left: '45%', size: 3, opacity: 0.9 },
  { top: '15%', left: '20%', size: 1, opacity: 0.5 },
  { top: '18%', left: '88%', size: 2, opacity: 0.7 },
  { top: '22%', left: '35%', size: 1.5, opacity: 0.4 },
  { top: '25%', left: '60%', size: 2.5, opacity: 0.8 },
  { top: '30%', left: '5%', size: 1, opacity: 0.6 },
  { top: '32%', left: '92%', size: 2, opacity: 0.5 },
  { top: '38%', left: '15%', size: 3, opacity: 0.7 },
  { top: '42%', left: '80%', size: 1.5, opacity: 0.9 },
  { top: '48%', left: '50%', size: 1, opacity: 0.4 },
  { top: '55%', left: '25%', size: 2, opacity: 0.6 },
  { top: '58%', left: '70%', size: 2.5, opacity: 0.8 },
  { top: '62%', left: '40%', size: 1, opacity: 0.5 },
  { top: '65%', left: '90%', size: 3, opacity: 0.7 },
  { top: '70%', left: '8%', size: 1.5, opacity: 0.6 },
  { top: '75%', left: '55%', size: 2, opacity: 0.9 },
  { top: '80%', left: '30%', size: 1, opacity: 0.4 },
  { top: '85%', left: '78%', size: 2.5, opacity: 0.7 },
  { top: '88%', left: '18%', size: 1.5, opacity: 0.5 },
  { top: '92%', left: '65%', size: 2, opacity: 0.8 },
  { top: '95%', left: '42%', size: 1, opacity: 0.6 },
  { top: '3%', left: '55%', size: 2, opacity: 0.7 },
  { top: '7%', left: '30%', size: 1.5, opacity: 0.5 },
];

export default function SplashScreen() {
  const { user, isLoading } = useApp();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for the button
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const handleEnter = () => {
    if (!isLoading) {
      if (user.isTestCompleted) {
        router.replace('/(tabs)');
      } else {
        router.replace('/test');
      }
    }
  };

  return (
    <LinearGradient
      colors={['#0F172A', '#1a1f35', '#0F172A']}
      style={styles.container}
    >
      {/* Stars background */}
      <View style={styles.starsContainer}>
        {STARS.map((star, i) => (
          <View
            key={i}
            style={[
              styles.star,
              {
                top: star.top,
                left: star.left,
                width: star.size,
                height: star.size,
                opacity: star.opacity,
              },
            ]}
          />
        ))}
      </View>

      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        {/* Logo / Eye Symbol */}
        <View style={styles.logoContainer}>
          <View style={styles.outerRing}>
            <View style={styles.middleRing}>
              <View style={styles.eyeContainer}>
                <Text style={styles.eyeSymbol}>☽◯☾</Text>
              </View>
            </View>
          </View>
          <View style={styles.orbitLine} />
        </View>

        {/* Title */}
        <Text style={styles.title}>灵魂星轨</Text>
        <Text style={styles.subtitle}>SOUL ORBIT</Text>
        <View style={styles.divider} />
        <Text style={styles.tagline}>探索灵魂深处的星轨密码</Text>
        <Text style={styles.tagline2}>塔罗 · 人格 · 宿命</Text>

        {/* Enter Button */}
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <Pressable
            style={({ pressed }) => [
              styles.enterButton,
              pressed && styles.enterButtonPressed,
            ]}
            onPress={handleEnter}
          >
            <LinearGradient
              colors={['#D4AF37', '#B8960C', '#D4AF37']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.enterButtonText}>✦ 触碰星轨 ✦</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>

        <Text style={styles.privacyText}>100% 本地运行 · 绝对隐私</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  star: {
    position: 'absolute',
    backgroundColor: '#E2E8F0',
    borderRadius: 50,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoContainer: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  outerRing: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: '#D4AF37',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    opacity: 0.4,
  },
  middleRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1.5,
    borderColor: '#D4AF37',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    opacity: 0.7,
  },
  eyeContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderWidth: 2,
    borderColor: '#D4AF37',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeSymbol: {
    fontSize: 24,
    color: '#D4AF37',
  },
  orbitLine: {
    position: 'absolute',
    width: 180,
    height: 1,
    backgroundColor: '#D4AF37',
    opacity: 0.2,
    transform: [{ rotate: '45deg' }],
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#E2E8F0',
    letterSpacing: 6,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '300',
    color: '#D4AF37',
    letterSpacing: 8,
    marginBottom: 16,
  },
  divider: {
    width: 60,
    height: 1,
    backgroundColor: '#D4AF37',
    opacity: 0.6,
    marginBottom: 16,
  },
  tagline: {
    fontSize: 14,
    color: '#94A3B8',
    letterSpacing: 2,
    marginBottom: 4,
  },
  tagline2: {
    fontSize: 12,
    color: '#64748B',
    letterSpacing: 4,
    marginBottom: 48,
  },
  enterButton: {
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  enterButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  buttonGradient: {
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 30,
  },
  enterButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: 3,
  },
  privacyText: {
    fontSize: 11,
    color: '#475569',
    letterSpacing: 1,
  },
});
