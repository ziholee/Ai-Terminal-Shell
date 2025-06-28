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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Sparkles, ArrowUp, ArrowDown, RotateCcw, Copy, Terminal } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;

interface TerminalLine {
  id: string;
  type: 'command' | 'output' | 'error' | 'ai-suggestion';
  content: string;
  timestamp: Date;
}

const MOCK_COMMANDS = {
  'ls': 'Documents  Downloads  Pictures  Music  Videos  Applications  Projects  Scripts',
  'ls -la': 'total 64\ndrwxr-xr-x  12 developer  staff   384 Jan 15 14:30 .\ndrwxr-xr-x   6 root      admin   192 Jan 10 09:15 ..\n-rw-r--r--   1 developer  staff  1024 Jan 15 14:25 .bashrc\n-rw-r--r--   1 developer  staff   512 Jan 15 14:25 .profile\ndrwxr-xr-x   8 developer  staff   256 Jan 15 14:30 Documents\ndrwxr-xr-x   4 developer  staff   128 Jan 15 14:30 Downloads',
  'pwd': '/Users/developer',
  'whoami': 'developer',
  'date': new Date().toString(),
  'uname -a': 'Darwin iPad-Pro 23.1.0 Darwin Kernel Version 23.1.0: Wed Oct  4 21:15:24 PDT 2023; root:xnu-10002.41.9~6/RELEASE_ARM64_T8103 arm64',
  'ps aux': 'USER       PID  %CPU %MEM    VSZ   RSS  TT  STAT STARTED      TIME COMMAND\nroot         1   0.0  0.1  33804  4352   ??  Ss   12:00AM   0:01.23 /sbin/launchd\ndeveloper  1234   2.1  1.5 123456  7890  s000  S+   14:30PM   0:05.67 /usr/bin/ssh user@server.com\ndeveloper  5678   0.5  0.8  98765  4321  s001  S    14:25PM   0:02.34 /bin/bash',
  'top': 'Processes: 312 total, 2 running, 310 sleeping, 1456 threads\nLoad Avg: 1.23, 1.45, 1.67  CPU usage: 12.34% user, 5.67% sys, 81.99% idle\nSharedLibs: 245M resident, 67M data, 23M linkedit.\nMemUsage: 8.2G used (1.2G wired), 7.8G unused.\nVM: 2.1T vsize, 1.2G framework vsize, 0(0) swapins, 0(0) swapouts.',
  'help': 'Available commands:\n• ls, ls -la - list directory contents\n• pwd - print working directory\n• whoami - current user\n• date - current date and time\n• uname -a - system information\n• ps aux - running processes\n• top - system activity\n• clear - clear terminal\n• history - command history\n• help - show this help\n\nType "ai <query>" for AI-powered assistance',
  'history': 'Command History:\n1  ls\n2  pwd\n3  whoami\n4  ls -la\n5  ps aux\n6  help',
  'clear': 'CLEAR_TERMINAL',
};

