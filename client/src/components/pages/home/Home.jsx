import React, { useState, useEffect, useMemo } from "react";
import { fetchPosts } from '@/api/postApi'
import { fetchUsers } from '@/api/userApi';
import { fetchTags } from '@/api/tagApi';
import { User, Clock, ChevronLeft, ChevronRight, Image as ImageIcon, Search, X, Tag, ChevronDown } from 'lucide-react';
import styles from './Home.module.scss';
import { Link, useLocation } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import SuccessModal from '@/components/common/SuccessModal';
import Comments from '@/components/features/Comments';
import CommentModal from '@/components/common/CommentModal';
import EmojiReactions from '@/components/features/EmojiReactions';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [tags, setTags] = useState([]);
  const { refreshAuth } = useAuth();
  const location = useLocation();
  const [reactions, setReactions] = useState({});
  const [userReactions, setUserReactions] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [commentsCount, setCommentsCount] = useState({});
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  
  // 検索状態
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);

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

  // 投稿の検索機能
  const searchedPosts = useMemo(() => {
    let filtered = posts;

    // キーワード検索
    if (searchTerm) {
      filtered = filtered.filter(post => {
        const titleMatch = post.title?.toLowerCase().includes(searchTerm.toLowerCase());
        const descriptionMatch = post.body?.toLowerCase().includes(searchTerm.toLowerCase());
        
        return titleMatch || descriptionMatch;
      });
    }

    // タグ検索
    if (selectedTags.length > 0) {
      filtered = filtered.filter(post => {
        if (!post.tags || post.tags.length === 0) return false;
        return selectedTags.some(selectedTagId => 
          post.tags.some(postTag => postTag.id === selectedTagId)
        );
      });
    }

    return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [posts, searchTerm, selectedTags]);

  // 検索をクリア
  const clearSearch = () => {
    setSearchTerm('');
    setSelectedTags([]);
  };

  // タグ選択の処理
  const handleTagSelect = (tagId) => {
    setSelectedTags(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      } else {
        return [...prev, tagId];
      }
    });
  };

  // 選択されたタグを削除
  const removeSelectedTag = (tagId) => {
    setSelectedTags(prev => prev.filter(id => id !== tagId));
  };

  // リアクションを更新する関数
  const handleReactionChange = (postId, newReactions, newUserReactions) => {
    setReactions(prev => ({
      ...prev,
      [postId]: newReactions
    }));
    
    if (newUserReactions) {
      setUserReactions(prev => ({
        ...prev,
        [postId]: newUserReactions
      }));
    }
  };

  // コメント数を更新する関数
  const handleCommentCountChange = (postId, newCount) => {
    setCommentsCount(prev => ({
      ...prev,
      [postId]: newCount
    }));
  };

  // コメントモーダルを開く関数
  const handleCommentClick = (postId) => {
    const post = posts.find(p => p.id === postId);
    setSelectedPost(post);
    setShowCommentModal(true);
  };

  // コメントモーダルを閉じる関数
  const closeCommentModal = () => {
    setShowCommentModal(false);
    setSelectedPost(null);
  };

  const fetchData = async () => {
    try {
      const [fetchedPosts, fetchedUsers, fetchedTags] = await Promise.all([
        fetchPosts(), 
        fetchUsers(), 
        fetchTags()
      ]);
      setPosts(fetchedPosts.posts);
      setUsers(fetchedUsers.users);
      setTags(fetchedTags.tags || []);
      
      // コメント数を初期化
      const initialCommentsCount = {};
      const initialReactions = {};
      const initialUserReactions = {};
      
      fetchedPosts.posts.forEach(post => {
        initialCommentsCount[post.id] = post.comments_count || 0;
        initialReactions[post.id] = post.reactions || {};
        initialUserReactions[post.id] = post.user_reactions || {};
      });
      
      setCommentsCount(initialCommentsCount);
      setReactions(initialReactions);
      setUserReactions(initialUserReactions);
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

  // 投稿成功後のモーダル表示処理
  useEffect(() => {
    if (location.state?.showSuccessModal) {
      setShowSuccessModal(true);
      // 状態をクリアして再表示を防ぐ
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <>
      <SuccessModal 
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message="投稿が完了しました！"
      />
      
      {selectedPost && (
        <CommentModal
          isOpen={showCommentModal}
          onClose={closeCommentModal}
          postId={selectedPost.id}
          postTitle={selectedPost.title}
          commentsCount={commentsCount[selectedPost.id] || 0}
          onCommentCountChange={(newCount) => handleCommentCountChange(selectedPost.id, newCount)}
        />
      )}
      <div className={styles.container}>
        {/* 左サイドバー - 検索機能 */}
        <div className={styles.sidebar}>
          <div className={styles.searchContainer}>
            <h3 className={styles.searchTitle}>
              <Search size={20} />
              投稿を検索
            </h3>
            
            <div className={styles.searchGroup}>
              <label className={styles.searchLabel}>キーワード検索</label>
              <div className={styles.searchBox}>
                <Search className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="タイトル、内容で検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className={styles.clearButton}
                    title="キーワードをクリア"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
            
            <div className={styles.searchGroup}>
              <label className={styles.searchLabel}>タグ検索</label>
              <div className={styles.tagSelector}>
                <button
                  className={styles.tagDropdownButton}
                  onClick={() => setShowTagDropdown(!showTagDropdown)}
                >
                  <Tag className={styles.tagIcon} />
                  タグを選択
                  <ChevronDown 
                    className={`${styles.chevron} ${showTagDropdown ? styles.open : ''}`} 
                  />
                </button>
                
                {showTagDropdown && (
                  <div className={styles.tagDropdown}>
                    <div className={styles.tagList}>
                      {tags.map(tag => (
                        <label key={tag.id} className={styles.tagOption}>
                          <input
                            type="checkbox"
                            checked={selectedTags.includes(tag.id)}
                            onChange={() => handleTagSelect(tag.id)}
                            className={styles.tagCheckbox}
                          />
                          <span className={styles.tagName}>{tag.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {selectedTags.length > 0 && (
                <div className={styles.selectedTags}>
                  {selectedTags.map(tagId => {
                    const tag = tags.find(t => t.id === tagId);
                    return tag ? (
                      <div key={tagId} className={styles.selectedTag}>
                        {tag.name}
                        <button
                          onClick={() => removeSelectedTag(tagId)}
                          className={styles.removeTag}
                          title="タグを削除"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
              )}
            </div>
            
            <div className={styles.searchResults}>
              <div className={styles.resultsHeader}>
                <Search size={16} />
                <span>{searchedPosts.length}件の投稿</span>
              </div>
              
              {(searchTerm || selectedTags.length > 0) && (
                <div className={styles.activeSearch}>
                  {searchTerm && `「${searchTerm}」`}
                  {searchTerm && selectedTags.length > 0 && ' + '}
                  {selectedTags.length > 0 && `${selectedTags.length}個のタグ`}
                  で検索中
                </div>
              )}
              
              {(searchTerm || selectedTags.length > 0) && (
                <button
                  onClick={clearSearch}
                  className={styles.clearAllButton}
                  title="すべてクリア"
                >
                  <X size={14} />
                  すべてクリア
                </button>
              )}
            </div>
          </div>
        </div>

        <div className={styles.postList}>
          {searchedPosts.map((post, index) =>
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
                  <EmojiReactions 
                    postId={post.id}
                    reactions={reactions[post.id] || {}}
                    userReactions={userReactions[post.id] || {}}
                    onReactionChange={handleReactionChange}
                  />
                  <Comments 
                    postId={post.id}
                    commentsCount={commentsCount[post.id] || 0}
                    onCommentClick={handleCommentClick}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 右サイドバー */}
        <div className={styles.rightSidebar}>
          {/* 将来的に他のコンテンツを追加可能 */}
        </div>
      </div>
    </>
  );
};

export default Home