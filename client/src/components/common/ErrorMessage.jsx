import { useState, useEffect } from 'react';
import styles from './ErrorMessage.module.scss';

const ErrorMessage = ({ error, onClose, autoHide = true, hideDelay = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoHide && hideDelay > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, hideDelay);

      return () => clearTimeout(timer);
    }
  }, [autoHide, hideDelay]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  if (!error || !isVisible) {
    return null;
  }

  const getErrorType = () => {
    if (error.error) {
      switch (error.error) {
        case 'oauth_failed':
          return 'OAuth認証エラー';
        case 'unsupported_provider':
          return 'プロバイダーエラー';
        case 'oauth_start_failed':
          return '認証開始エラー';
        default:
          return 'エラー';
      }
    }
    return 'エラー';
  };

  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorMessage}>
        <div className={styles.errorHeader}>
          <span className={styles.errorType}>{getErrorType()}</span>
          <button 
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="エラーメッセージを閉じる"
          >
            ×
          </button>
        </div>
        <div className={styles.errorContent}>
          <p className={styles.mainMessage}>{error.message}</p>
          {error.error_id && (
            <p className={styles.errorId}>
              エラーID: {error.error_id}
            </p>
          )}
          {error.details && error.details.length > 0 && (
            <details className={styles.errorDetails}>
              <summary>詳細情報</summary>
              <ul>
                {error.details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </details>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;