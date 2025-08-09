import { useState } from 'react';
import { User, Lock, Bell, Palette, Save } from 'lucide-react';
import styles from './Settings.module.scss';
import useAuth from '@/hooks/useAuth';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    profile: {
      displayName: user?.name || '',
      email: user?.email || '',
      bio: ''
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showActivity: true
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      weeklyDigest: true
    },
    appearance: {
      theme: 'light',
      language: 'ja'
    }
  });

  const tabs = [
    { id: 'profile', label: 'プロフィール', icon: User },
    { id: 'privacy', label: 'プライバシー', icon: Lock },
    { id: 'notifications', label: '通知', icon: Bell },
    { id: 'appearance', label: '外観', icon: Palette }
  ];

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      console.log('Saving settings:', settings);
      // TODO: API呼び出しを実装
      alert('設定が保存されました');
    } catch (error) {
      console.error('設定の保存に失敗しました:', error);
      alert('設定の保存に失敗しました');
    }
  };

  const renderProfileSettings = () => (
    <div className={styles.settingsSection}>
      <h3 className={styles.sectionTitle}>プロフィール設定</h3>
      <div className={styles.formGroup}>
        <label className={styles.label}>表示名</label>
        <input
          type="text"
          value={settings.profile.displayName}
          onChange={(e) => handleInputChange('profile', 'displayName', e.target.value)}
          className={styles.input}
          placeholder="あなたの表示名を入力してください"
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>メールアドレス</label>
        <input
          type="email"
          value={settings.profile.email}
          onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
          className={styles.input}
          placeholder="メールアドレス"
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>自己紹介</label>
        <textarea
          value={settings.profile.bio}
          onChange={(e) => handleInputChange('profile', 'bio', e.target.value)}
          className={styles.textarea}
          placeholder="あなたについて教えてください..."
          rows={4}
        />
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className={styles.settingsSection}>
      <h3 className={styles.sectionTitle}>プライバシー設定</h3>
      <div className={styles.formGroup}>
        <label className={styles.label}>プロフィールの公開設定</label>
        <select
          value={settings.privacy.profileVisibility}
          onChange={(e) => handleInputChange('privacy', 'profileVisibility', e.target.value)}
          className={styles.select}
        >
          <option value="public">公開</option>
          <option value="private">非公開</option>
          <option value="friends">フレンドのみ</option>
        </select>
      </div>
      <div className={styles.checkboxGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={settings.privacy.showEmail}
            onChange={(e) => handleInputChange('privacy', 'showEmail', e.target.checked)}
            className={styles.checkbox}
          />
          メールアドレスを公開する
        </label>
      </div>
      <div className={styles.checkboxGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={settings.privacy.showActivity}
            onChange={(e) => handleInputChange('privacy', 'showActivity', e.target.checked)}
            className={styles.checkbox}
          />
          アクティビティを公開する
        </label>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className={styles.settingsSection}>
      <h3 className={styles.sectionTitle}>通知設定</h3>
      <div className={styles.checkboxGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={settings.notifications.emailNotifications}
            onChange={(e) => handleInputChange('notifications', 'emailNotifications', e.target.checked)}
            className={styles.checkbox}
          />
          メール通知を受け取る
        </label>
      </div>
      <div className={styles.checkboxGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={settings.notifications.pushNotifications}
            onChange={(e) => handleInputChange('notifications', 'pushNotifications', e.target.checked)}
            className={styles.checkbox}
          />
          プッシュ通知を受け取る
        </label>
      </div>
      <div className={styles.checkboxGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={settings.notifications.weeklyDigest}
            onChange={(e) => handleInputChange('notifications', 'weeklyDigest', e.target.checked)}
            className={styles.checkbox}
          />
          週間ダイジェストを受け取る
        </label>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className={styles.settingsSection}>
      <h3 className={styles.sectionTitle}>外観設定</h3>
      <div className={styles.formGroup}>
        <label className={styles.label}>テーマ</label>
        <select
          value={settings.appearance.theme}
          onChange={(e) => handleInputChange('appearance', 'theme', e.target.value)}
          className={styles.select}
        >
          <option value="light">ライトモード</option>
          <option value="dark">ダークモード</option>
          <option value="auto">システム設定に従う</option>
        </select>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>言語</label>
        <select
          value={settings.appearance.language}
          onChange={(e) => handleInputChange('appearance', 'language', e.target.value)}
          className={styles.select}
        >
          <option value="ja">日本語</option>
          <option value="en">English</option>
        </select>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'appearance':
        return renderAppearanceSettings();
      default:
        return renderProfileSettings();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <nav className={styles.sidebar}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <main className={styles.main}>
          {renderContent()}
          
          <div className={styles.saveSection}>
            <button onClick={handleSave} className={styles.saveButton}>
              <Save size={20} />
              設定を保存
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;