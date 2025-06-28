import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
];

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => Promise<void>;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = '@ai_terminal_language';

// Translation dictionaries
const translations: Record<string, Record<string, string>> = {
  en: {
    // Terminal
    'terminal.title': 'Terminal',
    'terminal.connected': 'Connected',
    'terminal.placeholder': 'Enter command...',
    'terminal.history': 'History',
    'terminal.aiAssist': 'AI Assist',
    'terminal.welcome': '🚀 AI Terminal Shell v1.0.0 - iPad Optimized',
    'terminal.enhanced': 'Enhanced for iPad with split-screen support and advanced features',
    'terminal.help': 'Type "help" for available commands or "ai <query>" for AI assistance',
    
    // AI Assistant
    'ai.title': 'AI Assistant',
    'ai.status': 'Claude AI',
    'ai.placeholder': 'Ask me anything about terminal commands, scripting, or system administration...',
    'ai.quickQuestions': 'Quick Questions:',
    'ai.welcome': '👋 **Welcome to AI Terminal Assistant**',
    'ai.welcomeDesc': 'I\'m your intelligent command-line companion, powered by advanced AI. I\'m here to help you become a terminal master!',
    
    // Connections
    'connections.title': 'SSH Connections',
    'connections.addConnection': 'Add Connection',
    'connections.connect': 'Connect',
    'connections.disconnect': 'Disconnect',
    'connections.connecting': 'Connecting...',
    'connections.terminal': 'Terminal',
    'connections.connected': 'connected',
    'connections.disconnected': 'disconnected',
    
    // Settings
    'settings.title': 'Settings',
    'settings.appearance': 'Appearance & Display',
    'settings.ai': 'AI Assistant & Intelligence',
    'settings.connection': 'Connection & Network',
    'settings.security': 'Security & Privacy',
    'settings.experience': 'User Experience',
    'settings.data': 'Data & Backup',
    'settings.about': 'About & Support',
    'settings.language': 'Language',
    'settings.languageDesc': 'Choose your preferred language',
    'settings.terminalTheme': 'Terminal Theme',
    'settings.font': 'Font & Typography',
    'settings.smartSuggestions': 'Smart Suggestions',
    'settings.notifications': 'Smart Notifications',
    'settings.autoConnect': 'Auto Connect',
    'settings.secureMode': 'Enhanced Security',
    'settings.clearData': 'Clear All Data',
    'settings.export': 'Export Configuration',
    'settings.import': 'Import Configuration',
    'settings.aboutApp': 'About AI Terminal Shell',
    
    // Common
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.close': 'Close',
    'common.select': 'Select',
    'common.done': 'Done',
  },
  ko: {
    // Terminal
    'terminal.title': '터미널',
    'terminal.connected': '연결됨',
    'terminal.placeholder': '명령어를 입력하세요...',
    'terminal.history': '히스토리',
    'terminal.aiAssist': 'AI 도움',
    'terminal.welcome': '🚀 AI 터미널 셸 v1.0.0 - iPad 최적화',
    'terminal.enhanced': 'iPad용으로 향상된 분할 화면 지원 및 고급 기능',
    'terminal.help': '"help"를 입력하여 사용 가능한 명령어를 보거나 "ai <질문>"으로 AI 도움을 받으세요',
    
    // AI Assistant
    'ai.title': 'AI 어시스턴트',
    'ai.status': 'Claude AI',
    'ai.placeholder': '터미널 명령어, 스크립팅 또는 시스템 관리에 대해 무엇이든 물어보세요...',
    'ai.quickQuestions': '빠른 질문:',
    'ai.welcome': '👋 **AI 터미널 어시스턴트에 오신 것을 환영합니다**',
    'ai.welcomeDesc': '저는 고급 AI로 구동되는 지능형 명령줄 동반자입니다. 터미널 마스터가 되도록 도와드리겠습니다!',
    
    // Connections
    'connections.title': 'SSH 연결',
    'connections.addConnection': '연결 추가',
    'connections.connect': '연결',
    'connections.disconnect': '연결 해제',
    'connections.connecting': '연결 중...',
    'connections.terminal': '터미널',
    'connections.connected': '연결됨',
    'connections.disconnected': '연결 해제됨',
    
    // Settings
    'settings.title': '설정',
    'settings.appearance': '외관 및 디스플레이',
    'settings.ai': 'AI 어시스턴트 및 인텔리전스',
    'settings.connection': '연결 및 네트워크',
    'settings.security': '보안 및 개인정보',
    'settings.experience': '사용자 경험',
    'settings.data': '데이터 및 백업',
    'settings.about': '정보 및 지원',
    'settings.language': '언어',
    'settings.languageDesc': '선호하는 언어를 선택하세요',
    'settings.terminalTheme': '터미널 테마',
    'settings.font': '폰트 및 타이포그래피',
    'settings.smartSuggestions': '스마트 제안',
    'settings.notifications': '스마트 알림',
    'settings.autoConnect': '자동 연결',
    'settings.secureMode': '향상된 보안',
    'settings.clearData': '모든 데이터 지우기',
    'settings.export': '설정 내보내기',
    'settings.import': '설정 가져오기',
    'settings.aboutApp': 'AI 터미널 셸 정보',
    
    // Common
    'common.cancel': '취소',
    'common.save': '저장',
    'common.delete': '삭제',
    'common.edit': '편집',
    'common.close': '닫기',
    'common.select': '선택',
    'common.done': '완료',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(SUPPORTED_LANGUAGES[0]);

  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const savedLanguageCode = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedLanguageCode) {
        const language = SUPPORTED_LANGUAGES.find(lang => lang.code === savedLanguageCode);
        if (language) {
          setCurrentLanguage(language);
        }
      }
    } catch (error) {
      console.error('Failed to load saved language:', error);
    }
  };

  const setLanguage = async (language: Language) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, language.code);
      setCurrentLanguage(language);
    } catch (error) {
      console.error('Failed to save language:', error);
    }
  };

  const t = (key: string): string => {
    const languageTranslations = translations[currentLanguage.code] || translations.en;
    return languageTranslations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}