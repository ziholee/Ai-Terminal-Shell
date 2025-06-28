interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ClaudeResponse {
  content: Array<{
    type: 'text';
    text: string;
  }>;
  id: string;
  model: string;
  role: 'assistant';
  stop_reason: string;
  stop_sequence: null;
  type: 'message';
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

interface ClaudeError {
  type: string;
  message: string;
}

export class ClaudeApiService {
  private apiKey: string;
  private apiUrl: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.EXPO_PUBLIC_CLAUDE_API_KEY || '';
    this.apiUrl = process.env.EXPO_PUBLIC_ANTHROPIC_API_URL || 'https://api.anthropic.com/v1/messages';
    this.model = 'claude-3-sonnet-20240229';
  }

  private validateApiKey(): boolean {
    if (!this.apiKey || this.apiKey === 'your_claude_api_key_here') {
      return false;
    }
    return true;
  }

  async sendMessage(
    message: string, 
    conversationHistory: ClaudeMessage[] = [],
    systemPrompt?: string
  ): Promise<{ success: boolean; response?: string; error?: string; usage?: any }> {
    
    if (!this.validateApiKey()) {
      return {
        success: false,
        error: '🔑 Claude API 키가 설정되지 않았습니다.\n\n설정 방법:\n1. Anthropic Console에서 API 키 발급\n2. .env 파일에 EXPO_PUBLIC_CLAUDE_API_KEY 설정\n3. 앱 재시작\n\n임시로 시뮬레이션 모드로 동작합니다.'
      };
    }

    try {
      // 대화 히스토리 구성
      const messages: ClaudeMessage[] = [
        ...conversationHistory,
        { role: 'user', content: message }
      ];

      // 시스템 프롬프트 설정
      const defaultSystemPrompt = `당신은 터미널과 시스템 관리 전문가인 AI 어시스턴트입니다. 
다음 역할을 수행해주세요:

🎯 주요 역할:
• Unix/Linux 명령어 설명 및 사용법 안내
• 셸 스크립트 작성 및 최적화 도움
• 시스템 보안 및 SSH 설정 가이드
• 네트워크 및 서버 관리 조언
• 터미널 생산성 향상 팁 제공

📝 응답 스타일:
• 명확하고 실용적인 설명
• 코드 예제와 함께 설명
• 보안 모범 사례 강조
• 단계별 가이드 제공
• 이모지를 적절히 사용하여 가독성 향상

🔧 기술 범위:
• Bash, Zsh, Fish 셸
• SSH, SCP, RSYNC
• Docker, Git, Vim/Nano
• 시스템 모니터링 (htop, ps, netstat)
• 네트워크 도구 (curl, wget, ping)
• 파일 권한 및 사용자 관리

사용자의 질문에 대해 정확하고 도움이 되는 답변을 제공해주세요.`;

      const requestBody = {
        model: this.model,
        max_tokens: 2000,
        temperature: 0.7,
        system: systemPrompt || defaultSystemPrompt,
        messages: messages
      };

      console.log('🚀 Claude API 호출 시작:', {
        model: this.model,
        messageCount: messages.length,
        lastMessage: message.substring(0, 100) + '...'
      });

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Claude API 오류:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });

        let errorMessage = `API 호출 실패 (${response.status})`;
        
        if (response.status === 401) {
          errorMessage = '🔐 인증 실패: API 키를 확인해주세요';
        } else if (response.status === 429) {
          errorMessage = '⏰ 요청 한도 초과: 잠시 후 다시 시도해주세요';
        } else if (response.status === 400) {
          errorMessage = '📝 요청 형식 오류: 메시지를 다시 확인해주세요';
        }

        return {
          success: false,
          error: errorMessage
        };
      }

      const data: ClaudeResponse = await response.json();
      
      console.log('✅ Claude API 응답 성공:', {
        responseLength: data.content[0]?.text?.length || 0,
        inputTokens: data.usage?.input_tokens || 0,
        outputTokens: data.usage?.output_tokens || 0
      });

      return {
        success: true,
        response: data.content[0]?.text || '응답을 받지 못했습니다.',
        usage: data.usage
      };

    } catch (error) {
      console.error('💥 Claude API 네트워크 오류:', error);
      
      return {
        success: false,
        error: `🌐 네트워크 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}\n\n인터넷 연결을 확인하고 다시 시도해주세요.`
      };
    }
  }

  // 대화 히스토리 관리를 위한 헬퍼 메서드
  static formatConversationHistory(messages: Array<{ type: 'user' | 'ai'; content: string }>): ClaudeMessage[] {
    return messages
      .filter(msg => msg.type === 'user' || msg.type === 'ai')
      .map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))
      .slice(-10); // 최근 10개 메시지만 유지 (토큰 절약)
  }

  // 토큰 사용량 추정
  static estimateTokens(text: string): number {
    // 대략적인 토큰 추정 (실제로는 더 복잡함)
    return Math.ceil(text.length / 4);
  }

  // API 키 유효성 검사
  async validateConnection(): Promise<{ valid: boolean; error?: string }> {
    if (!this.validateApiKey()) {
      return {
        valid: false,
        error: 'API 키가 설정되지 않았습니다'
      };
    }

    try {
      const testResponse = await this.sendMessage('Hello', [], 'You are a helpful assistant. Respond with just "OK".');
      return {
        valid: testResponse.success,
        error: testResponse.error
      };
    } catch (error) {
      return {
        valid: false,
        error: `연결 테스트 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
      };
    }
  }
}

export const claudeApi = new ClaudeApiService();