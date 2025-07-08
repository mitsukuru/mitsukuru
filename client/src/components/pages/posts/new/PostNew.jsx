import React, { useState, useEffect } from 'react';
import styles from './PostNew.module.scss';
import { useNavigate } from "react-router-dom";
import { createPost } from '@/api/postApi';
import { Upload, Send, FileText, Type, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import useAuth from '@/hooks/useAuth';

const PostNew = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, refreshAuth } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    body: '',
    image_url: null,
  }); 
  const [imagePreview, setImagePreview] = useState(null); // 画像プレビュー用の状態を追加

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        // サーバーの認証状態を確認
        try {
          await refreshAuth();
        } catch (error) {
          console.error('認証状態の確認に失敗:', error);
          navigate('/sign_in');
        }
      }
    };
    
    checkAuth();
  }, [isAuthenticated, navigate, refreshAuth]);

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
    
    if (!isAuthenticated || !user) {
      alert('ログインが必要です');
      navigate('/sign_in');
      return;
    }
    
    // FormDataを作成
    const formDataToSend = new FormData();
    formDataToSend.append('post[title]', formData.title);
    formDataToSend.append('post[description]', formData.description);
    formDataToSend.append('post[body]', formData.body);
    if (formData.image_url) {
      formDataToSend.append('post[image_url]', formData.image_url);
    }
    
    // ユーザー情報を追加
    formDataToSend.append('user_data[id]', user.id);
    formDataToSend.append('user_data[name]', user.name);
    formDataToSend.append('user_data[email]', user.email);

    try {
      const response = await createPost(formDataToSend);
      console.log('投稿成功:', response);
      navigate("/home");
    } catch (error) {
      console.error('投稿エラー:', error.response ? error.response.data : error.message);
      if (error.response?.status === 401) {
        alert('認証に失敗しました。再度ログインしてください。');
        navigate('/sign_in');
      }
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
