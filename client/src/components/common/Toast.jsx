import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import styles from './Toast.module.scss';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // マウント時にアニメーション開始
    setIsVisible(true);

    // 指定時間後に自動で閉じる
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose && onClose();
    }, 300); // アニメーション時間
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <XCircle size={20} />;
      case 'warning':
        return <AlertCircle size={20} />;
      default:
        return <CheckCircle size={20} />;
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`${styles.toast} ${styles[type]} ${isClosing ? styles.closing : ''}`}
    >
      <div className={styles.content}>
        <div className={styles.icon}>
          {getIcon()}
        </div>
        <div className={styles.message}>
          {message}
        </div>
        <button 
          onClick={handleClose}
          className={styles.closeButton}
          aria-label="閉じる"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;