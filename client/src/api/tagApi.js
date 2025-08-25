import axios from "@/utils/axiosConfig";
import API_CONFIG from "@/config/api";
import { handleApiError } from "@/utils/apiErrorHandler";

// タグ一覧を取得
export const fetchTags = async () => {
  try {
    const res = await axios.get(`${API_CONFIG.baseURL}/api/v1/tags`);
    return res.data;
  } catch (error) {
    handleApiError(error, 'fetchTags');
    throw error;
  }
};

// 特定のタグを取得
export const fetchTag = async (tagId) => {
  try {
    const res = await axios.get(`${API_CONFIG.baseURL}/api/v1/tags/${tagId}`);
    return res.data;
  } catch (error) {
    handleApiError(error, 'fetchTag');
    throw error;
  }
};

// タグを検索
export const searchTags = async (query) => {
  try {
    const res = await axios.get(`${API_CONFIG.baseURL}/api/v1/tags/search`, {
      params: { q: query }
    });
    return res.data;
  } catch (error) {
    handleApiError(error, 'searchTags');
    throw error;
  }
};

// 新しいタグを作成
export const createTag = async (tagData) => {
  try {
    const res = await axios.post(`${API_CONFIG.baseURL}/api/v1/tags`, {
      tag: tagData
    });
    return res.data;
  } catch (error) {
    handleApiError(error, 'createTag');
    throw error;
  }
};

// タグを削除
export const deleteTag = async (tagId) => {
  try {
    const res = await axios.delete(`${API_CONFIG.baseURL}/api/v1/tags/${tagId}`);
    return res.data;
  } catch (error) {
    handleApiError(error, 'deleteTag');
    throw error;
  }
};