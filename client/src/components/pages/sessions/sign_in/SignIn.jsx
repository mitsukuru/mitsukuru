import SignInGithubButton from "@/assets/signIn_github_button.svg";
import { useState, useEffect } from 'react';
import axios from '@/utils/axiosConfig';
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
    // OAuth設定を直接設定（パフォーマンス改善のため）
    const githubConfig = {
      client_id: "Ov23lipUtZEQclrolCBR",
      callback_url: "http://127.0.0.1:3000/api/v1/callback?provider=github",
      scope: "user:email"
    };
    
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${githubConfig.client_id}&redirect_uri=${encodeURIComponent(githubConfig.callback_url)}&scope=${githubConfig.scope}`;
    setGithubAuthUrl(authUrl);
  }, []);

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
        {githubAuthUrl ? (
          <a href={githubAuthUrl}>
            <img src={SignInGithubButton} alt="SignInGithubButton" width={310} height={55} />
          </a>
        ) : (
          <div className={styles.loadingButton}>
            読み込み中...
          </div>
        )}
      </div>
    </div>
  );
};

export default SignIn;