import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import styles from './AuthLoading.module.scss';

const AuthLoading = () => {
  const navigate = useNavigate();
  const { refreshAuth, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // OAuth認証成功時のユーザー情報処理
    const urlParams = new URLSearchParams(window.location.search);
    const authSuccess = urlParams.get('auth_success');
    
    if (authSuccess) {
      try {
        // Base64デコードしてユーザー情報をLocalStorageに保存
        const userData = JSON.parse(atob(authSuccess));
        localStorage.setItem('mitsukuru_user', JSON.stringify(userData));
        
        // 認証状態を更新
        refreshAuth();
      } catch (error) {
        console.error('認証情報の処理に失敗:', error);
        navigate('/sign_in');
      }
    } else {
      // auth_successパラメータがない場合はサインインページにリダイレクト
      navigate('/sign_in');
    }
  }, []);

  useEffect(() => {
    // 認証状態の更新が完了したらホームページにリダイレクト
    if (!loading && isAuthenticated) {
      navigate('/home', { replace: true });
    } else if (!loading && !isAuthenticated) {
      navigate('/sign_in', { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingContent}>
        <div className={styles.spinner}></div>
        <h2>ログイン処理中...</h2>
        <p>認証情報を確認しています</p>
      </div>
    </div>
  );
};

export default AuthLoading;