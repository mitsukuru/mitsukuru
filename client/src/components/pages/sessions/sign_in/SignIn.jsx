import { useState, useEffect } from 'react';
import ErrorMessage from '@/components/common/ErrorMessage';
import useErrorHandler from '@/hooks/useErrorHandler';
import styles from './SignIn.module.scss';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [githubAuthUrl, setGithubAuthUrl] = useState('');
  const { error, clearError } = useErrorHandler();

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
      <div className={styles.signInCard}>
        {error && (
          <ErrorMessage 
            error={error} 
            onClose={clearError}
            autoHide={true}
            hideDelay={8000}
          />
        )}
        
        <div className={styles.header}>
          <h1 className={styles.title}>ミツクルにログイン</h1>
          <p className={styles.subtitle}>あなたの個人開発を共有しましょう</p>
        </div>

        <div className={styles.githubSignIn}>
          {githubAuthUrl ? (
            <a href={githubAuthUrl} className={styles.githubButton}>
              <svg className={styles.githubIcon} viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHubでログイン
            </a>
          ) : (
            <div className={styles.loadingButton}>
              <div className={styles.spinner}></div>
              読み込み中...
            </div>
          )}
        </div>

        <div className={styles.divider}>
          <span className={styles.dividerText}>または</span>
        </div>

        <form onSubmit={handleSubmit} className={styles.signInForm}>
          <div className={styles.formGroup}>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="メールアドレス"
              required
              className={styles.formInput}
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワード"
              required
              className={styles.formInput}
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            メールでログイン
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            アカウントをお持ちでない場合は、GitHubでログインすると自動的にアカウントが作成されます。
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;