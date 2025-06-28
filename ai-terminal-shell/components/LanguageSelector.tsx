import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Check, Globe, X } from 'lucide-react-native';
import { useLanguage, SUPPORTED_LANGUAGES, Language } from '@/contexts/LanguageContext';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

interface LanguageSelectorProps {
  visible: boolean;
  onClose: () => void;
}

export default function LanguageSelector({ visible, onClose }: LanguageSelectorProps) {
  const { currentLanguage, setLanguage, t } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(currentLanguage);

  const handleLanguageSelect = async (language: Language) => {
    setSelectedLanguage(language);
    await setLanguage(language);
    onClose();
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
          <Text style={styles.title}>{t('settings.language')}</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.languageList} showsVerticalScrollIndicator={false}>
          {SUPPORTED_LANGUAGES.map((language) => (
            <TouchableOpacity
              key={language.code}
              style={[
                styles.languageItem,
                selectedLanguage.code === language.code && styles.selectedLanguageItem,
              ]}
              onPress={() => handleLanguageSelect(language)}
            >
              <View style={styles.languageInfo}>
                <Text style={styles.flag}>{language.flag}</Text>
                <View style={styles.languageText}>
                  <Text style={styles.languageName}>{language.nativeName}</Text>
                  <Text style={styles.languageEnglishName}>{language.name}</Text>
                </View>
              </View>
              {selectedLanguage.code === language.code && (
                <Check size={isTablet ? 24 : 20} color="#00FF00" />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.footerInfo}>
            <Globe size={isTablet ? 20 : 16} color="#666" />
            <Text style={styles.footerText}>
              Language settings will be applied immediately
            </Text>
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
  languageList: {
    flex: 1,
    padding: isTablet ? 24 : 16,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: isTablet ? 20 : 16,
    backgroundColor: '#111',
    borderRadius: isTablet ? 16 : 12,
    marginBottom: isTablet ? 12 : 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  selectedLanguageItem: {
    borderColor: '#00FF00',
    backgroundColor: '#0a1a0a',
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: isTablet ? 32 : 28,
    marginRight: isTablet ? 16 : 12,
  },
  languageText: {
    flex: 1,
  },
  languageName: {
    fontFamily: 'FiraCode-Bold',
    fontSize: isTablet ? 18 : 16,
    color: '#FFF',
    marginBottom: 4,
  },
  languageEnglishName: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 14 : 12,
    color: '#666',
  },
  footer: {
    padding: isTablet ? 24 : 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#111',
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  footerText: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 14 : 12,
    color: '#666',
    textAlign: 'center',
  },
});