import React, { createContext, useContext, useState } from 'react';
import Toast from '@/components/common/Toast';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success', duration = 3000) => {
    try {
      const id = Date.now() + Math.random();
      const newToast = { id, message, type, duration };
      
      setToasts(prevToasts => [...prevToasts, newToast]);
    } catch (error) {
      console.error('Toast表示エラー:', error);
    }
  };

  const removeToast = (id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  const showSuccess = (message, duration) => showToast(message, 'success', duration);
  const showError = (message, duration) => showToast(message, 'error', duration);
  const showWarning = (message, duration) => showToast(message, 'warning', duration);

  const value = {
    showToast,
    showSuccess,
    showError,
    showWarning,
    removeToast
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};