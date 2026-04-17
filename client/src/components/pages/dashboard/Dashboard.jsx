import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchUserDashboard } from '@/api/userApi';
import styles from './Dashboard.module.scss';

// ── SVG Icons ────────────────────────────────────────────────────────────────
const IconTrophy = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 21h8M12 17v4M7 4H4a1 1 0 0 0-1 1v3a4 4 0 0 0 4 4h.5M17 4h3a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4h-.5" />
    <path d="M7 4h10v7a5 5 0 0 1-10 0V4z" />
  </svg>
);

const IconGrid = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// アチーブメント名 → SVGアイコン
const ACHIEVEMENT_ICONS = {
  'First Steps': () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" />
      <line x1="12" y1="3" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="21" />
      <line x1="3" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="21" y2="12" />
    </svg>
  ),
  'Getting Started': () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L9.5 8.5 3 9.27l4.5 4.38L6.18 21 12 17.77 17.82 21l-1.32-7.35L21 9.27l-6.5-.77L12 2z" />
    </svg>
  ),
  'Productive': () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  'Prolific Creator': () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 21h8M12 17v4M7 4H4a1 1 0 0 0-1 1v3a4 4 0 0 0 4 4h.5M17 4h3a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4h-.5" />
      <path d="M7 4h10v7a5 5 0 0 1-10 0V4z" />
    </svg>
  ),
  'Tech Explorer': () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  ),
  'Full Stack': () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
};

const AchievementIcon = ({ name }) => {
  const Icon = ACHIEVEMENT_ICONS[name];
  return Icon ? <Icon /> : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
};

// ── Component ────────────────────────────────────────────────────────────────
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
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner} />
        <p>読み込み中...</p>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className={styles.loadingWrapper}>
        <p className={styles.errorText}>{error || 'データが見つかりません'}</p>
      </div>
    );
  }

  const { user, statistics, gamification, recent_posts } = dashboardData;

  const formatDate = (dateString) => {
    if (!dateString) return 'なし';
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const totalPosts = statistics?.total_posts ?? 0;

  return (
    <div className={styles.page}>
      {/* ── Profile Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroInner}>
          <div className={styles.avatarWrapper}>
            {user.remote_avatar_url
              ? <img src={user.remote_avatar_url} alt={user.name} className={styles.avatar} />
              : <div className={styles.avatarFallback}>{user.name?.[0]}</div>
            }
            <div className={styles.onlineDot} />
          </div>
          <div className={styles.heroMeta}>
            <h1 className={styles.heroName}>{user.name}</h1>
            <p className={styles.heroSub}>Developer</p>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.heroStatItem}>
              <span className={styles.heroStatValue}>{totalPosts}</span>
              <span className={styles.heroStatLabel}>投稿</span>
            </div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStatItem}>
              <span className={styles.heroStatValue}>{gamification?.level ?? 1}</span>
              <span className={styles.heroStatLabel}>レベル</span>
            </div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStatItem}>
              <span className={styles.heroStatValue}>
                {gamification?.achievements?.filter(a => a.unlocked).length ?? 0}
              </span>
              <span className={styles.heroStatLabel}>実績</span>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.body}>
        {/* ── Achievements ── */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitleGroup}>
              <span className={styles.cardTitleIcon}><IconTrophy /></span>
              <h2 className={styles.cardTitle}>アチーブメント</h2>
            </div>
            <span className={styles.cardBadge}>
              {gamification?.achievements?.filter(a => a.unlocked).length ?? 0}
              &nbsp;/&nbsp;
              {gamification?.achievements?.length ?? 0}
            </span>
          </div>
          <div className={styles.achievements}>
            {gamification?.achievements?.map((a, i) => (
              <div key={i} className={`${styles.achievement} ${a.unlocked ? styles.achievementOn : styles.achievementOff}`}>
                <span className={styles.achievementIcon}>
                  <AchievementIcon name={a.name} />
                </span>
                <div className={styles.achievementBody}>
                  <p className={styles.achievementName}>{a.name}</p>
                  <p className={styles.achievementDesc}>{a.description}</p>
                </div>
                {a.unlocked && (
                  <span className={styles.achievementCheck}>
                    <IconCheck />
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Recent Posts ── */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitleGroup}>
              <span className={styles.cardTitleIcon}><IconGrid /></span>
              <h2 className={styles.cardTitle}>投稿したプロダクト</h2>
            </div>
            <span className={styles.cardBadge}>{recent_posts.length} 件</span>
          </div>
          <div className={styles.posts}>
            {recent_posts.length === 0 && (
              <p className={styles.empty}>まだ投稿はありません</p>
            )}
            {recent_posts.map((post) => (
              <Link key={post.id} to={`/post/${post.id}`} className={styles.postCard}>
                {post.image_url && (
                  <div className={styles.postThumb}>
                    <img src={post.image_url} alt={post.title} />
                  </div>
                )}
                <div className={styles.postBody}>
                  <h3 className={styles.postTitle}>{post.title}</h3>
                  {post.description && (
                    <p className={styles.postDesc}>
                      {post.description.length > 80
                        ? post.description.substring(0, 80) + '…'
                        : post.description}
                    </p>
                  )}
                  <div className={styles.postFooter}>
                    <div className={styles.postTags}>
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag.id} className={styles.tag}>{tag.name}</span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className={styles.tagMore}>+{post.tags.length - 3}</span>
                      )}
                    </div>
                    <time className={styles.postDate}>{formatDate(post.created_at)}</time>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
