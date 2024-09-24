import React, { useState, useEffect } from "react";
import { fetchPosts } from '../../../api/postApi'
import { fetchUsers } from '../../../api/userApi';
import { User, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Home.module.scss';
import { Link } from 'react-router-dom'

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  const images = [
    '/src/assets/mitsukuru-removebg-preview.png',
    '/src/assets/test_image2.png',
    '/src/assets/test_image1.png',
  ];

  const [currentImages, setCurrentImages] = useState({});

  const nextImage = (postId) => {
    setCurrentImages((prev) => ({
      ...prev,
      [postId]: (prev[postId] || 0) + 1 % images.length
    }));
  };

  const prevImage = (postId) => {
    setCurrentImages((prev) => ({
      ...prev,
      [postId]: (prev[postId] || 0) - 1 + images.length % images.length
    }));
  };

  const fetchData = async () => {
    const fetchedPosts = await fetchPosts();
    const fetchedUsers = await fetchUsers();
    try {
      setPosts(fetchedPosts.posts);
      setUsers(fetchedUsers.users);
    } catch (error) {
      console.error("データの取得に失敗しました:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
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
                  <span className={styles.postTime}>2時間前</span>
                </div>
              </div>
            </div>
            
            <div className={styles.appTitle}>
              <Link to={`#`} className={styles.appName}>{post.title}</Link>
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
          </div>
        </div>
      )}
    </>
  );
};

export default Home