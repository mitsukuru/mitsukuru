import React, { useState, useEffect } from "react";
import { fetchPosts } from '../../../api/postApi'
import { fetchUsers } from '../../../api/userApi';
import { User, Clock, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import styles from './Home.module.scss';
import { Link } from 'react-router-dom';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentImages, setCurrentImages] = useState({});
  const [likes, setLikes] = useState({});
  const [likesCount, setLikesCount] = useState({});

  // TODO: S3から取得する形に後々変更
  const images = [
    '/src/assets/mitsukuru-removebg-preview.png',
    '/src/assets/test_image2.png',
    '/src/assets/test_image1.png',
  ];

  // 画像を前送りにする関数
  const nextImage = (postId) => {
    setCurrentImages((prev) => ({
      ...prev,
      [postId]: (prev[postId] !== undefined ? (prev[postId] + 1) % images.length : 0)
    }));
  };

  // 画像を後ろ送りにする関数
  const prevImage = (postId) => {
    setCurrentImages((prev) => ({
      ...prev,
      [postId]: (prev[postId] !== undefined ? (prev[postId] - 1 + images.length) % images.length : images.length - 1)
    }));
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

  const fetchData = async () => {
    try {
      const [fetchedPosts, fetchedUsers] = await Promise.all([fetchPosts(), fetchUsers()]);
      setPosts(fetchedPosts.posts);
      setUsers(fetchedUsers.users);
    } catch (error) {
      console.error("データの取得に失敗しました:", error);
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
  }, []);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.col3}></div>
        <div className={styles.postList}>
      {posts.map((post, index)=>
        <div key={index} className={styles.appPost}>
          <div className={styles.postContent}>
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>
              {users.find(user => user.id === post.user_id)?.remote_avatar_url ? (
                <img
                  src={users.find(user => user.id === post.user_id)?.remote_avatar_url} 
                  alt="ユーザーのアバター" 
                  className={styles.avatarIcon} 
                />
              ) : (
                <User className={styles.avatarIcon} />
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
              <img
                src={images[currentImages[post.id] || 0]}
                alt={`アプリの画面 ${currentImages[post.id] + 1 || 1}`}
                className={styles.galleryImage}
              />
              <button onClick={() => prevImage(post.id)} className={styles.galleryButton + ' ' + styles.prevButton}>
                <ChevronLeft />
              </button>
              <button onClick={() => nextImage(post.id)} className={styles.galleryButton + ' ' + styles.nextButton}>
                <ChevronRight />
              </button>
              <div className={styles.imageIndicators}>
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={`${styles.indicator} ${index === currentImages[post.id] ? styles.active || 'active' : ''}`}
                  />
                ))}
              </div>
            </div>
            <div className={styles.likeContainer}>
              <button onClick={() => toggleLike(post.id)} className={styles.likeButton}>
                {likes[post.id] ? <Heart color="red" /> : <Heart color="gray" />}
              </button>
              <span className={styles.likesCount}>{likesCount[post.id] || 0}</span>
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