export default function TerminalScreen() {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: '1',
      type: 'output',
      content: '🚀 AI Terminal Shell v1.0.0 - iPad Optimized',
      timestamp: new Date(),
    },
    {
      id: '2',
      type: 'output',
      content: 'Enhanced for iPad with split-screen support and advanced features',
      timestamp: new Date(),
    },
    {
      id: '3',
      type: 'output',
      content: 'Type "help" for available commands or "ai <query>" for AI assistance',
      timestamp: new Date(),
    },
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  const executeCommand = (command: string) => {
    const newLines: TerminalLine[] = [
      ...lines,
      {
        id: Date.now().toString(),
        type: 'command',
        content: `developer@ipad:~$ ${command}`,
        timestamp: new Date(),
      },
    ];

    if (command.trim() === '') {
      setLines(newLines);
      return;
    }

    // Add to command history
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);

    // Handle AI commands
    if (command.startsWith('ai ')) {
      const aiQuery = command.substring(3);
      newLines.push({
        id: (Date.now() + 1).toString(),
        type: 'ai-suggestion',
        content: `🤖 AI Assistant analyzing: "${aiQuery}"\n\n💡 Recommendations:\n\nFor "${aiQuery}", consider these approaches:\n• Use 'man <command>' for detailed documentation\n• Try '<command> --help' for quick usage info\n• Use 'which <command>' to locate executable\n• Check 'history | grep <term>' for previous usage\n\n🔍 Advanced Tips:\n• Combine commands with pipes (|) for powerful workflows\n• Use tab completion for faster typing\n• Set aliases for frequently used commands\n\nWould you like me to explain any specific command or concept?`,
        timestamp: new Date(),
      });
    } else if (command === 'clear') {
      setLines([]);
      return;
    } else {
      // Execute regular command
      const output = MOCK_COMMANDS[command as keyof typeof MOCK_COMMANDS] || 
                    `zsh: command not found: ${command}\n\nDid you mean one of these?\n• ${command}help\n• man ${command}\n• which ${command}\n\nType "help" for available commands or "ai ${command}" for AI assistance`;
      
      newLines.push({
        id: (Date.now() + 1).toString(),
        type: output.includes('command not found') ? 'error' : 'output',
        content: output,
        timestamp: new Date(),
      });
    }

    setLines(newLines);
    setCurrentCommand('');
  };

  const navigateHistory = (direction: 'up' | 'down') => {
    if (direction === 'up' && historyIndex < commandHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex]);
    } else if (direction === 'down' && historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex]);
    } else if (direction === 'down' && historyIndex === 0) {
      setHistoryIndex(-1);
      setCurrentCommand('');
    }
  };

  const clearTerminal = () => {
    setLines([]);
  };

  const copyLastOutput = () => {
    const lastOutput = lines.filter(line => line.type === 'output').pop();
    if (lastOutput) {
      // In a real app, you'd use Clipboard API here
      console.log('Copied:', lastOutput.content);
    }
  };

  const getAiSuggestion = () => {
    if (currentCommand.trim()) {
      const suggestion = `💡 AI Analysis for "${currentCommand}":\n\n🔧 Command Enhancement:\n• Add flags like --verbose, --help, or --version\n• Consider piping output: ${currentCommand} | grep <pattern>\n• Use with watch: watch -n 1 ${currentCommand}\n\n📚 Related Commands:\n• man ${currentCommand} - detailed manual\n• which ${currentCommand} - find executable location\n• ${currentCommand} --help - quick help\n\n⚡ Pro Tips:\n• Use tab completion for efficiency\n• Combine with other commands using && or ||\n• Create aliases for frequent usage`;
      
      setLines(prev => [...prev, {
        id: Date.now().toString(),
        type: 'ai-suggestion',
        content: suggestion,
        timestamp: new Date(),
      }]);
    }
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [lines]);

  const quickCommands = ['ls -la', 'ps aux', 'top', 'history', 'pwd', 'whoami'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Terminal size={isTablet ? 28 : 24} color="#00FF00" />
          <Text style={styles.headerTitle}>Terminal</Text>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Connected</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={copyLastOutput}>
            <Copy size={isTablet ? 20 : 18} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={clearTerminal}>
            <RotateCcw size={isTablet ? 20 : 18} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {isTablet && (
        <View style={styles.quickCommandsBar}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickCommandsContent}
          >
            {quickCommands.map((cmd, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickCommandButton}
                onPress={() => {
                  setCurrentCommand(cmd);
                  setTimeout(() => executeCommand(cmd), 100);
                }}
              >
                <Text style={styles.quickCommandText}>{cmd}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <KeyboardAvoidingView
        style={styles.terminalContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.terminalOutput}
          contentContainerStyle={styles.terminalContent}
          showsVerticalScrollIndicator={false}
        >
          {lines.map((line) => (
            <View key={line.id} style={styles.terminalLine}>
              <Text
                style={[
                  styles.terminalText,
                  line.type === 'command' && styles.commandText,
                  line.type === 'error' && styles.errorText,
                  line.type === 'ai-suggestion' && styles.aiSuggestionText,
                ]}
              >
                {line.content}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <Text style={styles.prompt}>developer@ipad:~$ </Text>
            <TextInput
              ref={inputRef}
              style={styles.terminalInput}
              value={currentCommand}
              onChangeText={setCurrentCommand}
              onSubmitEditing={() => executeCommand(currentCommand)}
              placeholder="Enter command..."
              placeholderTextColor="#666"
              autoCapitalize="none"
              autoCorrect={false}
              multiline={false}
              blurOnSubmit={false}
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={() => executeCommand(currentCommand)}
            >
              <Send size={isTablet ? 24 : 20} color="#00FF00" />
            </TouchableOpacity>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigateHistory('up')}
            >
              <ArrowUp size={isTablet ? 20 : 16} color="#FFF" />
              <Text style={styles.actionButtonText}>History</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigateHistory('down')}
            >
              <ArrowDown size={isTablet ? 20 : 16} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.aiButton]}
              onPress={getAiSuggestion}
            >
              <Sparkles size={isTablet ? 20 : 16} color="#FFD700" />
              <Text style={styles.aiButtonText}>AI Assist</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a4d1a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00FF00',
    marginRight: 6,
  },
  statusText: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 14 : 12,
    color: '#00FF00',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: isTablet ? 12 : 8,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  quickCommandsBar: {
    backgroundColor: '#111',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingVertical: 12,
  },
  quickCommandsContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  quickCommandButton: {
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#444',
  },
  quickCommandText: {
    fontFamily: 'FiraCode-Regular',
    fontSize: 14,
    color: '#FFF',
  },
  terminalContainer: {
    flex: 1,
  },
  terminalOutput: {
    flex: 1,
    padding: isTablet ? 24 : 16,
  },
  terminalContent: {
    paddingBottom: 20,
  },
  terminalLine: {
    marginBottom: isTablet ? 6 : 4,
  },
  terminalText: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 16 : 14,
    color: '#FFF',
    lineHeight: isTablet ? 24 : 20,
  },
  commandText: {
    color: '#00FF00',
    fontFamily: 'FiraCode-Bold',
  },
  errorText: {
    color: '#FF6B6B',
  },
  aiSuggestionText: {
    color: '#87CEEB',
    backgroundColor: '#1a1a2e',
    padding: isTablet ? 16 : 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#87CEEB',
    marginVertical: 8,
  },
  inputContainer: {
    backgroundColor: '#111',
    borderTopWidth: 1,
    borderTopColor: '#333',
    padding: isTablet ? 24 : 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isTablet ? 16 : 12,
  },
  prompt: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 18 : 16,
    color: '#00FF00',
    marginRight: 12,
  },
  terminalInput: {
    flex: 1,
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 18 : 16,
    color: '#FFF',
    paddingVertical: isTablet ? 12 : 8,
    paddingHorizontal: isTablet ? 16 : 12,
    backgroundColor: '#222',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  sendButton: {
    marginLeft: 12,
    padding: isTablet ? 12 : 8,
    backgroundColor: '#1a4d1a',
    borderRadius: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: isTablet ? 12 : 8,
  },
  actionButton: {
    backgroundColor: '#333',
    paddingVertical: isTablet ? 12 : 8,
    paddingHorizontal: isTablet ? 20 : 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    justifyContent: 'center',
  },
  actionButtonText: {
    fontFamily: 'FiraCode-Regular',
    color: '#FFF',
    fontSize: isTablet ? 16 : 14,
  },
  aiButton: {
    backgroundColor: '#2a2a00',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  aiButtonText: {
    fontFamily: 'FiraCode-Regular',
    color: '#FFD700',
    fontSize: isTablet ? 16 : 14,
  },
});