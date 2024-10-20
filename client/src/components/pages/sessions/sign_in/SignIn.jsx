import SignInGithubButton from "/src/assets/signIn_github_button.svg";
import { useState } from 'react';
import styles from './SignIn.module.scss';
// const GITHUB_CLIENT_ID = process.env.REACT_APP_GITHUB_CLIENT_ID;
// const GITHUB_REDIRECT_URL = process.env.REACT_APP_GITHUB_REDIRECT_URL;
const GITHUB_AUTH_URL = `https://github.com/login/oauth/authorize?client_id=Ov23lipUtZEQclrolCBR&redirect_url=http://localhost:3000/callback/github/&scope=user:email`;

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
        <a href={GITHUB_AUTH_URL}>
          <img src={SignInGithubButton} alt="SignInGithubButton" width={310} height={55} />
        </a>
      </div>
    </div>
  );
};

export default SignIn;