import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import { 
  CreditCard, 
  Sparkles, 
  Check, 
  X, 
  Zap, 
  Crown, 
  Star,
  Shield,
  Infinity
} from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  onSubscribe: (plan: string) => void;
}

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  icon: any;
  color: string;
  popular?: boolean;
}

const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: '₩9,900',
    period: '/월',
    description: 'AI 어시스턴트 기본 기능',
    features: [
      '월 100회 AI 질문',
      '기본 명령어 설명',
      '코드 분석 기능',
      '이메일 지원'
    ],
    icon: Zap,
    color: '#87CEEB'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₩19,900',
    period: '/월',
    description: '전문가를 위한 고급 기능',
    features: [
      '월 500회 AI 질문',
      '고급 스크립트 분석',
      '보안 감사 기능',
      '우선 지원',
      '커스텀 프롬프트',
      '히스토리 백업'
    ],
    icon: Crown,
    color: '#FFD700',
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '₩49,900',
    period: '/월',
    description: '팀과 기업을 위한 무제한',
    features: [
      '무제한 AI 질문',
      '팀 협업 기능',
      '고급 보안 분석',
      '24/7 전담 지원',
      'API 접근',
      '온프레미스 배포',
      '커스텀 통합'
    ],
    icon: Infinity,
    color: '#00FF00'
  }
];

