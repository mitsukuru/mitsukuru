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

      {/* モチベーションセクション */}
      <div className={styles.motivationSection}>
        <div className={styles.motivationCard}>
          <div className={styles.motivationMessage}>
            {gamification?.motivation_message || '🚀 今日も素晴らしい一日にしましょう！'}
          </div>
          <div className={styles.levelInfo}>
            <span className={styles.levelBadge}>Lv.{gamification?.level || 1}</span>
            {gamification?.next_level_posts > 0 && (
              <span className={styles.nextLevel}>
                次のレベルまであと{gamification.next_level_posts}投稿
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 今日の進捗とストリーク */}
      <div className={styles.progressSection}>
        <div className={styles.streakCard}>
          <h3>🔥 連続投稿</h3>
          <div className={styles.streakValue}>{gamification?.current_streak || 0}日</div>
          <div className={styles.streakLabel}>
            最長記録: {gamification?.longest_streak || 0}日
          </div>
        </div>

        <div className={styles.progressCard}>
          <h3>📈 今日の目標</h3>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${gamification?.today_progress?.progress_percentage || 0}%` }}
            />
          </div>
          <div className={styles.progressText}>
            {gamification?.today_progress?.posts_today || 0} / {gamification?.today_progress?.daily_goal || 1} 投稿
            {gamification?.today_progress?.completed && <span className={styles.completed}>✅ 完了!</span>}
          </div>
        </div>

        <div className={styles.weeklyCard}>
          <h3>📊 今週の進捗</h3>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${gamification?.weekly_stats?.progress_percentage || 0}%` }}
            />
          </div>
          <div className={styles.progressText}>
            {gamification?.weekly_stats?.posts_this_week || 0} / {gamification?.weekly_stats?.weekly_goal || 3} 投稿
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

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>総プロダクト数</h3>
          <div className={styles.statValue}>{statistics.total_posts}</div>
          <div className={styles.statLabel}>公開済み</div>
        </div>

        <div className={styles.statCard}>
          <h3>使用技術数</h3>
          <div className={styles.statValue}>{statistics.unique_tags}</div>
          <div className={styles.statLabel}>ユニーク技術</div>
        </div>

        <div className={styles.statCard}>
          <h3>レベル進捗</h3>
          <div className={styles.levelProgress}>
            <div className={styles.levelProgressBar}>
              <div 
                className={styles.levelProgressFill}
                style={{ width: `${gamification?.level_progress || 0}%` }}
              />
            </div>
            <div className={styles.statValue}>{gamification?.level_progress || 0}%</div>
          </div>
          <div className={styles.statLabel}>次のレベルまで</div>
        </div>

        <div className={styles.statCard}>
          <h3>最終投稿日</h3>
          <div className={styles.statValue}>{formatDate(statistics.latest_post_date)}</div>
          <div className={styles.statLabel}>アクティビティ</div>
        </div>
      </div>

      <div className={styles.chartsSection}>
        <div className={styles.chartCard}>
          <h3>人気技術ランキング</h3>
          <div className={styles.tagsRanking}>
            {Object.entries(statistics.popular_tags).map(([tagName, count], index) => (
              <div key={tagName} className={styles.tagRankItem}>
                <span className={styles.rank}>#{index + 1}</span>
                <span className={styles.tagName}>{tagName}</span>
                <span className={styles.tagCount}>{count}プロダクト</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3>月別投稿数</h3>
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

      <div className={styles.recentProjects}>
        <h3>最近のプロダクト</h3>
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