import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Onboarding.module.scss';

const Onboarding = () => {
  const [repositories, setRepositories] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // URLパラメータからユーザー情報を取得してLocalStorageに保存
    const searchParams = new URLSearchParams(location.search);
    const userParam = searchParams.get('user');
    
    if (userParam) {
      try {
        const userData = JSON.parse(atob(userParam));
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (error) {
        console.error('User data parsing error:', error);
      }
    }
    
    fetchRepositories();
  }, [location]);

  const fetchRepositories = async () => {
    try {
      setLoading(true);
      setError('');
      
      // URLパラメータまたはLocalStorageからユーザー情報を取得
      const searchParams = new URLSearchParams(location.search);
      const userParam = searchParams.get('user');
      let userId = null;
      
      console.log('URL search:', location.search);
      console.log('User param:', userParam);
      
      if (userParam) {
        try {
          const userData = JSON.parse(atob(userParam));
          userId = userData.id;
          console.log('Parsed user data:', userData);
          console.log('User ID:', userId);
        } catch (error) {
          console.error('User data parsing error:', error);
        }
      }
      
      if (!userId) {
        const storedUser = localStorage.getItem('user');
        console.log('Stored user:', storedUser);
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          userId = userData.id;
          console.log('User from localStorage:', userData);
        }
      }
      
      if (!userId) {
        console.error('No user ID available');
        setError('ユーザー情報が見つかりません');
        return;
      }
      
      console.log('Final user ID:', userId);
      
      const apiUrl = `http://localhost:3000/api/v1/onboarding/repositories?user_id=${userId}`;
      console.log('Fetching from:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const responseText = await response.text();
        console.log('Response text:', responseText);
        
        try {
          const data = JSON.parse(responseText);
          setRepositories(data.repositories || []);
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          console.error('Response was:', responseText);
          setError('レスポンスの解析に失敗しました');
        }
      } else {
        const responseText = await response.text();
        console.error('Error response:', responseText);
        try {
          const errorData = JSON.parse(responseText);
          setError(errorData.error || 'リポジトリの取得に失敗しました');
        } catch {
          setError('リポジトリの取得に失敗しました');
        }
      }
    } catch (error) {
      console.error('Repository fetch error:', error);
      setError('ネットワークエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = async () => {
    if (!selectedRepo) {
      setError('リポジトリを選択してください');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      // ユーザーIDを取得
      const searchParams = new URLSearchParams(location.search);
      const userParam = searchParams.get('user');
      let userId = null;
      
      if (userParam) {
        try {
          const userData = JSON.parse(atob(userParam));
          userId = userData.id;
        } catch (error) {
          console.error('User data parsing error:', error);
        }
      }

      const response = await fetch('http://localhost:3000/api/v1/onboarding/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          repository: selectedRepo,
          user_id: userId
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Onboarding completed:', data);
        navigate('/home');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'オンボーディングの完了に失敗しました');
      }
    } catch (error) {
      console.error('Onboarding completion error:', error);
      setError('ネットワークエラーが発生しました');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>リポジトリを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.onboardingCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>ミツクルへようこそ！</h1>
          <p className={styles.subtitle}>
            最初の投稿として、あなたのGitHubリポジトリから1つを選択してください
          </p>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {repositories.length > 0 ? (
          <div className={styles.repositoriesContainer}>
            <h2 className={styles.sectionTitle}>あなたのリポジトリ</h2>
            
            <div className={styles.repositoryGrid}>
              {repositories.map((repo) => (
                <div
                  key={repo.id}
                  className={`${styles.repositoryCard} ${
                    selectedRepo?.id === repo.id ? styles.selected : ''
                  }`}
                  onClick={() => setSelectedRepo(repo)}
                >
                  <div className={styles.repoHeader}>
                    <h3 className={styles.repoName}>{repo.name}</h3>
                    {repo.language && (
                      <span className={styles.language}>{repo.language}</span>
                    )}
                  </div>
                  
                  {repo.description && (
                    <p className={styles.repoDescription}>{repo.description}</p>
                  )}
                  
                  <div className={styles.repoMeta}>
                    <span className={styles.stars}>⭐ {repo.stargazers_count}</span>
                    <span className={styles.updatedAt}>
                      更新: {new Date(repo.updated_at).toLocaleDateString('ja-JP')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.footer}>
              <button
                onClick={completeOnboarding}
                disabled={!selectedRepo || submitting}
                className={styles.completeButton}
              >
                {submitting ? '投稿作成中...' : '選択したリポジトリで投稿する'}
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.noRepositories}>
            <p>公開リポジトリが見つかりませんでした。</p>
            <p>GitHubで公開リポジトリを作成してから再度お試しください。</p>
            <button 
              onClick={fetchRepositories}
              className={styles.retryButton}
            >
              再読み込み
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;