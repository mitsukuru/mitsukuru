import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchPost } from '../../../../api/postApi';

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
    <div>
      PostShow
      {post ? (
        <div>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <p>ユーザーID: {post.user_id}</p>
          <p>作成日時: {new Date(post.created_at).toLocaleString()}</p>
          <p>更新日時: {new Date(post.updated_at).toLocaleString()}</p>
          <p>公開日時: {new Date(post.published_at).toLocaleString()}</p>
          <p>説明: {post.description}</p>
          <img src={post.image_url.startsWith('#<') ? '' : post.image_url} alt={post.title} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default PostShow
