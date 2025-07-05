import SignInGithubButton from "/src/assets/signIn_github_button.svg";
import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './SignIn.module.scss';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [githubAuthUrl, setGithubAuthUrl] = useState('');

  useEffect(() => {
    const fetchOAuthConfig = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/oauth/config');
        const { github } = response.data;
        const authUrl = `https://github.com/login/oauth/authorize?client_id=${github.client_id}&redirect_uri=${encodeURIComponent(github.callback_url)}&scope=${github.scope}`;
        setGithubAuthUrl(authUrl);
      } catch (error) {
        console.error('OAuth設定の取得に失敗しました:', error);
        // フォールバック: 直接URLを設定
        setGithubAuthUrl('http://localhost:3000/api/v1/github');
      }
    };

    fetchOAuthConfig();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // ログイン処理をここに追加
  };

  return (
    <div className={styles.signInContainer}>
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
        {githubAuthUrl && (
          <a href={githubAuthUrl}>
            <img src={SignInGithubButton} alt="SignInGithubButton" width={310} height={55} />
          </a>
        )}
      </div>
    </div>
  );
};

export default SignIn;