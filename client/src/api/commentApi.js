import axios from "@/utils/axiosConfig";
import API_CONFIG from "@/config/api";
import { handleApiError } from "@/utils/apiErrorHandler";

export const fetchComments = async (postId) => {
  try {
    const res = await axios.get(`${API_CONFIG.baseURL}/api/v1/posts/${postId}/comments`);
    return res.data;
  } catch (error) {
    handleApiError(error, 'fetchComments');
    throw error;
  }
};

export const createComment = async (postId, commentData) => {
  try {
    // LocalStorageからユーザーデータを取得
    const storedUser = localStorage.getItem('mitsukuru_user');
    let userData = null;
    
    if (storedUser) {
      try {
        userData = JSON.parse(storedUser);
      } catch (parseError) {
        console.error('LocalStorageのユーザーデータのパースに失敗:', parseError);
      }
    }
    
    const res = await axios.post(`${API_CONFIG.baseURL}/api/v1/posts/${postId}/comments`, {
      comment: commentData,
      user_data: userData
    });
    return res.data;
  } catch (error) {
    handleApiError(error, 'createComment');
    throw error;
  }
};

export const deleteComment = async (postId, commentId) => {
  try {
    // LocalStorageからユーザーデータを取得
    const storedUser = localStorage.getItem('mitsukuru_user');
    let userData = null;
    
    if (storedUser) {
      try {
        userData = JSON.parse(storedUser);
      } catch (parseError) {
        console.error('LocalStorageのユーザーデータのパースに失敗:', parseError);
      }
    }
    
    const res = await axios.delete(`${API_CONFIG.baseURL}/api/v1/posts/${postId}/comments/${commentId}`, {
      data: { user_data: userData }
    });
    return res.data;
  } catch (error) {
    handleApiError(error, 'deleteComment');
    throw error;
  }
};