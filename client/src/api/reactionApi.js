import axios from "@/utils/axiosConfig";
import API_CONFIG from "@/config/api";
import { handleApiError } from "@/utils/apiErrorHandler";

// リアクション取得
export const fetchReactions = async (postId) => {
  try {
    const res = await axios.get(`${API_CONFIG.baseURL}/api/v1/posts/${postId}/reactions`);
    return res.data;
  } catch (error) {
    handleApiError(error, 'fetchReactions');
    throw error;
  }
};

// リアクション切り替え（高速化重視）
export const toggleReaction = async (postId, emojiName) => {
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
    
    const res = await axios.post(
      `${API_CONFIG.baseURL}/api/v1/posts/${postId}/reactions/toggle`,
      {
        emoji_name: emojiName,
        user_data: userData
      }
    );
    return res.data;
  } catch (error) {
    handleApiError(error, 'toggleReaction');
    throw error;
  }
};

// 複数投稿のリアクションを一括取得（N+1問題対策）
export const batchFetchReactions = async (postIds) => {
  try {
    if (!postIds || postIds.length === 0) {
      return { reactions: {}, user_reactions: {} };
    }

    const res = await axios.get(`${API_CONFIG.baseURL}/api/v1/posts/reactions/batch`, {
      params: { post_ids: postIds }
    });
    return res.data;
  } catch (error) {
    handleApiError(error, 'batchFetchReactions');
    throw error;
  }
};

// リアクション統計を取得（キャッシュ活用）
export const getReactionStats = async (postId) => {
  try {
    const cacheKey = `reaction_stats_${postId}`;
    const cached = sessionStorage.getItem(cacheKey);
    
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      // 5分以内のキャッシュは有効
      if (Date.now() - timestamp < 5 * 60 * 1000) {
        return data;
      }
    }

    const result = await fetchReactions(postId);
    
    // セッションストレージにキャッシュ
    sessionStorage.setItem(cacheKey, JSON.stringify({
      data: result,
      timestamp: Date.now()
    }));
    
    return result;
  } catch (error) {
    console.error('リアクション統計の取得に失敗:', error);
    return { reactions: {} };
  }
};

// キャッシュクリア
export const clearReactionCache = (postId) => {
  if (postId) {
    sessionStorage.removeItem(`reaction_stats_${postId}`);
  } else {
    // 全リアクションキャッシュをクリア
    const keys = Object.keys(sessionStorage).filter(key => 
      key.startsWith('reaction_stats_')
    );
    keys.forEach(key => sessionStorage.removeItem(key));
  }
};