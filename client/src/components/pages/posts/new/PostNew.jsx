import React, { useState } from 'react';
import styles from './PostNew.module.scss';
import { useNavigate } from "react-router-dom";
import axios from 'axios'; // Import axios

const PostNew = () => {
  const formDataToSend = new FormData();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    body: '',
    image_url: null,
  });

  const handleChange = ({ target: { name, value, files } }) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'image_url' ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Object.entries(formData).forEach(([key, value]) => formDataToSend.append(key, value));

    try {
      axios.post('http://localhost:3000/api/v1/posts/', { post: formData }, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then((response) => {
          console.log(response.data);
          navigate("/home");
        })
        .catch((error) => {
          console.error("エラーが発生しました:", error); // エラーハンドリングを追加
        });
    } catch (error) {
      console.error('エラー:', error.response ? error.response.data : error.message); // エラーメッセージを詳細に表示
    }
  };

  return (
    <div className={styles.container}>
      <h1>新規投稿</h1>
      <form onSubmit={handleSubmit}>
        <label>
          プロダクト名:
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </label>
        <label>
          概要:
          <input type="text" name="description" value={formData.description} onChange={handleChange} required />
        </label>
        <label>
          説明:
          <textarea name="body" value={formData.body} onChange={handleChange} required></textarea>
        </label>
        <label>
          プロダクト画像:
          <input type="file" name="image_url" accept="image/*" onChange={handleChange} />
        </label>
        <button className={styles.postSubmitButton} type="submit">投稿</button>
      </form>
    </div>
  );
}

export default PostNew