export default function PaymentModal({ visible, onClose, onSubscribe }: PaymentModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>('pro');

  const handleSubscribe = () => {
    const plan = PRICING_PLANS.find(p => p.id === selectedPlan);
    if (plan) {
      Alert.alert(
        '구독 확인',
        `${plan.name} 플랜 (${plan.price}${plan.period})을 구독하시겠습니까?`,
        [
          { text: '취소', style: 'cancel' },
          {
            text: '구독하기',
            onPress: () => {
              onSubscribe(selectedPlan);
              onClose();
              Alert.alert('구독 완료', `${plan.name} 플랜이 활성화되었습니다!`);
            }
          }
        ]
      );
    }
  };

  const PlanCard = ({ plan }: { plan: PricingPlan }) => {
    const IconComponent = plan.icon;
    const isSelected = selectedPlan === plan.id;

    return (
      <TouchableOpacity
        style={[
          styles.planCard,
          isSelected && styles.selectedPlan,
          plan.popular && styles.popularPlan
        ]}
        onPress={() => setSelectedPlan(plan.id)}
      >
        {plan.popular && (
          <View style={styles.popularBadge}>
            <Star size={isTablet ? 16 : 14} color="#000" />
            <Text style={styles.popularText}>인기</Text>
          </View>
        )}

        <View style={styles.planHeader}>
          <View style={[styles.planIcon, { backgroundColor: plan.color + '20' }]}>
            <IconComponent size={isTablet ? 32 : 28} color={plan.color} />
          </View>
          <Text style={styles.planName}>{plan.name}</Text>
          <Text style={styles.planDescription}>{plan.description}</Text>
        </View>

        <View style={styles.planPricing}>
          <Text style={styles.planPrice}>{plan.price}</Text>
          <Text style={styles.planPeriod}>{plan.period}</Text>
        </View>

        <View style={styles.planFeatures}>
          {plan.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Check size={isTablet ? 18 : 16} color="#00FF00" />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Check size={isTablet ? 24 : 20} color="#00FF00" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={isTablet ? 24 : 20} color="#666" />
          </TouchableOpacity>
          <Text style={styles.title}>AI 어시스턴트 구독</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.heroSection}>
            <View style={styles.heroIcon}>
              <Sparkles size={isTablet ? 48 : 40} color="#FFD700" />
            </View>
            <Text style={styles.heroTitle}>🚀 AI 파워 업그레이드</Text>
            <Text style={styles.heroDescription}>
              Claude AI의 강력한 기능을 잠금 해제하고{'\n'}
              터미널 마스터가 되어보세요!
            </Text>
          </View>

          <View style={styles.benefitsSection}>
            <Text style={styles.benefitsTitle}>✨ 프리미엄 혜택</Text>
            <View style={styles.benefitsList}>
              <View style={styles.benefitItem}>
                <Shield size={isTablet ? 24 : 20} color="#00FF00" />
                <View style={styles.benefitContent}>
                  <Text style={styles.benefitTitle}>고급 보안 분석</Text>
                  <Text style={styles.benefitDesc}>시스템 취약점 검사 및 보안 권장사항</Text>
                </View>
              </View>
              <View style={styles.benefitItem}>
                <Zap size={isTablet ? 24 : 20} color="#FFD700" />
                <View style={styles.benefitContent}>
                  <Text style={styles.benefitTitle}>스마트 자동화</Text>
                  <Text style={styles.benefitDesc}>반복 작업 자동화 스크립트 생성</Text>
                </View>
              </View>
              <View style={styles.benefitItem}>
                <Crown size={isTablet ? 24 : 20} color="#87CEEB" />
                <View style={styles.benefitContent}>
                  <Text style={styles.benefitTitle}>전문가 수준 조언</Text>
                  <Text style={styles.benefitDesc}>복잡한 시스템 문제 해결 가이드</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.plansSection}>
            <Text style={styles.plansTitle}>💎 요금제 선택</Text>
            <View style={styles.plansList}>
              {PRICING_PLANS.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </View>
          </View>

          <View style={styles.securitySection}>
            <Shield size={isTablet ? 24 : 20} color="#00FF00" />
            <View style={styles.securityContent}>
              <Text style={styles.securityTitle}>🔒 안전한 결제</Text>
              <Text style={styles.securityText}>
                • 256비트 SSL 암호화{'\n'}
                • PCI DSS 준수{'\n'}
                • 언제든 취소 가능{'\n'}
                • 7일 무료 체험
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
            <CreditCard size={isTablet ? 24 : 20} color="#000" />
            <Text style={styles.subscribeButtonText}>
              {PRICING_PLANS.find(p => p.id === selectedPlan)?.price} 구독하기
            </Text>
          </TouchableOpacity>
          <Text style={styles.footerNote}>
            7일 무료 체험 • 언제든 취소 가능
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: isTablet ? 24 : 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#111',
  },
  closeButton: {
    padding: isTablet ? 8 : 4,
  },
  title: {
    fontFamily: 'FiraCode-Bold',
    fontSize: isTablet ? 20 : 18,
    color: '#FFF',
  },
  placeholder: {
    width: isTablet ? 40 : 32,
  },
  content: {
    flex: 1,
  },
  heroSection: {
    alignItems: 'center',
    padding: isTablet ? 32 : 24,
    backgroundColor: '#111',
  },
  heroIcon: {
    width: isTablet ? 80 : 64,
    height: isTablet ? 80 : 64,
    borderRadius: isTablet ? 40 : 32,
    backgroundColor: '#2a2a00',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: isTablet ? 20 : 16,
  },
  heroTitle: {
    fontFamily: 'FiraCode-Bold',
    fontSize: isTablet ? 28 : 24,
    color: '#FFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  heroDescription: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 16 : 14,
    color: '#AAA',
    textAlign: 'center',
    lineHeight: isTablet ? 24 : 20,
  },
  benefitsSection: {
    padding: isTablet ? 24 : 16,
  },
  benefitsTitle: {
    fontFamily: 'FiraCode-Bold',
    fontSize: isTablet ? 20 : 18,
    color: '#00FF00',
    marginBottom: isTablet ? 20 : 16,
  },
  benefitsList: {
    gap: isTablet ? 16 : 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#111',
    padding: isTablet ? 16 : 12,
    borderRadius: 12,
    gap: 12,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontFamily: 'FiraCode-Bold',
    fontSize: isTablet ? 16 : 14,
    color: '#FFF',
    marginBottom: 4,
  },
  benefitDesc: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 14 : 12,
    color: '#AAA',
    lineHeight: isTablet ? 20 : 16,
  },
  plansSection: {
    padding: isTablet ? 24 : 16,
  },
  plansTitle: {
    fontFamily: 'FiraCode-Bold',
    fontSize: isTablet ? 20 : 18,
    color: '#00FF00',
    marginBottom: isTablet ? 20 : 16,
  },
  plansList: {
    gap: isTablet ? 16 : 12,
  },
  planCard: {
    backgroundColor: '#111',
    borderRadius: isTablet ? 16 : 12,
    padding: isTablet ? 20 : 16,
    borderWidth: 2,
    borderColor: '#333',
    position: 'relative',
  },
  selectedPlan: {
    borderColor: '#00FF00',
    backgroundColor: '#0a1a0a',
  },
  popularPlan: {
    borderColor: '#FFD700',
  },
  popularBadge: {
    position: 'absolute',
    top: -1,
    right: isTablet ? 20 : 16,
    backgroundColor: '#FFD700',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  popularText: {
    fontFamily: 'FiraCode-Bold',
    fontSize: isTablet ? 12 : 10,
    color: '#000',
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: isTablet ? 20 : 16,
  },
  planIcon: {
    width: isTablet ? 64 : 56,
    height: isTablet ? 64 : 56,
    borderRadius: isTablet ? 32 : 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  planName: {
    fontFamily: 'FiraCode-Bold',
    fontSize: isTablet ? 24 : 20,
    color: '#FFF',
    marginBottom: 4,
  },
  planDescription: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 14 : 12,
    color: '#AAA',
    textAlign: 'center',
  },
  planPricing: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: isTablet ? 20 : 16,
  },
  planPrice: {
    fontFamily: 'FiraCode-Bold',
    fontSize: isTablet ? 32 : 28,
    color: '#FFF',
  },
  planPeriod: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 16 : 14,
    color: '#AAA',
    marginLeft: 4,
  },
  planFeatures: {
    gap: isTablet ? 12 : 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 14 : 12,
    color: '#FFF',
    flex: 1,
  },
  selectedIndicator: {
    position: 'absolute',
    top: isTablet ? 16 : 12,
    right: isTablet ? 16 : 12,
    backgroundColor: '#1a4d1a',
    borderRadius: 20,
    padding: 4,
  },
  securitySection: {
    flexDirection: 'row',
    backgroundColor: '#1a4d1a',
    margin: isTablet ? 24 : 16,
    padding: isTablet ? 20 : 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00FF00',
    gap: 12,
  },
  securityContent: {
    flex: 1,
  },
  securityTitle: {
    fontFamily: 'FiraCode-Bold',
    fontSize: isTablet ? 16 : 14,
    color: '#00FF00',
    marginBottom: 8,
  },
  securityText: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 14 : 12,
    color: '#00FF00',
    lineHeight: isTablet ? 20 : 16,
  },
  footer: {
    padding: isTablet ? 24 : 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#111',
  },
  subscribeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00FF00',
    paddingVertical: isTablet ? 16 : 12,
    borderRadius: 12,
    gap: 8,
    marginBottom: 8,
  },
  subscribeButtonText: {
    fontFamily: 'FiraCode-Bold',
    fontSize: isTablet ? 18 : 16,
    color: '#000',
  },
  footerNote: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 14 : 12,
    color: '#666',
    textAlign: 'center',
  },
});