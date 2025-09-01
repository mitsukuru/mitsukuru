// API設定
const API_CONFIG = {
  baseURL: import.meta.env.MODE === 'production' 
    ? 'https://your-production-api.com' 
    : 'http://localhost:3000',
  endpoints: {
    posts: '/api/v1/posts',
    users: '/api/v1/users',
    me: '/api/v1/me',
    notifications: '/api/v1/notifications',
    oauth: {
      config: '/api/v1/oauth/config',
      github: '/api/v1/github',
      callback: '/api/v1/callback'
    }
  }
};

export default API_CONFIG;