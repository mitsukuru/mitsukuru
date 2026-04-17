import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchUserDashboard } from '@/api/userApi';
import styles from './Dashboard.module.scss';

const Dashboard = () => {
  const { id } = useParams();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await fetchUserDashboard(id);
        setDashboardData(data);
        setError(null);
      } catch (error) {
        console.error('Dashboard data fetch error:', error);
        setError('ダッシュボードデータの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDashboardData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>データが見つかりません</div>
      </div>
    );
  }

  const { user, statistics, gamification, recent_posts } = dashboardData;

  const formatDate = (dateString) => {
    if (!dateString) return 'なし';
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getScoreColor = (score) => {
    if (score >= 4.5) return styles.excellent;
    if (score >= 3.5) return styles.good;
    if (score >= 2.5) return styles.average;
    return styles.poor;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          {user.remote_avatar_url && (
            <img 
              src={user.remote_avatar_url} 
              alt={user.name} 
              className={styles.avatar}
            />
          )}
          <div className={styles.userDetails}>
            <h1 className={styles.userName}>{user.name}</h1>
            <p className={styles.userTitle}>Developer Dashboard</p>
          </div>
        </div>
      </div>

      {/* アチーブメント */}
      <div className={styles.achievementsSection}>
        <h3>🏆 アチーブメント</h3>
        <div className={styles.achievementsList}>
          {gamification?.achievements?.map((achievement, index) => (
            <div 
              key={index} 
              className={`${styles.achievementBadge} ${achievement.unlocked ? styles.unlocked : styles.locked}`}
            >
              <div className={styles.achievementIcon}>{achievement.icon}</div>
              <div className={styles.achievementInfo}>
                <div className={styles.achievementName}>{achievement.name}</div>
                <div className={styles.achievementDesc}>{achievement.description}</div>
              </div>
              {achievement.unlocked && <div className={styles.unlockedIcon}>✅</div>}
            </div>
          ))}
        </div>
      </div>

      {/* 月別投稿数 */}
      <div className={styles.chartsSection}>
        <div className={styles.chartCard}>
          <h3>📊 月別投稿数</h3>
          <div className={styles.monthlyChart}>
            {Object.entries(statistics.monthly_posts).map(([month, count]) => (
              <div key={month} className={styles.monthlyBar}>
                <div 
                  className={styles.bar}
                  style={{ height: `${Math.max(count * 20, 10)}px` }}
                />
                <span className={styles.monthLabel}>{month}</span>
                <span className={styles.countLabel}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 投稿したプロダクトの一覧 */}
      <div className={styles.recentProjects}>
        <h3>📱 投稿したプロダクト</h3>
        <div className={styles.projectsList}>
          {recent_posts.map((post) => (
            <div key={post.id} className={styles.projectCard}>
              <div className={styles.projectInfo}>
                <h4 className={styles.projectTitle}>{post.title}</h4>
                <p className={styles.projectDescription}>
                  {post.description?.substring(0, 100)}...
                </p>
                <div className={styles.projectTags}>
                  {post.tags.map((tag) => (
                    <span key={tag.id} className={styles.tag}>
                      {tag.name}
                    </span>
                  ))}
                </div>
                <div className={styles.projectDate}>
                  {formatDate(post.created_at)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;