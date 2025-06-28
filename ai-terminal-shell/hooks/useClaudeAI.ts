import { useState, useCallback } from 'react';
import { claudeApi, ClaudeApiService } from '@/services/claudeApi';

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

interface UseClaudeAIReturn {
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string, conversationHistory: Message[]) => Promise<Message | null>;
  validateConnection: () => Promise<{ valid: boolean; error?: string }>;
  clearError: () => void;
}

export function useClaudeAI(): UseClaudeAIReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const sendMessage = useCallback(async (
    message: string, 
    conversationHistory: Message[]
  ): Promise<Message | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // 대화 히스토리를 Claude API 형식으로 변환
      const claudeHistory = ClaudeApiService.formatConversationHistory(conversationHistory);

      // Claude API 호출
      const result = await claudeApi.sendMessage(message, claudeHistory);

      if (result.success && result.response) {
        // 응답 카테고리 자동 분류
        let category: Message['category'] = 'general';
        const content = result.response.toLowerCase();
        
        if (content.includes('command') || content.includes('bash') || content.includes('shell')) {
          category = 'command';
        } else if (content.includes('script') || content.includes('code') || content.includes('```')) {
          category = 'code';
        } else if (content.includes('explain') || content.includes('how to') || content.includes('guide')) {
          category = 'explanation';
        }

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: result.response,
          timestamp: new Date(),
          category,
          usage: result.usage
        };

        return aiMessage;
      } else {
        // API 오류 처리
        setError(result.error || '알 수 없는 오류가 발생했습니다.');
        
        // 오류 시 폴백 응답 제공
        const fallbackMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: `❌ **AI 연결 오류**\n\n${result.error}\n\n**임시 도움말:**\n• 일반적인 명령어는 "help" 입력\n• SSH 관련: "explain ssh"\n• Docker 관련: "explain docker"\n• 스크립트 도움: "script help"`,
          timestamp: new Date(),
          category: 'general'
        };

        return fallbackMessage;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '네트워크 오류';
      setError(errorMessage);
      
      // 네트워크 오류 시 폴백 응답
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `🌐 **연결 오류**\n\n${errorMessage}\n\n**오프라인 도움말:**\n• 기본 명령어: ls, cd, pwd, grep\n• 파일 작업: cp, mv, rm, chmod\n• 네트워크: ping, curl, wget\n• 프로세스: ps, top, kill`,
        timestamp: new Date(),
        category: 'general'
      };

      return fallbackMessage;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const validateConnection = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await claudeApi.validateConnection();
      if (!result.valid && result.error) {
        setError(result.error);
      }
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '연결 테스트 실패';
      setError(errorMessage);
      return { valid: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    sendMessage,
    validateConnection,
    clearError
  };
}