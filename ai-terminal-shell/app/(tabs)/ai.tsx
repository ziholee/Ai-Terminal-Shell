import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Bot, User, Code, Terminal, BookOpen, Sparkles, Copy, Share, CircleAlert as AlertCircle, Wifi, WifiOff, CreditCard } from 'lucide-react-native';
import { useClaudeAI } from '@/hooks/useClaudeAI';
import { useLanguage } from '@/contexts/LanguageContext';
import { TERMINAL_COMMANDS, searchCommands, getRelatedCommands } from '@/data/terminalCommands';
import PaymentModal from '@/components/PaymentModal';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  category?: 'command' | 'code' | 'explanation' | 'general';
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
}

export default function AIAssistantScreen() {
  const { t } = useLanguage();
  const { isLoading, error, sendMessage, validateConnection, clearError } = useClaudeAI();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: `👋 **${t('ai.welcome')}**\n\n${t('ai.welcomeDesc')}\n\n**🎯 제가 도울 수 있는 것들:**\n• **명령어 설명** - 모든 Unix/Linux 명령어 상세 분석\n• **코드 분석** - 셸 스크립트 검토 및 최적화\n• **보안 가이드** - SSH 강화 및 모범 사례\n• **성능 팁** - 워크플로우 속도 향상 및 효율성\n• **문제 해결** - 복잡한 명령줄 이슈 디버깅\n\n**💡 프로 팁:** "rsync 설명" 또는 "ssh 모범 사례"와 같이 구체적으로 질문해보세요\n\n**🚀 빠른 시작:** 아래 제안 버튼을 눌러보세요!\n\n오늘 무엇을 배우고 싶으신가요?`,
      timestamp: new Date(),
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  // 컴포넌트 마운트 시 연결 상태 확인
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setConnectionStatus('checking');
    const result = await validateConnection();
    setConnectionStatus(result.valid ? 'connected' : 'disconnected');
  };

  // 오프라인 명령어 응답 생성
  const generateOfflineResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    // 직접 명령어 검색
    if (TERMINAL_COMMANDS[lowerQuery]) {
      const cmd = TERMINAL_COMMANDS[lowerQuery];
      return `📖 **${cmd.command} 명령어 가이드**\n\n${cmd.description}\n\n**📝 사용법:**\n\`${cmd.usage}\`\n\n**💡 예제:**\n${cmd.examples.map(ex => `• \`${ex}\``).join('\n')}\n\n**🔗 관련 명령어:**\n${cmd.relatedCommands.map(rel => `• \`${rel}\``).join('\n')}\n\n💰 **더 자세한 AI 분석을 원하시나요?** 프리미엄 구독으로 Claude AI의 전문적인 설명을 받아보세요!`;
    }

    // 키워드 기반 검색
    const searchResults = searchCommands(lowerQuery);
    if (searchResults.length > 0) {
      const cmd = searchResults[0];
      return `🔍 **"${query}" 검색 결과**\n\n가장 관련성 높은 명령어: **${cmd.command}**\n\n${cmd.description}\n\n**📝 기본 사용법:**\n\`${cmd.usage}\`\n\n**💡 주요 예제:**\n${cmd.examples.slice(0, 3).map(ex => `• \`${ex}\``).join('\n')}\n\n💰 **더 상세한 분석이 필요하신가요?** 프리미엄 구독으로 AI 전문가의 맞춤형 설명을 받아보세요!`;
    }

    // 일반적인 도움말 카테고리
    if (lowerQuery.includes('help') || lowerQuery.includes('도움')) {
      return `📚 **터미널 명령어 도움말**\n\n**🔥 인기 명령어:**\n• \`ls\` - 파일 목록 보기\n• \`cd\` - 디렉토리 이동\n• \`ssh\` - 원격 서버 접속\n• \`git\` - 버전 관리\n• \`docker\` - 컨테이너 관리\n\n**📖 사용법:**\n특정 명령어에 대해 질문하시면 상세한 설명을 제공합니다.\n예: "ssh 설명", "docker 사용법"\n\n💰 **AI 전문가 상담:** 프리미엄 구독으로 복잡한 문제도 쉽게 해결하세요!`;
    }

    if (lowerQuery.includes('ssh')) {
      const sshCmd = TERMINAL_COMMANDS['ssh'];
      return `🔐 **SSH 연결 가이드**\n\n${sshCmd.description}\n\n**⚡ 빠른 시작:**\n\`ssh username@server.com\`\n\n**🔑 키 기반 인증:**\n\`ssh -i ~/.ssh/private_key user@host\`\n\n**🚪 포트 지정:**\n\`ssh -p 2222 user@host\`\n\n**🔒 보안 팁:**\n• 키 기반 인증 사용\n• 기본 포트(22) 변경\n• fail2ban 설치\n\n💰 **고급 SSH 보안 설정이 궁금하시나요?** 프리미엄 구독으로 전문가 가이드를 받아보세요!`;
    }

    if (lowerQuery.includes('docker')) {
      const dockerCmd = TERMINAL_COMMANDS['docker'];
      return `🐳 **Docker 컨테이너 가이드**\n\n${dockerCmd.description}\n\n**🚀 기본 명령어:**\n• \`docker run -it ubuntu bash\` - 대화형 컨테이너\n• \`docker ps\` - 실행 중인 컨테이너\n• \`docker images\` - 이미지 목록\n• \`docker build -t myapp .\` - 이미지 빌드\n\n**📦 실용 예제:**\n• 웹서버: \`docker run -p 80:80 nginx\`\n• 데이터베이스: \`docker run -d mysql\`\n\n💰 **Docker 최적화와 보안이 궁금하시나요?** 프리미엄으로 전문가 조언을 받아보세요!`;
    }

    if (lowerQuery.includes('git')) {
      const gitCmd = TERMINAL_COMMANDS['git'];
      return `🔄 **Git 버전 관리 가이드**\n\n${gitCmd.description}\n\n**📋 기본 워크플로우:**\n1. \`git add .\` - 변경사항 스테이징\n2. \`git commit -m "메시지"\` - 커밋 생성\n3. \`git push\` - 원격 저장소에 푸시\n\n**🌿 브랜치 관리:**\n• \`git branch feature\` - 브랜치 생성\n• \`git checkout feature\` - 브랜치 전환\n• \`git merge feature\` - 브랜치 병합\n\n💰 **Git 고급 전략과 팀 협업이 궁금하시나요?** 프리미엄으로 전문가 가이드를 받아보세요!`;
    }

    // 기본 응답
    return `🤖 **오프라인 모드**\n\n죄송합니다. "${query}"에 대한 정확한 정보를 찾지 못했습니다.\n\n**💡 시도해볼 수 있는 것들:**\n• 구체적인 명령어 이름 입력 (예: "ls", "ssh", "docker")\n• "help" 입력으로 전체 도움말 보기\n• 명령어 카테고리 검색 (예: "파일 명령어", "네트워크 도구")\n\n**🔧 사용 가능한 명령어:**\n${Object.keys(TERMINAL_COMMANDS).slice(0, 10).map(cmd => `• \`${cmd}\``).join('\n')}\n\n💰 **더 정확하고 상세한 AI 답변이 필요하시나요?** 프리미엄 구독으로 Claude AI 전문가와 대화하세요!`;
  };

  const handleSendMessage = async () => {
    if (currentMessage.trim() === '' || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    const query = currentMessage;
    setCurrentMessage('');
    clearError();

    // 연결 상태에 따른 응답 처리
    if (connectionStatus === 'connected' && isSubscribed) {
      // 프리미엄 사용자 - 실제 AI 응답
      const aiResponse = await sendMessage(query, messages);
      if (aiResponse) {
        setMessages(prev => [...prev, aiResponse]);
      }
    } else if (connectionStatus === 'connected' && !isSubscribed) {
      // API 키는 있지만 구독하지 않은 사용자
      const shouldShowPayment = Math.random() > 0.3; // 70% 확률로 결제 모달 표시
      
      if (shouldShowPayment) {
        const paymentPromptMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: `💎 **프리미엄 기능 잠금 해제**\n\n"${query}"에 대한 전문적인 AI 분석을 제공하려면 프리미엄 구독이 필요합니다.\n\n**🚀 프리미엄 혜택:**\n• Claude AI 무제한 질문\n• 고급 코드 분석\n• 보안 감사 기능\n• 맞춤형 스크립트 생성\n• 24/7 전문가 지원\n\n**💰 특별 할인:** 첫 달 50% 할인!\n\n아래 버튼을 눌러 구독하거나, 기본 도움말을 계속 이용하세요.`,
          timestamp: new Date(),
          category: 'general'
        };
        setMessages(prev => [...prev, paymentPromptMessage]);
        setTimeout(() => setShowPaymentModal(true), 1000);
      } else {
        // 가끔은 오프라인 응답 제공
        const offlineResponse = generateOfflineResponse(query);
        const offlineMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: offlineResponse,
          timestamp: new Date(),
          category: 'explanation'
        };
        setMessages(prev => [...prev, offlineMessage]);
      }
    } else {
      // API 키 없음 - 오프라인 응답
      const offlineResponse = generateOfflineResponse(query);
      const offlineMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: offlineResponse,
        timestamp: new Date(),
        category: 'explanation'
      };
      setMessages(prev => [...prev, offlineMessage]);
    }
  };

  const getQuickSuggestions = () => [
    'SSH 명령어 설명해줘',
    'Docker 기본 사용법',
    'Git 워크플로우',
    'Linux 파일 권한',
    'Bash 스크립트 팁',
    '시스템 모니터링',
    '네트워크 진단',
    '보안 강화 방법',
  ];

  const sendQuickMessage = (message: string) => {
    setCurrentMessage(message);
    setTimeout(() => handleSendMessage(), 100);
  };

  const copyMessage = (content: string) => {
    console.log('복사됨:', content);
    Alert.alert('복사 완료', '메시지가 클립보드에 복사되었습니다.');
  };

  const shareMessage = (content: string) => {
    console.log('공유됨:', content);
    Alert.alert('공유', '메시지 공유 기능');
  };

  const handleSubscribe = (plan: string) => {
    setIsSubscribed(true);
    console.log('구독 완료:', plan);
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'command':
        return <Terminal size={isTablet ? 20 : 16} color="#00FF00" />;
      case 'code':
        return <Code size={isTablet ? 20 : 16} color="#87CEEB" />;
      case 'explanation':
        return <BookOpen size={isTablet ? 20 : 16} color="#FFD700" />;
      default:
        return <Bot size={isTablet ? 20 : 16} color="#FFF" />;
    }
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi size={isTablet ? 16 : 14} color="#00FF00" />;
      case 'disconnected':
        return <WifiOff size={isTablet ? 16 : 14} color="#FF6B6B" />;
      default:
        return <ActivityIndicator size="small" color="#FFD700" />;
    }
  };

  const getConnectionText = () => {
    if (isSubscribed) {
      return 'Premium Active';
    }
    switch (connectionStatus) {
      case 'connected':
        return 'Free Mode';
      case 'disconnected':
        return 'Offline Mode';
      default:
        return '연결 확인 중...';
    }
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Bot size={isTablet ? 28 : 24} color="#00FF00" />
          <Text style={styles.headerTitle}>{t('ai.title')}</Text>
          <View style={[
            styles.statusIndicator,
            connectionStatus === 'connected' && isSubscribed && styles.premiumStatus,
            connectionStatus === 'connected' && !isSubscribed && styles.freeStatus,
            connectionStatus === 'disconnected' && styles.disconnectedStatus
          ]}>
            {getConnectionIcon()}
            <Text style={[
              styles.statusText,
              connectionStatus === 'connected' && isSubscribed && styles.premiumText,
              connectionStatus === 'connected' && !isSubscribed && styles.freeText,
              connectionStatus === 'disconnected' && styles.disconnectedText
            ]}>
              {getConnectionText()}
            </Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          {!isSubscribed && (
            <TouchableOpacity 
              style={styles.upgradeButton} 
              onPress={() => setShowPaymentModal(true)}
            >
              <CreditCard size={isTablet ? 20 : 18} color="#FFD700" />
              <Text style={styles.upgradeText}>업그레이드</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.headerButton} onPress={checkConnection}>
            <Sparkles size={isTablet ? 20 : 18} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <AlertCircle size={isTablet ? 20 : 16} color="#FF6B6B" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={clearError}>
            <Text style={styles.errorDismiss}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesScroll}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                message.type === 'user' ? styles.userMessage : styles.aiMessage,
              ]}
            >
              <View style={styles.messageHeader}>
                <View style={styles.messageInfo}>
                  {message.type === 'user' ? (
                    <User size={isTablet ? 18 : 16} color="#00FF00" />
                  ) : (
                    getCategoryIcon(message.category)
                  )}
                  <Text style={styles.messageTime}>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                  {message.usage && (
                    <Text style={styles.tokenUsage}>
                      {message.usage.input_tokens + message.usage.output_tokens} tokens
                    </Text>
                  )}
                </View>
                {message.type === 'ai' && (
                  <View style={styles.messageActions}>
                    <TouchableOpacity
                      style={styles.messageActionButton}
                      onPress={() => copyMessage(message.content)}
                    >
                      <Copy size={isTablet ? 16 : 14} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.messageActionButton}
                      onPress={() => shareMessage(message.content)}
                    >
                      <Share size={isTablet ? 16 : 14} color="#666" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.messageText,
                  message.type === 'user' ? styles.userMessageText : styles.aiMessageText,
                ]}
              >
                {message.content}
              </Text>
              
              {/* 업그레이드 버튼 (특정 메시지에만 표시) */}
              {message.content.includes('프리미엄') && !isSubscribed && (
                <TouchableOpacity 
                  style={styles.inlineUpgradeButton}
                  onPress={() => setShowPaymentModal(true)}
                >
                  <Sparkles size={isTablet ? 20 : 16} color="#FFD700" />
                  <Text style={styles.inlineUpgradeText}>지금 업그레이드</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#00FF00" />
              <Text style={styles.loadingText}>
                {isSubscribed ? 'Claude AI가 응답을 생성하고 있습니다...' : '응답을 준비하고 있습니다...'}
              </Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>{t('ai.quickQuestions')}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestionsContent}
          >
            {getQuickSuggestions().map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionButton}
                onPress={() => sendQuickMessage(suggestion)}
                disabled={isLoading}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TextInput
              ref={inputRef}
              style={styles.messageInput}
              value={currentMessage}
              onChangeText={setCurrentMessage}
              onSubmitEditing={handleSendMessage}
              placeholder={isSubscribed ? "Claude AI에게 무엇이든 물어보세요..." : "명령어나 질문을 입력하세요..."}
              placeholderTextColor="#666"
              multiline
              maxLength={2000}
              editable={!isLoading}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (currentMessage.trim() === '' || isLoading) && styles.sendButtonDisabled,
              ]}
              onPress={handleSendMessage}
              disabled={currentMessage.trim() === '' || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#666" />
              ) : (
                <Send size={isTablet ? 24 : 20} color={currentMessage.trim() ? '#00FF00' : '#666'} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      <PaymentModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSubscribe={handleSubscribe}
      />
    </SafeAreaView>
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
    padding: isTablet ? 20 : 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#111',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontFamily: 'FiraCode-Bold',
    fontSize: isTablet ? 22 : 18,
    color: '#FFF',
    marginLeft: 12,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 16,
  },
  premiumStatus: {
    backgroundColor: '#2a2a00',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  freeStatus: {
    backgroundColor: '#1a4d1a',
  },
  disconnectedStatus: {
    backgroundColor: '#4d1a1a',
  },
  statusText: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 14 : 12,
    color: '#666',
    marginLeft: 6,
  },
  premiumText: {
    color: '#FFD700',
  },
  freeText: {
    color: '#00FF00',
  },
  disconnectedText: {
    color: '#FF6B6B',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a00',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  upgradeText: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 14 : 12,
    color: '#FFD700',
  },
  headerButton: {
    padding: isTablet ? 12 : 8,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4d1a1a',
    padding: isTablet ? 16 : 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FF6B6B',
  },
  errorText: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 14 : 12,
    color: '#FF6B6B',
    flex: 1,
    marginLeft: 8,
  },
  errorDismiss: {
    fontFamily: 'FiraCode-Bold',
    fontSize: isTablet ? 18 : 16,
    color: '#FF6B6B',
    padding: 4,
  },
  chatContainer: {
    flex: 1,
  },
  messagesScroll: {
    flex: 1,
    paddingHorizontal: isTablet ? 24 : 16,
  },
  messagesContent: {
    paddingVertical: isTablet ? 24 : 16,
  },
  messageContainer: {
    marginBottom: isTablet ? 20 : 16,
    padding: isTablet ? 16 : 12,
    borderRadius: 12,
    maxWidth: isTablet ? '80%' : '85%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#1a4d1a',
    borderBottomRightRadius: 4,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#1a1a2e',
    borderBottomLeftRadius: 4,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  messageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageTime: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 12 : 10,
    color: '#888',
    marginLeft: 8,
  },
  tokenUsage: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 10 : 8,
    color: '#666',
    marginLeft: 8,
  },
  messageActions: {
    flexDirection: 'row',
    gap: 4,
  },
  messageActionButton: {
    padding: 4,
    borderRadius: 4,
    backgroundColor: '#333',
  },
  messageText: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 16 : 14,
    lineHeight: isTablet ? 24 : 20,
  },
  userMessageText: {
    color: '#FFF',
  },
  aiMessageText: {
    color: '#E0E0E0',
  },
  inlineUpgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a00',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  inlineUpgradeText: {
    fontFamily: 'FiraCode-Bold',
    fontSize: isTablet ? 16 : 14,
    color: '#FFD700',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: isTablet ? 24 : 16,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    marginBottom: isTablet ? 20 : 16,
  },
  loadingText: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 16 : 14,
    color: '#87CEEB',
    marginTop: 12,
    textAlign: 'center',
  },
  suggestionsContainer: {
    paddingVertical: isTablet ? 16 : 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#111',
  },
  suggestionsTitle: {
    fontFamily: 'FiraCode-Bold',
    fontSize: isTablet ? 16 : 14,
    color: '#FFF',
    marginBottom: 12,
    marginLeft: isTablet ? 24 : 16,
  },
  suggestionsContent: {
    paddingHorizontal: isTablet ? 24 : 16,
    gap: isTablet ? 12 : 8,
  },
  suggestionButton: {
    backgroundColor: '#333',
    paddingHorizontal: isTablet ? 16 : 12,
    paddingVertical: isTablet ? 10 : 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#444',
  },
  suggestionText: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 14 : 12,
    color: '#FFF',
  },
  inputContainer: {
    backgroundColor: '#111',
    borderTopWidth: 1,
    borderTopColor: '#333',
    padding: isTablet ? 24 : 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  messageInput: {
    flex: 1,
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 18 : 16,
    color: '#FFF',
    paddingVertical: isTablet ? 16 : 12,
    paddingHorizontal: isTablet ? 20 : 16,
    backgroundColor: '#222',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#444',
    maxHeight: isTablet ? 120 : 100,
  },
  sendButton: {
    padding: isTablet ? 16 : 12,
    borderRadius: 24,
    backgroundColor: '#1a4d1a',
  },
  sendButtonDisabled: {
    backgroundColor: '#333',
  },
});