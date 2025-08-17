import axios from 'axios';
import API_CONFIG from '@/config/api';

// グローバルなAxios設定
axios.defaults.baseURL = API_CONFIG.baseURL;
axios.defaults.withCredentials = true; // セッションクッキーを常に送信
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

// リクエストインターセプター
axios.interceptors.request.use(
  (config) => {
    console.log('=== API Request ===');
    console.log('Method:', config.method?.toUpperCase());
    console.log('URL:', config.url);
    console.log('Current headers:', config.headers);
    
    // API token をヘッダーに追加
    const userData = localStorage.getItem('mitsukuru_user');
    console.log('localStorage check: mitsukuru_user exists =', !!userData);
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        console.log('Parsed user data:', { id: user.id, name: user.name, hasToken: !!user.api_token });
        
        if (user.api_token) {
          // Ensure headers object exists
          if (!config.headers) {
            config.headers = {};
          }
          
          config.headers.Authorization = `Bearer ${user.api_token}`;
          console.log('✅ Authorization header set:', user.api_token.substring(0, 10) + '...');
        } else {
          console.warn('❌ No api_token found in user data:', user);
        }
      } catch (error) {
        console.error('❌ Error parsing user data:', error);
      }
    } else {
      console.warn('❌ No user data found in localStorage (key: mitsukuru_user)');
      console.log('Available localStorage keys:', Object.keys(localStorage));
    }
    
    console.log('Final headers:', config.headers);
    console.log('===================');
    
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// レスポンスインターセプター
axios.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Response Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default axios;