import { useState, useEffect } from 'react';
import axios from '@/utils/axiosConfig';
import API_CONFIG from '@/config/api';

const useAuth = () => {
  // 初期状態でLocalStorageをチェックして認証状態を設定
  const getInitialAuthState = () => {
    try {
      const storedUser = localStorage.getItem('mitsukuru_user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        return { user: userData, isAuthenticated: true };
      }
    } catch (error) {
      console.error('LocalStorage認証データの読み込みに失敗:', error);
      localStorage.removeItem('mitsukuru_user');
    }
    return { user: null, isAuthenticated: false };
  };

  const initialState = getInitialAuthState();
  const [user, setUser] = useState(initialState.user);
  const [isAuthenticated, setIsAuthenticated] = useState(initialState.isAuthenticated);
  const [loading, setLoading] = useState(false); // 初期値をfalseに変更
  const [error, setError] = useState(null);

  const checkLocalAuth = () => {
    try {
      const storedUser = localStorage.getItem('mitsukuru_user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
        return true;
      }
    } catch (error) {
      console.error('LocalStorage認証データの読み込みに失敗:', error);
      localStorage.removeItem('mitsukuru_user');
    }
    return false;
  };

  const checkAuthStatus = async (force = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // forceがfalseの場合、まずLocalStorageをチェック
      if (!force && checkLocalAuth()) {
        setLoading(false);
        return;
      }
      
      const response = await axios.get(API_CONFIG.endpoints.me);
      
      const { authenticated, user: userData } = response.data;
      
      setIsAuthenticated(authenticated);
      setUser(authenticated ? userData : null);
      
      // 認証成功時にLocalStorageに保存
      if (authenticated && userData) {
        localStorage.setItem('mitsukuru_user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('認証状態の確認に失敗しました:', error);
      setError(error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // LocalStorageをクリア
      localStorage.removeItem('mitsukuru_user');
      
      setIsAuthenticated(false);
      setUser(null);
      setError(null);
      
      // ページをリロードしてセッションをクリア
      window.location.href = '/';
    } catch (error) {
      console.error('ログアウトに失敗しました:', error);
      setError(error);
    }
  };

  const refreshAuth = () => {
    checkAuthStatus(true); // 強制的にサーバーからチェック
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    logout,
    refreshAuth,
    checkAuthStatus
  };
};

export default useAuth;