import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchPost } from '../../../../api/postApi';
import { User, Clock, Camera } from 'lucide-react';
import styles from './PostShow.module.scss';

const PostShow = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedPost = await fetchPost(id);
        setPost(fetchedPost.post);
      } catch (error) {
        console.error("データの取得に失敗しました:", error);
        setError("投稿の取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);  

  if (loading) {
    return (
      <div className={styles.postContainer}>
        <p>読み込み中...</p>
      </div>
    );
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

  return (
    <div className={styles.container}>
      <div className={styles.postCard}>
        {/* ヘッダー部分 */}
        <div className={styles.postHeader}>
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
                {new Date(post.published_at).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className={styles.postContent}>
          <h1 className={styles.postTitle}>{post.title}</h1>
          <p className={styles.postDescription}>{post.description}</p>
          
          {/* 画像セクション */}
          {post.image_url?.url && 
           !post.image_url.url.includes('/images/fallback/default.png') ? (
            <div className={styles.imageSection}>
              <img 
                className={styles.postImage} 
                src={`http://localhost:3000${post.image_url.url}`} 
                alt={post.title}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          ) : (
            <div className={styles.noImageSection}>
              <div className={styles.placeholderImage}>
                <div className={styles.noImageIcon}>
                  📸
                </div>
                <p className={styles.noImageText}>まだ画像がないよぉ〜</p>
                <p className={styles.noImageSubText}>素敵な画像を追加してみてね！✨</p>
              </div>
            </div>
          )}

          {/* 本文 */}
          <div className={styles.bodySection}>
            <h2 className={styles.sectionTitle}>プロジェクト詳細</h2>
            <div className={styles.postBody}>
              {post.body.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>

          {/* メタ情報 */}
          <div className={styles.metaSection}>
            <div className={styles.metaItem}>
              <Clock size={16} />
              <span>作成日: {new Date(post.created_at).toLocaleDateString('ja-JP')}</span>
            </div>
            {post.updated_at !== post.created_at && (
              <div className={styles.metaItem}>
                <Clock size={16} />
                <span>更新日: {new Date(post.updated_at).toLocaleDateString('ja-JP')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostShow
