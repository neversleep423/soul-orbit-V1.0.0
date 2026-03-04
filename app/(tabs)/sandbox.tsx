import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  FlatList,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/lib/app-context';
import { calculateRelation } from '@/constants/content';
import type { RelationModel } from '@/lib/app-context';

const MBTI_OPTIONS = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
];

export default function SandboxScreen() {
  const { user, relations, addRelation, removeRelation } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [friendName, setFriendName] = useState('');
  const [selectedMbti, setSelectedMbti] = useState('');

  const canAddMore = user.isPremiumUser || relations.length < 1;

  const handleAddFriend = () => {
    if (!canAddMore) {
      setShowPaywall(true);
      return;
    }
    setShowAddModal(true);
  };

  const handleConfirmAdd = async () => {
    if (!friendName.trim()) {
      Alert.alert('提示', '请输入好友名称');
      return;
    }
    if (!selectedMbti) {
      Alert.alert('提示', '请选择好友的MBTI类型');
      return;
    }
    const relation = calculateRelation(user.mbtiResult, selectedMbti);
    await addRelation({
      name: friendName.trim(),
      mbti: selectedMbti,
      relationType: relation.type,
    });
    setShowAddModal(false);
    setFriendName('');
    setSelectedMbti('');
  };

  const handleViewRelation = (relation: RelationModel) => {
    router.push({
      pathname: '/relation-result',
      params: {
        friendName: relation.name,
        friendMbti: relation.mbti,
        relationType: relation.relationType,
      },
    });
  };

  const handleDeleteRelation = (id: string, name: string) => {
    Alert.alert(
      '删除羁绊',
      `确定要删除与 ${name} 的宿命羁绊吗？`,
      [
        { text: '取消', style: 'cancel' },
        { text: '删除', style: 'destructive', onPress: () => removeRelation(id) },
      ]
    );
  };

  const renderRelationItem = ({ item }: { item: RelationModel }) => (
    <Pressable
      style={({ pressed }) => [styles.relationCard, pressed && styles.cardPressed]}
      onPress={() => handleViewRelation(item)}
    >
      <View style={styles.relationCardLeft}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{item.name[0]}</Text>
        </View>
        <View style={styles.relationInfo}>
          <Text style={styles.relationName}>{item.name}</Text>
          <Text style={styles.relationMbti}>{item.mbti}</Text>
        </View>
      </View>
      <View style={styles.relationCardRight}>
        <View style={styles.relationTypeBadge}>
          <Text style={styles.relationTypeText}>{item.relationType}</Text>
        </View>
        <Pressable
          style={styles.deleteButton}
          onPress={() => handleDeleteRelation(item.id, item.name)}
        >
          <Text style={styles.deleteButtonText}>✕</Text>
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <LinearGradient colors={['#0F172A', '#1a1f35', '#0F172A']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>宿命羁绊沙盘</Text>
        <Text style={styles.headerSubtitle}>✦ 探索灵魂的星轨交汇 ✦</Text>
      </View>

      {/* My MBTI */}
      <View style={styles.myMbtiCard}>
        <Text style={styles.myMbtiLabel}>我的星轨</Text>
        <Text style={styles.myMbtiValue}>{user.mbtiResult || '未测试'}</Text>
      </View>

      {/* Relations List */}
      {relations.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🌌</Text>
          <Text style={styles.emptyTitle}>星轨尚无交汇</Text>
          <Text style={styles.emptyText}>添加好友，探索你们之间的宿命羁绊</Text>
        </View>
      ) : (
        <FlatList
          data={relations}
          keyExtractor={(item) => item.id}
          renderItem={renderRelationItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Add Button */}
      <View style={styles.addButtonContainer}>
        {!user.isPremiumUser && relations.length >= 1 && (
          <Text style={styles.limitText}>免费版仅支持1个合盘槽位</Text>
        )}
        <Pressable
          style={({ pressed }) => [styles.addButton, pressed && styles.buttonPressed]}
          onPress={handleAddFriend}
        >
          <LinearGradient
            colors={['#D4AF37', '#B8960C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.addButtonGradient}
          >
            <Text style={styles.addButtonText}>+ 添加宿命羁绊</Text>
          </LinearGradient>
        </Pressable>
      </View>

      {/* Add Friend Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>添加宿命羁绊</Text>

            <Text style={styles.inputLabel}>好友名称</Text>
            <TextInput
              style={styles.textInput}
              value={friendName}
              onChangeText={setFriendName}
              placeholder="输入好友名称..."
              placeholderTextColor="#475569"
              maxLength={20}
            />

            <Text style={styles.inputLabel}>好友的 MBTI 类型</Text>
            <ScrollView style={styles.mbtiGrid} showsVerticalScrollIndicator={false}>
              <View style={styles.mbtiGridInner}>
                {MBTI_OPTIONS.map((mbti) => (
                  <Pressable
                    key={mbti}
                    style={[
                      styles.mbtiOption,
                      selectedMbti === mbti && styles.mbtiOptionSelected,
                    ]}
                    onPress={() => setSelectedMbti(mbti)}
                  >
                    <Text
                      style={[
                        styles.mbtiOptionText,
                        selectedMbti === mbti && styles.mbtiOptionTextSelected,
                      ]}
                    >
                      {mbti}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalButtons}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => {
                  setShowAddModal(false);
                  setFriendName('');
                  setSelectedMbti('');
                }}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </Pressable>
              <Pressable
                style={styles.confirmButton}
                onPress={handleConfirmAdd}
              >
                <LinearGradient
                  colors={['#D4AF37', '#B8960C']}
                  style={styles.confirmButtonGradient}
                >
                  <Text style={styles.confirmButtonText}>确认合盘</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Paywall Modal */}
      <Modal visible={showPaywall} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.paywallContent}>
            <Text style={styles.paywallTitle}>✦ 解锁无限羁绊</Text>
            <Text style={styles.paywallSubtitle}>永久解锁无限宿命羁绊沙盘槽位</Text>

            <View style={styles.paywallFeatures}>
              <Text style={styles.paywallFeature}>✦ 无限添加宿命羁绊</Text>
              <Text style={styles.paywallFeature}>✦ 查看所有合盘详情</Text>
              <Text style={styles.paywallFeature}>✦ 永久保存羁绊记录</Text>
            </View>

            <View style={styles.paywallPriceContainer}>
              <Text style={styles.paywallPrice}>¥18.00</Text>
              <Text style={styles.paywallPriceDesc}>永久解锁</Text>
            </View>

            <Pressable
              style={styles.paywallButton}
              onPress={() => {
                setShowPaywall(false);
                router.push('/paywall');
              }}
            >
              <LinearGradient
                colors={['#D4AF37', '#B8960C']}
                style={styles.paywallButtonGradient}
              >
                <Text style={styles.paywallButtonText}>立即解锁 ✦</Text>
              </LinearGradient>
            </Pressable>

            <Pressable onPress={() => setShowPaywall(false)}>
              <Text style={styles.paywallDismiss}>暂时不需要</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#E2E8F0',
    letterSpacing: 2,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#D4AF37',
    letterSpacing: 2,
    opacity: 0.7,
  },
  myMbtiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  myMbtiLabel: {
    fontSize: 13,
    color: '#94A3B8',
    letterSpacing: 1,
  },
  myMbtiValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#D4AF37',
    letterSpacing: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E2E8F0',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  relationCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardPressed: {
    opacity: 0.7,
  },
  relationCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderWidth: 1,
    borderColor: '#D4AF37',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#D4AF37',
  },
  relationInfo: {
    flex: 1,
  },
  relationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E2E8F0',
    marginBottom: 2,
  },
  relationMbti: {
    fontSize: 12,
    color: '#94A3B8',
    letterSpacing: 2,
  },
  relationCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  relationTypeBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  relationTypeText: {
    fontSize: 11,
    color: '#D4AF37',
    fontWeight: '600',
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(241, 113, 113, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    fontSize: 12,
    color: '#F87171',
  },
  addButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    paddingTop: 12,
    alignItems: 'center',
  },
  limitText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
    letterSpacing: 1,
  },
  addButton: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
  },
  addButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: 1,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    borderTopWidth: 1,
    borderColor: '#334155',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E2E8F0',
    letterSpacing: 2,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 12,
    color: '#94A3B8',
    letterSpacing: 2,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#E2E8F0',
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  mbtiGrid: {
    maxHeight: 160,
    marginBottom: 20,
  },
  mbtiGridInner: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  mbtiOption: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#0F172A',
  },
  mbtiOptionSelected: {
    borderColor: '#D4AF37',
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
  },
  mbtiOptionText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
    letterSpacing: 1,
  },
  mbtiOptionTextSelected: {
    color: '#D4AF37',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cancelButtonText: {
    fontSize: 15,
    color: '#94A3B8',
  },
  confirmButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  confirmButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  // Paywall styles
  paywallContent: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 32,
    borderTopWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    alignItems: 'center',
  },
  paywallTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#D4AF37',
    letterSpacing: 2,
    marginBottom: 8,
  },
  paywallSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 24,
    textAlign: 'center',
  },
  paywallFeatures: {
    width: '100%',
    marginBottom: 24,
    gap: 8,
  },
  paywallFeature: {
    fontSize: 14,
    color: '#CBD5E1',
    letterSpacing: 1,
  },
  paywallPriceContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  paywallPrice: {
    fontSize: 40,
    fontWeight: '900',
    color: '#D4AF37',
  },
  paywallPriceDesc: {
    fontSize: 13,
    color: '#64748B',
    letterSpacing: 2,
  },
  paywallButton: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
  },
  paywallButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  paywallButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: 2,
  },
  paywallDismiss: {
    fontSize: 13,
    color: '#475569',
    letterSpacing: 1,
  },
});
