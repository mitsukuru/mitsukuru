import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchPost } from '../../../../api/postApi';
import styles from './PostShow.module.scss'; // スタイルをインポート

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
        console.log('Fetched post data:', fetchedPost); // デバッグ用
        setPost(fetchedPost.post); // 配列ではなく直接オブジェクトを取得
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
    <div className={styles.postContainer}>
      <div>
        <h2 className={styles.postTitle}>{post.title}</h2>
        <p className={styles.postContent}>{post.body}</p>
        <p className={styles.postInfo}>ユーザー名: {post.user?.name}</p>
        <p className={styles.postInfo}>作成日時: {new Date(post.created_at).toLocaleString()}</p>
        <p className={styles.postInfo}>更新日時: {new Date(post.updated_at).toLocaleString()}</p>
        <p className={styles.postInfo}>公開日時: {new Date(post.published_at).toLocaleString()}</p>
        <p className={styles.postInfo}>説明: {post.description}</p>
        {post.image_url && (
          <img className={styles.postImage} src={post.image_url} alt={post.title} />
        )}
      </div>
    </div>
  )
}

export default PostShow
