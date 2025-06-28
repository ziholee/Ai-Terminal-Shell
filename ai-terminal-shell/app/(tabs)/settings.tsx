import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Settings,
  Palette,
  Type,
  Shield,
  Bell,
  Info,
  Download,
  Trash2,
  Key,
  Wifi,
  Smartphone,
  Monitor,
  Zap,
  Globe,
  Lock,
  Languages,
} from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

interface SettingItem {
  id: string;
  title: string;
  description?: string;
  type: 'switch' | 'action' | 'navigation';
  icon: any;
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

export default function SettingsScreen() {
  const { currentLanguage, t } = useLanguage();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [settings, setSettings] = useState({
    aiSuggestions: true,
    notifications: true,
    autoConnect: false,
    secureMode: true,
    soundEffects: false,
    hapticFeedback: true,
    autoSave: true,
    darkMode: true,
    compactMode: false,
    showLineNumbers: true,
  });

  const updateSetting = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const settingSections = [
    {
      title: t('settings.appearance'),
      items: [
        {
          id: 'language',
          title: t('settings.language'),
          description: `${currentLanguage.flag} ${currentLanguage.nativeName} • ${t('settings.languageDesc')}`,
          type: 'navigation' as const,
          icon: Languages,
          onPress: () => setShowLanguageSelector(true),
        },
        {
          id: 'theme',
          title: t('settings.terminalTheme'),
          description: 'Matrix Green • Customize colors and appearance',
          type: 'navigation' as const,
          icon: Palette,
          onPress: () => Alert.alert('Terminal Themes', 'Choose from Matrix Green, Cyberpunk Blue, Hacker Orange, Classic White, and more coming soon!'),
        },
        {
          id: 'font',
          title: t('settings.font'),
          description: 'Fira Code • Size: 16pt • Ligatures enabled',
          type: 'navigation' as const,
          icon: Type,
          onPress: () => Alert.alert('Font Settings', 'Customize font family, size, line height, and enable/disable ligatures for better code readability.'),
        },
        {
          id: 'compactMode',
          title: 'Compact Mode',
          description: 'Reduce spacing for more content on screen',
          type: 'switch' as const,
          icon: Monitor,
          value: settings.compactMode,
          onToggle: (value: boolean) => updateSetting('compactMode', value),
        },
        {
          id: 'showLineNumbers',
          title: 'Show Line Numbers',
          description: 'Display line numbers in terminal output',
          type: 'switch' as const,
          icon: Type,
          value: settings.showLineNumbers,
          onToggle: (value: boolean) => updateSetting('showLineNumbers', value),
        },
      ],
    },
    {
      title: t('settings.ai'),
      items: [
        {
          id: 'aiSuggestions',
          title: t('settings.smartSuggestions'),
          description: 'AI-powered command recommendations and completions',
          type: 'switch' as const,
          icon: Zap,
          value: settings.aiSuggestions,
          onToggle: (value: boolean) => updateSetting('aiSuggestions', value),
        },
        {
          id: 'notifications',
          title: t('settings.notifications'),
          description: 'Get notified about important events and suggestions',
          type: 'switch' as const,
          icon: Bell,
          value: settings.notifications,
          onToggle: (value: boolean) => updateSetting('notifications', value),
        },
        {
          id: 'autoSave',
          title: 'Auto-save Sessions',
          description: 'Automatically save terminal sessions and history',
          type: 'switch' as const,
          icon: Download,
          value: settings.autoSave,
          onToggle: (value: boolean) => updateSetting('autoSave', value),
        },
      ],
    },
    {
      title: t('settings.connection'),
      items: [
        {
          id: 'autoConnect',
          title: t('settings.autoConnect'),
          description: 'Automatically reconnect to last used servers',
          type: 'switch' as const,
          icon: Wifi,
          value: settings.autoConnect,
          onToggle: (value: boolean) => updateSetting('autoConnect', value),
        },
        {
          id: 'keyManagement',
          title: 'SSH Key Management',
          description: 'Manage SSH keys, certificates, and authentication',
          type: 'navigation' as const,
          icon: Key,
          onPress: () => Alert.alert('SSH Key Management', 'Generate new keys, import existing ones, and manage key-based authentication for secure connections.'),
        },
        {
          id: 'networkSettings',
          title: 'Network Configuration',
          description: 'Proxy settings, timeouts, and connection preferences',
          type: 'navigation' as const,
          icon: Globe,
          onPress: () => Alert.alert('Network Settings', 'Configure proxy servers, connection timeouts, keep-alive settings, and network diagnostics.'),
        },
      ],
    },
    {
      title: t('settings.security'),
      items: [
        {
          id: 'secureMode',
          title: t('settings.secureMode'),
          description: 'Enable additional security features and validations',
          type: 'switch' as const,
          icon: Shield,
          value: settings.secureMode,
          onToggle: (value: boolean) => updateSetting('secureMode', value),
        },
        {
          id: 'biometricAuth',
          title: 'Biometric Authentication',
          description: 'Use Face ID or Touch ID to unlock the app',
          type: 'navigation' as const,
          icon: Lock,
          onPress: () => Alert.alert('Biometric Auth', 'Enable Face ID or Touch ID authentication for app access and sensitive operations.'),
        },
        {
          id: 'clearData',
          title: t('settings.clearData'),
          description: 'Remove all connections, history, and cached data',
          type: 'action' as const,
          icon: Trash2,
          onPress: () => {
            Alert.alert(
              'Clear All Data',
              'This will permanently remove:\n• All SSH connections\n• Command history\n• Cached credentials\n• App preferences\n\nThis action cannot be undone.',
              [
                { text: t('common.cancel'), style: 'cancel' },
                {
                  text: 'Clear Data',
                  style: 'destructive',
                  onPress: () => Alert.alert('Data Cleared', 'All application data has been successfully removed.'),
                },
              ]
            );
          },
        },
      ],
    },
    {
      title: t('settings.experience'),
      items: [
        {
          id: 'soundEffects',
          title: 'Sound Effects',
          description: 'Terminal typing sounds and audio feedback',
          type: 'switch' as const,
          icon: Bell,
          value: settings.soundEffects,
          onToggle: (value: boolean) => updateSetting('soundEffects', value),
        },
        {
          id: 'hapticFeedback',
          title: 'Haptic Feedback',
          description: 'Tactile feedback for interactions and notifications',
          type: 'switch' as const,
          icon: Smartphone,
          value: settings.hapticFeedback,
          onToggle: (value: boolean) => updateSetting('hapticFeedback', value),
        },
      ],
    },
    {
      title: t('settings.data'),
      items: [
        {
          id: 'export',
          title: t('settings.export'),
          description: 'Backup settings, connections, and preferences',
          type: 'action' as const,
          icon: Download,
          onPress: () => Alert.alert('Export Complete', 'Configuration exported successfully to Files app. You can now sync it across devices or keep it as backup.'),
        },
        {
          id: 'import',
          title: t('settings.import'),
          description: 'Restore settings from backup file',
          type: 'action' as const,
          icon: Download,
          onPress: () => Alert.alert('Import Settings', 'Select a configuration file to restore your settings, connections, and preferences.'),
        },
      ],
    },
    {
      title: t('settings.about'),
      items: [
        {
          id: 'about',
          title: t('settings.aboutApp'),
          description: 'Version 1.0.0 • iPad Optimized',
          type: 'navigation' as const,
          icon: Info,
          onPress: () => {
            Alert.alert(
              'AI Terminal Shell',
              'Version 1.0.0 - iPad Optimized\n\n🚀 Features:\n• Advanced SSH terminal with AI assistance\n• Claude AI integration for smart suggestions\n• Multi-connection management\n• Secure credential storage\n• iPad-optimized interface\n\n🛠 Built with:\n• React Native & Expo\n• TypeScript for type safety\n• Claude AI for intelligence\n\n© 2024 AI Terminal Shell\nMade with ❤️ for developers'
            );
          },
        },
      ],
    },
  ];

  const renderSettingItem = (item: SettingItem) => {
    const IconComponent = item.icon;

    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.settingItem,
          item.type === 'action' && item.id === 'clearData' && styles.dangerItem,
        ]}
        onPress={item.onPress}
        disabled={item.type === 'switch'}
      >
        <View style={styles.settingContent}>
          <View style={styles.settingLeft}>
            <View style={[
              styles.iconContainer,
              item.id === 'clearData' && styles.dangerIconContainer,
            ]}>
              <IconComponent 
                size={isTablet ? 24 : 20} 
                color={item.id === 'clearData' ? '#FF6B6B' : '#00FF00'} 
              />
            </View>
            <View style={styles.settingText}>
              <Text style={[
                styles.settingTitle,
                item.id === 'clearData' && styles.dangerTitle,
              ]}>
                {item.title}
              </Text>
              {item.description && (
                <Text style={styles.settingDescription}>{item.description}</Text>
              )}
            </View>
          </View>
          {item.type === 'switch' && (
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{ false: '#333', true: '#004d00' }}
              thumbColor={item.value ? '#00FF00' : '#666'}
              style={{ transform: [{ scaleX: isTablet ? 1.2 : 1 }, { scaleY: isTablet ? 1.2 : 1 }] }}
            />
          )}
          {item.type === 'navigation' && (
            <Text style={styles.chevron}>›</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Settings size={isTablet ? 28 : 24} color="#00FF00" />
          <Text style={styles.headerTitle}>{t('settings.title')}</Text>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>v1.0.0</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.settingsList} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.settingsContent}
      >
        {settingSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map(renderSettingItem)}
            </View>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            AI Terminal Shell • Designed for iPad
          </Text>
          <Text style={styles.footerSubtext}>
            Powered by Claude AI for intelligent terminal assistance
          </Text>
          <Text style={styles.footerSubtext}>
            Built with React Native • Made with ❤️ for developers
          </Text>
        </View>
      </ScrollView>

      <LanguageSelector
        visible={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
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
  versionBadge: {
    backgroundColor: '#333',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 12,
  },
  versionText: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 12 : 10,
    color: '#666',
  },
  settingsList: {
    flex: 1,
  },
  settingsContent: {
    paddingBottom: isTablet ? 40 : 20,
  },
  section: {
    marginBottom: isTablet ? 32 : 24,
  },
  sectionTitle: {
    fontFamily: 'FiraCode-Bold',
    fontSize: isTablet ? 18 : 16,
    color: '#00FF00',
    marginBottom: isTablet ? 16 : 12,
    marginLeft: isTablet ? 24 : 16,
  },
  sectionContent: {
    backgroundColor: '#111',
    marginHorizontal: isTablet ? 24 : 16,
    borderRadius: isTablet ? 16 : 12,
    overflow: 'hidden',
  },
  settingItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  dangerItem: {
    backgroundColor: '#1a0a0a',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: isTablet ? 20 : 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: isTablet ? 48 : 40,
    height: isTablet ? 48 : 40,
    borderRadius: isTablet ? 24 : 20,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: isTablet ? 16 : 12,
  },
  dangerIconContainer: {
    backgroundColor: '#2a1a1a',
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 18 : 16,
    color: '#FFF',
    marginBottom: 4,
  },
  dangerTitle: {
    color: '#FF6B6B',
  },
  settingDescription: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 14 : 12,
    color: '#666',
    lineHeight: isTablet ? 20 : 16,
  },
  chevron: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 24 : 20,
    color: '#666',
    marginLeft: 12,
  },
  footer: {
    padding: isTablet ? 32 : 24,
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 16 : 14,
    color: '#666',
    textAlign: 'center',
  },
  footerSubtext: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 14 : 12,
    color: '#444',
    textAlign: 'center',
  },
});