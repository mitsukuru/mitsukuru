import React, { useState, useEffect } from 'react';
import styles from './PostNew.module.scss';
import { useNavigate } from "react-router-dom";
import { createPost } from '@/api/postApi';
import { Upload, Send, FileText, Type, Image as ImageIcon, ArrowLeft, X, ChevronLeft, ChevronRight } from 'lucide-react';
import useAuth from '@/hooks/useAuth';

const PostNew = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, refreshAuth } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    body: '',
    image_url: null,
    additional_image_files: [],
  }); 
  const [imagePreviews, setImagePreviews] = useState([]); // 複数画像プレビュー用の状態
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);

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
    if (name === 'image_files' && files.length > 0) {
      // 複数画像の処理
      const fileArray = Array.from(files);
      const imageFiles = fileArray.slice(0, 6); // 最大6枚まで
      
      setFormData((prev) => ({
        ...prev,
        image_url: imageFiles[0] || null,
        additional_image_files: imageFiles.slice(1),
      }));

      // 画像プレビューの設定
      const previewUrls = imageFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(previewUrls);
      setCurrentPreviewIndex(0);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // 画像を削除する関数
  const removeImage = (index) => {
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
    
    if (index === 0) {
      // メイン画像を削除
      setFormData(prev => ({
        ...prev,
        image_url: prev.additional_image_files[0] || null,
        additional_image_files: prev.additional_image_files.slice(1),
      }));
    } else {
      // 追加画像を削除
      setFormData(prev => ({
        ...prev,
        additional_image_files: prev.additional_image_files.filter((_, i) => i !== index - 1),
      }));
    }
    
    if (currentPreviewIndex >= newPreviews.length) {
      setCurrentPreviewIndex(Math.max(0, newPreviews.length - 1));
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
    
    // メイン画像
    if (formData.image_url) {
      formDataToSend.append('post[image_url]', formData.image_url);
    }
    
    // 追加画像
    formData.additional_image_files.forEach((file, index) => {
      formDataToSend.append(`post[additional_image_files][]`, file);
    });
    
    // ユーザー情報を追加
    formDataToSend.append('user_data[id]', user.id);
    formDataToSend.append('user_data[name]', user.name);
    formDataToSend.append('user_data[email]', user.email);

    try {
      const response = await createPost(formDataToSend);
      console.log('投稿成功:', response);
      navigate("/home", { state: { showSuccessModal: true } });
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
          <label htmlFor="title" className={styles.label}>
            <Type className={styles.labelIcon} size={16} />
            プロダクト名
          </label>
          <input 
            type="text" 
            id="title"
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            required 
            placeholder="例）ミツクル" 
            className={styles.input}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>
            <FileText className={styles.labelIcon} size={16} />
            概要
          </label>
          <input 
            type="text" 
            id="description"
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            required 
            placeholder="例）個人開発物の投稿アプリ" 
            className={styles.input}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="body" className={styles.label}>
            <FileText className={styles.labelIcon} size={16} />
            詳細説明
          </label>
          <textarea 
            id="body"
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
            <ImageIcon className={styles.labelIcon} size={16} />
            プロダクト画像
          </label>
          <div className={styles.fileInputContainer}>
            <input 
              type="file" 
              name="image_files" 
              accept="image/*" 
              onChange={handleChange} 
              className={styles.fileInput}
              id="fileInput"
              multiple
            />
            <label htmlFor="fileInput" className={styles.fileInputLabel}>
              <Upload size={16} />
              <span>画像を選択（最大6枚）</span>
            </label>
          </div>
        </div>
        
        {imagePreviews.length > 0 && (
          <div className={styles.previewContainer}>
            <h3 className={styles.previewTitle}>プレビュー ({imagePreviews.length}枚)</h3>
            
            <div className={styles.mainPreview}>
              <div className={styles.previewImage}>
                <img src={imagePreviews[currentPreviewIndex]} alt={`プレビュー ${currentPreviewIndex + 1}`} />
                <button 
                  onClick={() => removeImage(currentPreviewIndex)}
                  className={styles.removeButton}
                  type="button"
                >
                  <X size={20} />
                </button>
                
                {imagePreviews.length > 1 && (
                  <>
                    <button 
                      onClick={() => setCurrentPreviewIndex(prev => 
                        prev > 0 ? prev - 1 : imagePreviews.length - 1
                      )}
                      className={`${styles.previewNavButton} ${styles.prevButton}`}
                      type="button"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button 
                      onClick={() => setCurrentPreviewIndex(prev => 
                        prev < imagePreviews.length - 1 ? prev + 1 : 0
                      )}
                      className={`${styles.previewNavButton} ${styles.nextButton}`}
                      type="button"
                    >
                      <ChevronRight size={24} />
                    </button>
                    
                    <div className={styles.previewCounter}>
                      {currentPreviewIndex + 1} / {imagePreviews.length}
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {imagePreviews.length > 1 && (
              <div className={styles.previewThumbnails}>
                {imagePreviews.map((preview, index) => (
                  <div key={index} className={styles.thumbnailContainer}>
                    <img
                      src={preview}
                      alt={`サムネイル ${index + 1}`}
                      className={`${styles.thumbnail} ${index === currentPreviewIndex ? styles.active : ''}`}
                      onClick={() => setCurrentPreviewIndex(index)}
                    />
                    <button 
                      onClick={() => removeImage(index)}
                      className={styles.thumbnailRemove}
                      type="button"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        <div className={styles.submitContainer}>
          <button type="submit" className={styles.submitButton}>
            <Send size={16} />
            投稿する
          </button>
        </div>
      </form>
    </div>
  );
}

export default PostNew;
