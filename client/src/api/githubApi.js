import axios from "@/utils/axiosConfig";
import API_CONFIG from "@/config/api";
import { handleApiError } from "@/utils/apiErrorHandler";

export const fetchGithubRepositories = async () => {
  console.log('🔍 fetchGithubRepositories called');
  
  // Pre-request authentication check
  const userData = localStorage.getItem('mitsukuru_user');
  console.log('Pre-request check: localStorage data exists =', !!userData);
  console.log('Raw localStorage data:', userData);
  
  if (userData) {
    try {
      const user = JSON.parse(userData);
      console.log('Pre-request user full data:', user);
      console.log('User properties:', Object.keys(user));
      console.log('api_token specifically:', user.api_token);
      console.log('api_token type:', typeof user.api_token);
      console.log('api_token length:', user.api_token?.length);
      
      if (!user.api_token || user.api_token.length === 0) {
        const error = new Error(`No API token available. Token: "${user.api_token}"`);
        console.error('❌ Token validation failed:', error.message);
        throw error;
      }
      
      console.log('✅ Pre-request validation passed');
    } catch (e) {
      console.error('❌ Pre-request check failed:', e);
      if (e.message.includes('No API token')) {
        throw e; // Re-throw the specific token error
      }
      throw new Error(`Authentication data parsing failed: ${e.message}`);
    }
  } else {
    console.error('❌ No authentication data found in localStorage');
    console.log('Available localStorage keys:', Object.keys(localStorage));
    throw new Error('User not authenticated - no localStorage data');
  }

  try {
    console.log('Making GitHub API request...');
    const res = await axios.get(`${API_CONFIG.baseURL}/api/v1/github/repositories`);
    console.log('✅ GitHub API success:', res.data);
    return res.data;
  } catch (error) {
    console.error('❌ GitHub API error:', error);
    handleApiError(error, 'fetchGithubRepositories');
    throw error;
  }
};