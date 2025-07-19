import React, { useState, useEffect } from "react";
import { fetchPosts } from '@/api/postApi'
import { fetchUsers } from '@/api/userApi';
import { User, Clock, ChevronLeft, ChevronRight, Heart, Eye, Image as ImageIcon } from 'lucide-react';
import styles from './Home.module.scss';
import { Link } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const { refreshAuth } = useAuth();
  const [likes, setLikes] = useState({});
  const [likesCount, setLikesCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  // 画像スライダー関数
  const nextImage = (postId, maxIndex) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [postId]: (prev[postId] || 0) < maxIndex - 1 ? (prev[postId] || 0) + 1 : 0
    }));
  };

  const prevImage = (postId, maxIndex) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [postId]: (prev[postId] || 0) > 0 ? (prev[postId] || 0) - 1 : maxIndex - 1
    }));
  };

  const goToImage = (postId, index) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [postId]: index
    }));
  };

  // 投稿の画像を配列として取得
  const getPostImages = (post) => {
    const images = [];
    
    // all_imagesメソッドから画像を取得
    if (post.all_images && post.all_images.length > 0) {
      post.all_images.forEach(img => {
        let imageUrl = null;
        
        // 画像URLを取得（構造に応じて）
        if (img && img.url) {
          imageUrl = img.url;
        } else if (img && img.table && img.table.url) {
          imageUrl = img.table.url;
        }
        
        if (imageUrl) {
          // 絶対URLの場合はそのまま、相対URLの場合はlocalhost:3000を付加
          if (imageUrl.startsWith('http')) {
            images.push(imageUrl);
          } else {
            images.push(`http://localhost:3000${imageUrl}`);
          }
        }
      });
    } else {
      // フォールバック: 従来のimage_urlを使用
      if (post.image_url && post.image_url.url) {
        images.push(`http://localhost:3000${post.image_url.url}`);
      }
    }
    
    console.log('Post images for', post.id, ':', images); // デバッグ用
    return images;
  };

  // いいねをトグルする関数
  const toggleLike = (postId) => {
    setLikes((prev) => ({
      ...prev,
      [postId]: !prev[postId]
    }));
    setLikesCount((prev) => ({
      ...prev,
      [postId]: (prev[postId] || 0) + (likes[postId] ? -1 : 1)
    }));
  };

  // 詳細画面を開く関数
  const openDetail = (postId) => {
    setViewCount((prev) => ({
      ...prev,
      [postId]: (prev[postId] || 0) + 1 // 追加: ビューカウントを増加
    }));
    // TODO:詳細画面を開く処理をここに追加
  };

  const fetchData = async () => {
    try {
      const [fetchedPosts, fetchedUsers] = await Promise.all([fetchPosts(), fetchUsers()]);
      setPosts(fetchedPosts.posts);
      setUsers(fetchedUsers.users);
    } catch (error) {
      console.error("データの取得に失敗しました:", error);
      // TODO: エラーハンドリングUIの追加を検討
      // 現在はコンソールログのみ
    }
  };

  const PublishedAt = (published_at) => {
    const now = new Date();
    const publishedDate = new Date(published_at);
    const diffInMinutes = Math.floor((now - publishedDate) / 1000 / 60);

    if (diffInMinutes < 1) {
      return 'たった今';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}分前`;
    } else if (diffInMinutes < 1440) { // 1440分 = 24時間
      const diffInHours = Math.floor(diffInMinutes / 60);
      return `${diffInHours}時間前`;
    } else {
      const publishedDate = new Date(published_at);
      return `${publishedDate.getFullYear()}年${publishedDate.getMonth() + 1}月${publishedDate.getDate()}日`;
    }
  };

  useEffect(() => {
    fetchData();
    refreshAuth();
  }, []);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.col3}></div>
        <div className={styles.postList}>
          {posts.map((post, index) =>
            <div key={index} className={styles.appPost}>
              <div className={styles.postContent}>
                <div className={styles.userInfo}>
                  <div className={styles.userAvatar}>
                    {users.find(user => user.id === post.user_id)?.remote_avatar_url ? (
                      <img
                        src={users.find(user => user.id === post.user_id)?.remote_avatar_url}
                        alt="ユーザーのアバター"
                        className={styles.userAvatarIcon}
                      />
                    ) : (
                      <User className={styles.userAvatarIcon} />
                    )}
                  </div>
                  <div>
                    <h2 className={styles.userName}>
                      {users.find(user => user.id === post.user_id)?.name || '名無しさん'}
                    </h2>
                    <div className={styles.postTime}>
                      <Clock className={styles.clockIcon} />
                      <span className={styles.postTime}>{PublishedAt(post.published_at)}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.appTitle}>
                  <Link to={`/post/${post.id}`} className={styles.appName}>{post.title}</Link>
                  <p className={styles.appDescription}>個人開発物の投稿アプリ</p>
                </div>

                <div className={styles.imageGallery}>
                  {(() => {
                    const images = getPostImages(post);
                    const currentIndex = currentImageIndex[post.id] || 0;
                    
                    if (images.length === 0) {
                      return (
                        <div className={styles.noImage}>
                          <ImageIcon size={64} color="#cbd5e1" />
                          <p>画像なし</p>
                        </div>
                      );
                    }
                    
                    return (
                      <div className={styles.slider}>
                        <div className={styles.imageContainer}>
                          <img
                            src={images[currentIndex]}
                            alt={`${post.title}の画像 ${currentIndex + 1}`}
                            className={styles.galleryImage}
                          />
                          
                          {images.length > 1 && (
                            <>
                              <button 
                                onClick={() => prevImage(post.id, images.length)}
                                className={`${styles.sliderButton} ${styles.prevButton}`}
                                aria-label="前の画像"
                              >
                                <ChevronLeft size={24} />
                              </button>
                              <button 
                                onClick={() => nextImage(post.id, images.length)}
                                className={`${styles.sliderButton} ${styles.nextButton}`}
                                aria-label="次の画像"
                              >
                                <ChevronRight size={24} />
                              </button>
                              
                              <div className={styles.imageCounter}>
                                {currentIndex + 1} / {images.length}
                              </div>
                            </>
                          )}
                        </div>
                        
                        {images.length > 1 && (
                          <div className={styles.thumbnails}>
                            {images.map((image, index) => (
                              <button
                                key={index}
                                onClick={() => goToImage(post.id, index)}
                                className={`${styles.thumbnail} ${index === currentIndex ? styles.active : ''}`}
                              >
                                <img src={image} alt={`サムネイル ${index + 1}`} />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
                <div className={styles.postBottoms}>
                  <div className={styles.likeContainer}>
                    <button onClick={() => toggleLike(post.id)} className={styles.likeButton}>
                      {likes[post.id] ? <Heart color="red" /> : <Heart color="gray" />}
                    </button>
                    <span className={styles.likesCount}>{likesCount[post.id] || 0}</span>
                  </div>
                  <div className={styles.viewCountContainer}>
                    <Eye className={styles.viewCountIcon} />
                    <span className={styles.viewCount}>{viewCount[post.id] || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className={styles.col3}></div>
      </div>
    </>
  );
};

export default Home