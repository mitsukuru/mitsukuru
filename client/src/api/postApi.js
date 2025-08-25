import axios from "@/utils/axiosConfig";
import API_CONFIG from "@/config/api";
import { handleApiError } from "@/utils/apiErrorHandler";

export const fetchPosts = async () => {
  try {
    const res = await axios.get(API_CONFIG.endpoints.posts);
    return res.data;
  } catch (error) {
    handleApiError(error, 'fetchPosts');
  }
};

export const fetchPost = async (id) => {
  try {
    const res = await axios.get(`${API_CONFIG.endpoints.posts}/${id}`);
    return res.data;
  } catch (error) {
    handleApiError(error, 'fetchPost');
  }
};

export const createPost = async (formData) => {
  try {
    console.log('createPost API called with:', formData);
    console.log('API endpoint:', API_CONFIG.endpoints.posts);
    
    const res = await axios.post(API_CONFIG.endpoints.posts, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('createPost API response:', res);
    return res.data;
  } catch (error) {
    console.error('createPost API error:', error);
    handleApiError(error, 'createPost');
    throw error;
  }
};
