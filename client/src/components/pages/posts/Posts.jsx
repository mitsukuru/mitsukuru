import React, { useState, useEffect } from "react";
import { fetchPosts } from '../../../api/postApi'
import { fetchUsers } from '../../../api/userApi';
import { User, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Post.module.scss';
import { Link } from 'react-router-dom'

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  const [currentImage, setCurrentImage] = React.useState(0);
  const images = [
    '/src/assets/mitsukuru-removebg-preview.png',
    '/src/assets/test_image2.png',
    '/src/assets/test_image1.png',
  ];

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const fetchData = async () => {
    try {
      const [fetchedPosts, fetchedUsers] = await Promise.all([
        fetchPosts(),
        fetchUsers()
      ]);
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
    <div className={styles.appPost}>
      <div className={styles.postContent}>
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            <User className={styles.avatarIcon} />
          </div>
          <div>
            <h2 className={styles.userName}>ユーザー名</h2>
            <div className={styles.postTime}>
              <Clock className={styles.clockIcon} />
              <span className={styles.postTime}>2時間前</span>
            </div>
          </div>
        </div>
        
        <div className={styles.appTitle}>
          <Link to={`#`} className={styles.appName}>ミツクル</Link>
          <p className={styles.appDescription}>個人開発物の投稿アプリ</p>
        </div>
        
        <div className={styles.imageGallery}>
          <img
            src={images[currentImage]}
            alt={`アプリの画面 ${currentImage + 1}`}
            className={styles.galleryImage}
          />
          <button onClick={prevImage} className={styles.galleryButton + ' ' + styles.prevButton}>
            <ChevronLeft />
          </button>
          <button onClick={nextImage} className={styles.galleryButton + ' ' + styles.nextButton}>
            <ChevronRight />
          </button>
          <div className={styles.imageIndicators}>
            {images.map((_, index) => (
              <div
                key={index}
                className={`${styles.indicator} ${index === currentImage ? styles.active || 'active' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Posts