import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchPost } from '../../../../api/postApi';
import { 
  fetchRepositoryDetails, 
  fetchRepositoryCommits, 
  fetchRepositoryContributors,
  fetchRepositoryLanguages,
  fetchRepositoryIssues 
} from '../../../../api/githubDetailApi';
import { 
  User, Clock, Camera, Github, Star, GitFork, Eye, AlertCircle,
  Code, Users, GitCommit, Calendar, ExternalLink, Globe,
  Shield, Activity, BarChart3, BookOpen, X, ChevronLeft, ChevronRight
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Loading, { GitHubLoading } from '../../../common/Loading';
import styles from './PostShow.module.scss';

const PostShow = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // GitHub関連のデータ
  const [githubData, setGithubData] = useState({
    repository: null,
    commits: [],
    contributors: [],
    languages: [],
    issues: null,
    loading: false,
    error: null
  });

  const [activeTab, setActiveTab] = useState('overview');
  
  // 画像モーダル関連
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedPost = await fetchPost(id);
        setPost(fetchedPost.post);
        
        // GitHubリポジトリ情報があれば詳細データを取得
        if (fetchedPost.post?.repository_url) {
          await fetchGithubData(fetchedPost.post.repository_url);
        }
      } catch (error) {
        console.error("データの取得に失敗しました:", error);
        setError("投稿の取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const fetchGithubData = async (repositoryUrl) => {
    if (!repositoryUrl) return;
    
    // GitHub URLからowner/repoを抽出
    const match = repositoryUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) return;
    
    const [, owner, repo] = match;
    const cleanRepo = repo.replace(/\.git$/, ''); // .gitサフィックスを除去
    
    setGithubData(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // 並列でGitHubデータを取得
      const [repoDetails, commits, contributors, languages, issues] = await Promise.allSettled([
        fetchRepositoryDetails(owner, cleanRepo),
        fetchRepositoryCommits(owner, cleanRepo, 10),
        fetchRepositoryContributors(owner, cleanRepo),
        fetchRepositoryLanguages(owner, cleanRepo),
        fetchRepositoryIssues(owner, cleanRepo)
      ]);

      setGithubData({
        repository: repoDetails.status === 'fulfilled' ? repoDetails.value?.repository : null,
        commits: commits.status === 'fulfilled' ? commits.value?.commits || [] : [],
        contributors: contributors.status === 'fulfilled' ? contributors.value?.contributors || [] : [],
        languages: languages.status === 'fulfilled' ? languages.value?.languages || [] : [],
        issues: issues.status === 'fulfilled' ? issues.value?.issues : null,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('GitHub data fetch error:', error);
      setGithubData(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'GitHub情報の取得に失敗しました' 
      }));
    }
  };  

  // 画像モーダル関数
  const openModal = (index) => {
    setCurrentImageIndex(index);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  const nextImage = () => {
    if (post && post.all_images && currentImageIndex < post.all_images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  // キーボードイベント
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!modalOpen) return;
      
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      }
    };

    if (modalOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen, currentImageIndex]);

  if (loading) {
    return <Loading type="project" message="プロダクトとGitHub情報を読み込んでいます..." size="large" />;
  }

  if (error) {
    return (
      <div className={styles.postContainer}>
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className={styles.postContainer}>
        <p>投稿が見つかりません</p>
      </div>
    );
  }

  // GitHub統計の計算
  const getTotalCommits = () => githubData.commits.length;
  const getTotalContributors = () => githubData.contributors.length;
  const getMainLanguage = () => githubData.languages[0]?.name || '不明';

  return (
    <div className={styles.container}>
      {/* ヘッダーセクション */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.userInfo}>
            {post.user?.remote_avatar_url ? (
              <img 
                src={post.user.remote_avatar_url} 
                alt={`${post.user.name}のアバター`} 
                className={styles.userAvatar}
              />
            ) : (
              <div className={styles.defaultAvatar}>
                <User size={24} />
              </div>
            )}
            <div className={styles.userDetails}>
              <h3 className={styles.userName}>{post.user?.name}</h3>
              <p className={styles.publishDate}>
                <Calendar size={16} />
                {new Date(post.published_at).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
          
          <h1 className={styles.projectTitle}>{post.title}</h1>
          <p className={styles.projectDescription}>{post.description}</p>
          
          {/* プロダクト統計 */}
          <div className={styles.projectStats}>
            {githubData.repository && (
              <>
                <div className={styles.stat}>
                  <Star size={16} />
                  <span>{githubData.repository.stargazers_count}</span>
                </div>
                <div className={styles.stat}>
                  <GitFork size={16} />
                  <span>{githubData.repository.forks_count}</span>
                </div>
                <div className={styles.stat}>
                  <Eye size={16} />
                  <span>{githubData.repository.watchers_count}</span>
                </div>
                <div className={styles.stat}>
                  <Code size={16} />
                  <span>{getMainLanguage()}</span>
                </div>
              </>
            )}
          </div>
          
          {/* プロダクトリンク */}
          {post.repository_url && (
            <div className={styles.projectLinks}>
              <a 
                href={post.repository_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.link}
              >
                <Github size={20} />
                <span>GitHub Repository</span>
                <ExternalLink size={16} />
              </a>
              {post.repository_description && (
                <div className={styles.repoDescription}>
                  {post.repository_description}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* プロダクト画像 */}
        {post.all_images && post.all_images.length > 0 && (
          <div className={styles.projectImageContainer}>
            {post.all_images.length === 1 ? (
              <img 
                className={styles.projectImage} 
                src={`http://localhost:3000${post.all_images[0].url || post.all_images[0]}`} 
                alt={post.title}
                onClick={() => openModal(0)}
                style={{ cursor: 'pointer' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className={styles.imageGallery}>
                {post.all_images.slice(0, 3).map((image, index) => (
                  <img 
                    key={index}
                    className={styles.galleryImage} 
                    src={`http://localhost:3000${image.url || image}`} 
                    alt={`${post.title} - ${index + 1}`}
                    onClick={() => openModal(index)}
                    style={{ cursor: 'pointer' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ))}
                {post.all_images.length > 3 && (
                  <div 
                    className={styles.moreImages}
                    onClick={() => openModal(2)}
                    style={{ cursor: 'pointer' }}
                  >
                    +{post.all_images.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* タブナビゲーション */}
      <div className={styles.tabNavigation}>
        <button 
          className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <BookOpen size={20} />
          概要
        </button>
        {githubData.repository && (
          <button 
            className={`${styles.tab} ${activeTab === 'github' ? styles.active : ''}`}
            onClick={() => setActiveTab('github')}
          >
            <Github size={20} />
            GitHub詳細
          </button>
        )}
        {githubData.loading && (
          <button className={`${styles.tab} ${styles.disabled}`}>
            <Github size={20} />
            読み込み中...
          </button>
        )}
        <button 
          className={`${styles.tab} ${activeTab === 'evidence' ? styles.active : ''}`}
          onClick={() => setActiveTab('evidence')}
        >
          <Shield size={20} />
          検証・信頼性
        </button>
      </div>

      {/* タブコンテンツ */}
      <div className={styles.tabContent}>
        {activeTab === 'overview' && (
          <div className={styles.overviewTab}>
            <div className={styles.contentSection}>
              <h2 className={styles.sectionTitle}>プロダクト詳細</h2>
              <div className={styles.postBody}>
                <div className={styles.markdown}>
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                  >
                    {post.body}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
            
            {githubData.languages.length > 0 && (
              <div className={styles.contentSection}>
                <h2 className={styles.sectionTitle}>使用技術</h2>
                <div className={styles.languageChart}>
                  {githubData.languages.slice(0, 5).map((lang) => (
                    <div key={lang.name} className={styles.languageItem}>
                      <div className={styles.languageInfo}>
                        <span className={styles.languageName}>{lang.name}</span>
                        <span className={styles.languagePercentage}>{lang.percentage}%</span>
                      </div>
                      <div className={styles.languageBar}>
                        <div 
                          className={styles.languageProgress}
                          style={{ width: `${lang.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'github' && githubData.repository && (
          <div className={styles.githubTab}>
            {/* リポジトリ詳細情報 */}
            <div className={styles.contentSection}>
              <h2 className={styles.sectionTitle}>リポジトリ詳細</h2>
              <div className={styles.repoDetails}>
                <div className={styles.repoStat}>
                  <GitCommit size={20} />
                  <span>コミット数: {getTotalCommits()}+</span>
                </div>
                <div className={styles.repoStat}>
                  <Users size={20} />
                  <span>コントリビューター: {getTotalContributors()}人</span>
                </div>
                <div className={styles.repoStat}>
                  <AlertCircle size={20} />
                  <span>オープンIssue: {githubData.repository.open_issues_count}件</span>
                </div>
                <div className={styles.repoStat}>
                  <Activity size={20} />
                  <span>最終更新: {new Date(githubData.repository.pushed_at).toLocaleDateString('ja-JP')}</span>
                </div>
              </div>
            </div>

            {/* 最近のコミット */}
            {githubData.commits.length > 0 && (
              <div className={styles.contentSection}>
                <h2 className={styles.sectionTitle}>最近のコミット</h2>
                <div className={styles.commitsList}>
                  {githubData.commits.slice(0, 5).map((commit) => (
                    <div key={commit.full_sha} className={styles.commitItem}>
                      <div className={styles.commitHeader}>
                        <span className={styles.commitSha}>{commit.sha}</span>
                        <span className={styles.commitDate}>
                          {new Date(commit.author.date).toLocaleDateString('ja-JP')}
                        </span>
                      </div>
                      <p className={styles.commitMessage}>{commit.message.split('\n')[0]}</p>
                      <p className={styles.commitAuthor}>by {commit.author.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* コントリビューター */}
            {githubData.contributors.length > 0 && (
              <div className={styles.contentSection}>
                <h2 className={styles.sectionTitle}>コントリビューター</h2>
                <div className={styles.contributorsList}>
                  {githubData.contributors.slice(0, 8).map((contributor) => (
                    <div key={contributor.login} className={styles.contributor}>
                      <img 
                        src={contributor.avatar_url} 
                        alt={contributor.login}
                        className={styles.contributorAvatar}
                      />
                      <span className={styles.contributorName}>{contributor.login}</span>
                      <span className={styles.contributorStats}>{contributor.contributions} commits</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'evidence' && (
          <div className={styles.evidenceTab}>
            <div className={styles.contentSection}>
              <h2 className={styles.sectionTitle}>プロダクトの信頼性</h2>
              <div className={styles.evidenceGrid}>
                <div className={styles.evidenceCard}>
                  <div className={styles.evidenceIcon}>
                    <Github size={24} />
                  </div>
                  <h3>ソースコード</h3>
                  <p>GitHubリポジトリで実装コードを公開</p>
                  <div className={styles.evidenceStatus}>
                    {post.repository_url ? (
                      <span className={styles.verified}>✅ 検証済み</span>
                    ) : (
                      <span className={styles.pending}>❌ 未検証</span>
                    )}
                  </div>
                </div>

                <div className={styles.evidenceCard}>
                  <div className={styles.evidenceIcon}>
                    <Activity size={24} />
                  </div>
                  <h3>開発アクティビティ</h3>
                  <p>継続的な開発活動</p>
                  <div className={styles.evidenceStatus}>
                    {githubData.commits.length > 0 ? (
                      <span className={styles.verified}>✅ {getTotalCommits()}+ コミット</span>
                    ) : (
                      <span className={styles.pending}>❌ コミット履歴なし</span>
                    )}
                  </div>
                </div>

                <div className={styles.evidenceCard}>
                  <div className={styles.evidenceIcon}>
                    <BarChart3 size={24} />
                  </div>
                  <h3>技術の証明</h3>
                  <p>使用言語・技術スタック</p>
                  <div className={styles.evidenceStatus}>
                    {githubData.languages.length > 0 ? (
                      <span className={styles.verified}>✅ {githubData.languages.length}つの言語</span>
                    ) : (
                      <span className={styles.pending}>❌ 言語情報なし</span>
                    )}
                  </div>
                </div>

                <div className={styles.evidenceCard}>
                  <div className={styles.evidenceIcon}>
                    <Users size={24} />
                  </div>
                  <h3>コラボレーション</h3>
                  <p>チーム開発・コミュニティ</p>
                  <div className={styles.evidenceStatus}>
                    {getTotalContributors() > 1 ? (
                      <span className={styles.verified}>✅ {getTotalContributors()}人のコントリビューター</span>
                    ) : (
                      <span className={styles.individual}>👤 個人開発</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* プロダクト評価 */}
            <div className={styles.contentSection}>
              <h2 className={styles.sectionTitle}>プロダクト評価</h2>
              <div className={styles.projectScore}>
                <div className={styles.scoreCard}>
                  <h3>信頼度スコア</h3>
                  <div className={styles.scoreValue}>
                    {(() => {
                      let score = 0;
                      if (post.repository_url) score += 25;
                      if (githubData.commits.length > 0) score += 25;
                      if (githubData.languages.length > 0) score += 25;
                      if (githubData.repository?.stargazers_count > 0) score += 25;
                      return score;
                    })()}%
                  </div>
                  <div className={styles.scoreBar}>
                    <div 
                      className={styles.scoreProgress}
                      style={{ width: `${(() => {
                        let score = 0;
                        if (post.repository_url) score += 25;
                        if (githubData.commits.length > 0) score += 25;
                        if (githubData.languages.length > 0) score += 25;
                        if (githubData.repository?.stargazers_count > 0) score += 25;
                        return score;
                      })()}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 画像モーダル */}
      {modalOpen && post.all_images && (
        <div className={styles.modal} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeModal}>
              <X size={24} />
            </button>
            
            {post.all_images.length > 1 && (
              <>
                <button 
                  className={`${styles.navButton} ${styles.prevButton}`}
                  onClick={prevImage}
                  disabled={currentImageIndex === 0}
                >
                  <ChevronLeft size={32} />
                </button>
                
                <button 
                  className={`${styles.navButton} ${styles.nextButton}`}
                  onClick={nextImage}
                  disabled={currentImageIndex === post.all_images.length - 1}
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}
            
            <div className={styles.imageContainer}>
              <img 
                src={`http://localhost:3000${post.all_images[currentImageIndex]?.url || post.all_images[currentImageIndex]}`}
                alt={`${post.title} - ${currentImageIndex + 1}`}
                className={styles.modalImage}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            
            {post.all_images.length > 1 && (
              <div className={styles.imageCounter}>
                {currentImageIndex + 1} / {post.all_images.length}
              </div>
            )}
            
            {post.all_images.length > 1 && (
              <div className={styles.thumbnails}>
                {post.all_images.map((image, index) => (
                  <img
                    key={index}
                    src={`http://localhost:3000${image.url || image}`}
                    alt={`${post.title} thumbnail ${index + 1}`}
                    className={`${styles.thumbnail} ${index === currentImageIndex ? styles.activeThumbnail : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default PostShow
