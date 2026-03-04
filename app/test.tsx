import { useState, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Animated,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { QUESTIONS } from '@/constants/questions';
import { calculateMBTI } from '@/constants/content';
import { useApp } from '@/lib/app-context';

const DIMENSION_LABELS: Record<string, string> = {
  EI: '能量之源',
  SN: '感知之眼',
  TF: '决断之刃',
  JP: '命轨之轮',
};

export default function TestScreen() {
  const { setMbtiResult } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B'>>({});
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const currentQuestion = QUESTIONS[currentIndex];
  const progress = (currentIndex / QUESTIONS.length) * 100;
  const isLastQuestion = currentIndex === QUESTIONS.length - 1;

  const handleSelect = (option: 'A' | 'B') => {
    setSelectedOption(option);
  };

  const handleNext = async () => {
    if (!selectedOption) {
      Alert.alert('请选择', '请选择一个选项后继续');
      return;
    }

    const newAnswers = { ...answers, [currentQuestion.id]: selectedOption };
    setAnswers(newAnswers);

    if (isLastQuestion) {
      // Calculate MBTI
      const mbti = calculateMBTI(newAnswers);
      await setMbtiResult(mbti);
      router.replace('/result');
      return;
    }

    // Animate transition
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setCurrentIndex(currentIndex + 1);
    setSelectedOption(null);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedOption(answers[QUESTIONS[currentIndex - 1].id] || null);
    }
  };

  return (
    <LinearGradient colors={['#0F172A', '#1a1f35', '#0F172A']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>灵魂测试</Text>
        <Text style={styles.questionCount}>
          {currentIndex + 1} / {QUESTIONS.length}
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBg}>
          <Animated.View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.dimensionLabel}>
          ✦ {DIMENSION_LABELS[currentQuestion.dimension]}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.questionCard, { opacity: fadeAnim }]}>
          {/* Question Number Decoration */}
          <View style={styles.questionNumberContainer}>
            <Text style={styles.questionNumber}>Q{currentQuestion.id}</Text>
          </View>

          {/* Question Text */}
          <Text style={styles.questionText}>{currentQuestion.text}</Text>

          {/* Options */}
          <View style={styles.optionsContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.optionButton,
                selectedOption === 'A' && styles.optionSelected,
                pressed && styles.optionPressed,
              ]}
              onPress={() => handleSelect('A')}
            >
              <View style={styles.optionHeader}>
                <View style={[styles.optionBadge, selectedOption === 'A' && styles.optionBadgeSelected]}>
                  <Text style={[styles.optionBadgeText, selectedOption === 'A' && styles.optionBadgeTextSelected]}>A</Text>
                </View>
              </View>
              <Text style={[styles.optionText, selectedOption === 'A' && styles.optionTextSelected]}>
                {currentQuestion.optionA}
              </Text>
            </Pressable>

            <View style={styles.orDivider}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>或</Text>
              <View style={styles.orLine} />
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.optionButton,
                selectedOption === 'B' && styles.optionSelected,
                pressed && styles.optionPressed,
              ]}
              onPress={() => handleSelect('B')}
            >
              <View style={styles.optionHeader}>
                <View style={[styles.optionBadge, selectedOption === 'B' && styles.optionBadgeSelected]}>
                  <Text style={[styles.optionBadgeText, selectedOption === 'B' && styles.optionBadgeTextSelected]}>B</Text>
                </View>
              </View>
              <Text style={[styles.optionText, selectedOption === 'B' && styles.optionTextSelected]}>
                {currentQuestion.optionB}
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navContainer}>
        {currentIndex > 0 && (
          <Pressable style={styles.prevButton} onPress={handlePrev}>
            <Text style={styles.prevButtonText}>← 上一题</Text>
          </Pressable>
        )}
        <Pressable
          style={[styles.nextButton, !selectedOption && styles.nextButtonDisabled]}
          onPress={handleNext}
        >
          <LinearGradient
            colors={selectedOption ? ['#D4AF37', '#B8960C'] : ['#334155', '#334155']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextButtonGradient}
          >
            <Text style={[styles.nextButtonText, !selectedOption && styles.nextButtonTextDisabled]}>
              {isLastQuestion ? '揭示命运 ✦' : '继续探索 →'}
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E2E8F0',
    letterSpacing: 2,
  },
  questionCount: {
    fontSize: 14,
    color: '#D4AF37',
    fontWeight: '600',
  },
  progressContainer: {
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  progressBg: {
    height: 3,
    backgroundColor: '#1E293B',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#D4AF37',
    borderRadius: 2,
  },
  dimensionLabel: {
    fontSize: 11,
    color: '#D4AF37',
    letterSpacing: 2,
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexGrow: 1,
  },
  questionCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  questionNumberContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  questionNumber: {
    fontSize: 12,
    color: '#D4AF37',
    fontWeight: '700',
    letterSpacing: 1,
  },
  questionText: {
    fontSize: 17,
    color: '#E2E8F0',
    lineHeight: 28,
    marginBottom: 24,
    fontWeight: '500',
  },
  optionsContainer: {
    gap: 0,
  },
  optionButton: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  optionSelected: {
    borderColor: '#D4AF37',
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
  },
  optionPressed: {
    opacity: 0.8,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#475569',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionBadgeSelected: {
    backgroundColor: '#D4AF37',
    borderColor: '#D4AF37',
  },
  optionBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  optionBadgeTextSelected: {
    color: '#0F172A',
  },
  optionText: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 22,
  },
  optionTextSelected: {
    color: '#E2E8F0',
  },
  orDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    paddingHorizontal: 8,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#1E293B',
  },
  orText: {
    fontSize: 12,
    color: '#475569',
    marginHorizontal: 12,
    letterSpacing: 1,
  },
  navContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 12,
    gap: 12,
  },
  prevButton: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    justifyContent: 'center',
  },
  prevButtonText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  nextButton: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: 1,
  },
  nextButtonTextDisabled: {
    color: '#64748B',
  },
});
