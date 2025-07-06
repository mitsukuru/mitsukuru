import React, { useState } from 'react';
import styles from './PostNew.module.scss';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Upload, Send, FileText, Type, Image as ImageIcon, ArrowLeft } from 'lucide-react';

const PostNew = () => {
  const formDataToSend = new FormData();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    body: '',
    image_url: null,
  }); 
  const [imagePreview, setImagePreview] = useState(null); // 画像プレビュー用の状態を追加

  const handleChange = ({ target: { name, value, files } }) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'image_url' ? files[0] : value,
    }));

    // 画像プレビューの設定
    if (name === 'image_url' && files.length > 0) {
      const file = files[0];
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl); // プレビューURLを設定
    }
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
      <div className={styles.header}>
        <button onClick={() => navigate('/home')} className={styles.backButton}>
          <ArrowLeft size={20} />
        </button>
        <h1 className={styles.title}>新しいプロダクトを投稿</h1>
      </div>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            <Type className={styles.labelIcon} size={20} />
            プロダクト名
          </label>
          <input 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            required 
            placeholder="例）ミツクル" 
            className={styles.input}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>
            <FileText className={styles.labelIcon} size={20} />
            概要
          </label>
          <input 
            type="text" 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            required 
            placeholder="例）個人開発物の投稿アプリ" 
            className={styles.input}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>
            <FileText className={styles.labelIcon} size={20} />
            詳細説明
          </label>
          <textarea 
            name="body" 
            value={formData.body} 
            onChange={handleChange} 
            required 
            placeholder="プロダクトの詳細な説明を記入してください..." 
            className={styles.textarea}
            rows={6}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>
            <ImageIcon className={styles.labelIcon} size={20} />
            プロダクト画像
          </label>
          <div className={styles.fileInputContainer}>
            <input 
              type="file" 
              name="image_url" 
              accept="image/*" 
              onChange={handleChange} 
              className={styles.fileInput}
              id="fileInput"
            />
            <label htmlFor="fileInput" className={styles.fileInputLabel}>
              <Upload size={20} />
              <span>画像を選択</span>
            </label>
          </div>
        </div>
        
        {imagePreview && (
          <div className={styles.previewContainer}>
            <h3 className={styles.previewTitle}>プレビュー</h3>
            <div className={styles.previewImage}>
              <img src={imagePreview} alt="プレビュー" />
            </div>
          </div>
        )}
        
        <div className={styles.submitContainer}>
          <button type="submit" className={styles.submitButton}>
            <Send size={20} />
            投稿する
          </button>
        </div>
      </form>
    </div>
  );
}

export default PostNew;
