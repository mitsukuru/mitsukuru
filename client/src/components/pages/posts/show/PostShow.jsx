import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchPost } from '../../../../api/postApi';
import styles from './PostShow.module.scss'; // スタイルをインポート

const PostShow = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedPost = await fetchPost(id);
        setPost(fetchedPost.post[0]);
      } catch (error) {
        console.error("データの取得に失敗しました:", error);
      }
    };
    fetchData();
  }, [id]);  

  return (
    <div className={styles.postContainer}>
      {post ? (        
        <div>
          <h2 className={styles.postTitle}>{post.title}</h2>
          <p className={styles.postContent}>{post.content}</p>
          <p className={styles.postInfo}>ユーザー名: {post.name}</p>
          <p className={styles.postInfo}>作成日時: {new Date(post.created_at).toLocaleString()}</p>
          <p className={styles.postInfo}>更新日時: {new Date(post.updated_at).toLocaleString()}</p>
          <p className={styles.postInfo}>公開日時: {new Date(post.published_at).toLocaleString()}</p>
          <p className={styles.postInfo}>説明: {post.description}</p>
          <img className={styles.postImage} src={`/public/${post.image_url.url}`} alt={post.title} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default PostShow
