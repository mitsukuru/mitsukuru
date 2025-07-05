import SignInGithubButton from "@/assets/signIn_github_button.svg";
import { useState, useEffect } from 'react';
import axios from 'axios';
import API_CONFIG from '@/config/api';
import ErrorMessage from '@/components/common/ErrorMessage';
import useErrorHandler from '@/hooks/useErrorHandler';
import styles from './SignIn.module.scss';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [githubAuthUrl, setGithubAuthUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { error, clearError, showError } = useErrorHandler();

  useEffect(() => {
    const fetchOAuthConfig = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.oauth.config}`);
        const { github } = response.data;
        const authUrl = `https://github.com/login/oauth/authorize?client_id=${github.client_id}&redirect_uri=${encodeURIComponent(github.callback_url)}&scope=${github.scope}`;
        setGithubAuthUrl(authUrl);
      } catch (error) {
        console.error('OAuth設定の取得に失敗しました:', error);
        showError({
          error: 'config_fetch_failed',
          message: 'OAuth設定の取得に失敗しました。ページを再読み込みしてください。'
        });
        // フォールバック: 直接URLを設定
        setGithubAuthUrl(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.oauth.github}`);
      } finally {
        setLoading(false);
      }
    };

    fetchOAuthConfig();
  }, [showError]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // ログイン処理をここに追加
  };

  return (
    <div className={styles.signInContainer}>
      {error && (
        <ErrorMessage 
          error={error} 
          onClose={clearError}
          autoHide={true}
          hideDelay={8000}
        />
      )}
      <form onSubmit={handleSubmit} className={styles.signInForm}>
        <h2>ログイン</h2>
        <div className={styles.formGroup}>
          <label htmlFor="email">メールアドレス</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.formInput}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">パスワード</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.formInput}
          />
        </div>
        <button type="submit" className={styles.submitButton}>ログイン</button>
      </form>
      <div className={styles.githubSignIn}>
        {loading ? (
          <div className={styles.loadingButton}>
            OAuth設定を読み込み中...
          </div>
        ) : githubAuthUrl ? (
          <a href={githubAuthUrl}>
            <img src={SignInGithubButton} alt="SignInGithubButton" width={310} height={55} />
          </a>
        ) : (
          <div className={styles.errorButton}>
            OAuth設定の読み込みに失敗しました
          </div>
        )}
      </div>
    </div>
  );
};

export default SignIn;