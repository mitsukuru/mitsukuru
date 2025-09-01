import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// 言語リソース
const translations = {
  ja: {
    // Header
    'header.home': 'ホーム',
    'header.users': 'ユーザー',
    'header.newPost': '新規投稿',
    'header.profile': 'プロフィール',
    'header.settings': '設定',
    'header.logout': 'ログアウト',
    
    // Settings
    'settings.title': '設定',
    'settings.profile': 'プロフィール',
    'settings.privacy': 'プライバシー',
    'settings.notifications': '通知',
    'settings.appearance': '外観',
    'settings.theme': 'テーマ',
    'settings.theme.light': 'ライト',
    'settings.theme.dark': 'ダーク',
    'settings.language': '言語',
    'settings.save': '保存',
    'settings.saved': '設定を保存しました',
    
    // Dashboard
    'dashboard.title': 'ダッシュボード',
    'dashboard.level': 'レベル',
    'dashboard.streak': '連続投稿',
    'dashboard.achievements': 'アチーブメント',
    'dashboard.todayGoal': '今日の目標',
    'dashboard.weeklyProgress': '今週の進捗',
    
    // Common
    'common.loading': '読み込み中...',
    'common.error': 'エラーが発生しました',
    'common.save': '保存',
    'common.cancel': 'キャンセル'
  },
  en: {
    // Header
    'header.home': 'Home',
    'header.users': 'Users',
    'header.newPost': 'New Post',
    'header.profile': 'Profile',
    'header.settings': 'Settings',
    'header.logout': 'Logout',
    
    // Settings
    'settings.title': 'Settings',
    'settings.profile': 'Profile',
    'settings.privacy': 'Privacy',
    'settings.notifications': 'Notifications',
    'settings.appearance': 'Appearance',
    'settings.theme': 'Theme',
    'settings.theme.light': 'Light',
    'settings.theme.dark': 'Dark',
    'settings.language': 'Language',
    'settings.save': 'Save',
    'settings.saved': 'Settings saved successfully',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.level': 'Level',
    'dashboard.streak': 'Streak',
    'dashboard.achievements': 'Achievements',
    'dashboard.todayGoal': 'Today\'s Goal',
    'dashboard.weeklyProgress': 'Weekly Progress',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.save': 'Save',
    'common.cancel': 'Cancel'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // ローカルストレージから保存された言語を取得（安全にアクセス）
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('mitsukuru-language');
      return savedLanguage || 'ja';
    }
    return 'ja';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 言語をローカルストレージに保存
      localStorage.setItem('mitsukuru-language', language);
      
      // HTMLのlang属性を設定
      document.documentElement.setAttribute('lang', language);
    }
  }, [language]);

  const translate = (key, fallback = key) => {
    return translations[language]?.[key] || translations['ja']?.[key] || fallback;
  };

  const changeLanguage = (newLanguage) => {
    if (translations[newLanguage]) {
      setLanguage(newLanguage);
    }
  };

  const value = {
    language,
    changeLanguage,
    translate,
    t: translate, // 短縮形
    availableLanguages: [
      { code: 'ja', name: '日本語', flag: '🇯🇵' },
      { code: 'en', name: 'English', flag: '🇺🇸' }
    ]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};