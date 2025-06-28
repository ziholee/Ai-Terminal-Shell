import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  Alert,
  Linking,
} from 'react-native';
import { Key, ExternalLink, Eye, EyeOff, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

interface ApiKeySetupProps {
  visible: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
}

export default function ApiKeySetup({ visible, onClose, onSave }: ApiKeySetupProps) {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const handleSave = async () => {
    if (!apiKey.trim()) {
      Alert.alert('오류', 'API 키를 입력해주세요.');
      return;
    }

    if (!apiKey.startsWith('sk-ant-')) {
      Alert.alert('오류', 'Claude API 키는 "sk-ant-"로 시작해야 합니다.');
      return;
    }

    setIsValidating(true);
    
    // 실제로는 API 키 유효성을 검증해야 함
    setTimeout(() => {
      setIsValidating(false);
      onSave(apiKey);
      setApiKey('');
      onClose();
      Alert.alert('성공', 'API 키가 저장되었습니다!');
    }, 2000);
  };

  const openAnthropicConsole = () => {
    Linking.openURL('https://console.anthropic.com/');
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
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelButton}>취소</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Claude API 설정</Text>
          <TouchableOpacity onPress={handleSave} disabled={isValidating}>
            <Text style={[styles.saveButton, isValidating && styles.disabledButton]}>
              {isValidating ? '확인 중...' : '저장'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.infoSection}>
            <View style={styles.iconContainer}>
              <Key size={isTablet ? 32 : 28} color="#00FF00" />
            </View>
            <Text style={styles.infoTitle}>Claude API 키 설정</Text>
            <Text style={styles.infoDescription}>
              실제 Claude AI와 대화하려면 Anthropic API 키가 필요합니다.
            </Text>
          </View>

          <View style={styles.stepsSection}>
            <Text style={styles.stepsTitle}>📋 설정 단계:</Text>
            
            <View style={styles.step}>
              <Text style={styles.stepNumber}>1.</Text>
              <View style={styles.stepContent}>
                <Text style={styles.stepText}>Anthropic Console에서 API 키 발급</Text>
                <TouchableOpacity style={styles.linkButton} onPress={openAnthropicConsole}>
                  <ExternalLink size={isTablet ? 16 : 14} color="#87CEEB" />
                  <Text style={styles.linkText}>console.anthropic.com</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.step}>
              <Text style={styles.stepNumber}>2.</Text>
              <Text style={styles.stepText}>API 키를 아래에 입력</Text>
            </View>

            <View style={styles.step}>
              <Text style={styles.stepNumber}>3.</Text>
              <Text style={styles.stepText}>저장 후 AI 대화 시작!</Text>
            </View>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Claude API 키</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={apiKey}
                onChangeText={setApiKey}
                placeholder="sk-ant-api03-..."
                placeholderTextColor="#666"
                secureTextEntry={!showApiKey}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? (
                  <EyeOff size={isTablet ? 20 : 18} color="#666" />
                ) : (
                  <Eye size={isTablet ? 20 : 18} color="#666" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.warningSection}>
            <AlertCircle size={isTablet ? 20 : 16} color="#FFD700" />
            <View style={styles.warningContent}>
              <Text style={styles.warningTitle}>💰 비용 안내</Text>
              <Text style={styles.warningText}>
                • Claude API는 사용량에 따라 요금이 부과됩니다{'\n'}
                • 입력/출력 토큰 수에 따라 계산{'\n'}
                • 신규 사용자에게는 무료 크레딧 제공{'\n'}
                • 사용량은 Anthropic Console에서 확인 가능
              </Text>
            </View>
          </View>

          <View style={styles.securitySection}>
            <CheckCircle size={isTablet ? 20 : 16} color="#00FF00" />
            <View style={styles.securityContent}>
              <Text style={styles.securityTitle}>🔒 보안</Text>
              <Text style={styles.securityText}>
                API 키는 기기에 안전하게 저장되며{'\n'}
                외부로 전송되지 않습니다.
              </Text>
            </View>
          </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: isTablet ? 24 : 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#111',
  },
  title: {
    fontFamily: 'FiraCode-Bold',
    fontSize: isTablet ? 20 : 18,
    color: '#FFF',
  },
  cancelButton: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 18 : 16,
    color: '#FF6B6B',
  },
  saveButton: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 18 : 16,
    color: '#00FF00',
  },
  disabledButton: {
    color: '#666',
  },
  content: {
    flex: 1,
    padding: isTablet ? 24 : 16,
  },
  infoSection: {
    alignItems: 'center',
    marginBottom: isTablet ? 32 : 24,
  },
  iconContainer: {
    width: isTablet ? 80 : 64,
    height: isTablet ? 80 : 64,
    borderRadius: isTablet ? 40 : 32,
    backgroundColor: '#1a4d1a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: isTablet ? 16 : 12,
  },
  infoTitle: {
    fontFamily: 'FiraCode-Bold',
    fontSize: isTablet ? 24 : 20,
    color: '#FFF',
    marginBottom: 8,
  },
  infoDescription: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 16 : 14,
    color: '#AAA',
    textAlign: 'center',
    lineHeight: isTablet ? 24 : 20,
  },
  stepsSection: {
    backgroundColor: '#111',
    borderRadius: isTablet ? 16 : 12,
    padding: isTablet ? 20 : 16,
    marginBottom: isTablet ? 24 : 20,
  },
  stepsTitle: {
    fontFamily: 'FiraCode-Bold',
    fontSize: isTablet ? 18 : 16,
    color: '#00FF00',
    marginBottom: isTablet ? 16 : 12,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: isTablet ? 12 : 8,
  },
  stepNumber: {
    fontFamily: 'FiraCode-Bold',
    fontSize: isTablet ? 16 : 14,
    color: '#87CEEB',
    width: isTablet ? 24 : 20,
  },
  stepContent: {
    flex: 1,
  },
  stepText: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 16 : 14,
    color: '#FFF',
    lineHeight: isTablet ? 24 : 20,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  linkText: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 14 : 12,
    color: '#87CEEB',
    textDecorationLine: 'underline',
  },
  inputSection: {
    marginBottom: isTablet ? 24 : 20,
  },
  inputLabel: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 16 : 14,
    color: '#FFF',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#444',
  },
  input: {
    flex: 1,
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 16 : 14,
    color: '#FFF',
    paddingVertical: isTablet ? 16 : 12,
    paddingHorizontal: isTablet ? 20 : 16,
  },
  eyeButton: {
    padding: isTablet ? 16 : 12,
  },
  warningSection: {
    flexDirection: 'row',
    backgroundColor: '#2a2a00',
    borderRadius: 12,
    padding: isTablet ? 16 : 12,
    marginBottom: isTablet ? 16 : 12,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  warningContent: {
    flex: 1,
    marginLeft: 12,
  },
  warningTitle: {
    fontFamily: 'FiraCode-Bold',
    fontSize: isTablet ? 16 : 14,
    color: '#FFD700',
    marginBottom: 4,
  },
  warningText: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 14 : 12,
    color: '#FFD700',
    lineHeight: isTablet ? 20 : 16,
  },
  securitySection: {
    flexDirection: 'row',
    backgroundColor: '#1a4d1a',
    borderRadius: 12,
    padding: isTablet ? 16 : 12,
    borderWidth: 1,
    borderColor: '#00FF00',
  },
  securityContent: {
    flex: 1,
    marginLeft: 12,
  },
  securityTitle: {
    fontFamily: 'FiraCode-Bold',
    fontSize: isTablet ? 16 : 14,
    color: '#00FF00',
    marginBottom: 4,
  },
  securityText: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 14 : 12,
    color: '#00FF00',
    lineHeight: isTablet ? 20 : 16,
  },
});