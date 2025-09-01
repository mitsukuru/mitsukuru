import axios from "@/utils/axiosConfig";
import API_CONFIG from "@/config/api";
import { handleApiError } from "@/utils/apiErrorHandler";

// 通知一覧を取得
export const fetchNotifications = async (limit = 50, offset = 0) => {
  try {
    const res = await axios.get(`${API_CONFIG.endpoints.notifications}?limit=${limit}&offset=${offset}`);
    return res.data;
  } catch (error) {
    handleApiError(error, 'fetchNotifications');
    throw error;
  }
};

// 特定の通知を取得
export const fetchNotification = async (id) => {
  try {
    const res = await axios.get(`${API_CONFIG.endpoints.notifications}/${id}`);
    return res.data;
  } catch (error) {
    handleApiError(error, 'fetchNotification');
    throw error;
  }
};

// 通知を既読にする
export const markNotificationAsRead = async (id) => {
  try {
    const res = await axios.patch(`${API_CONFIG.endpoints.notifications}/${id}/mark_as_read`);
    return res.data;
  } catch (error) {
    handleApiError(error, 'markNotificationAsRead');
    throw error;
  }
};

// 全ての通知を既読にする
export const markAllNotificationsAsRead = async () => {
  try {
    const res = await axios.patch(`${API_CONFIG.endpoints.notifications}/mark_all_as_read`);
    return res.data;
  } catch (error) {
    handleApiError(error, 'markAllNotificationsAsRead');
    throw error;
  }
};

// 通知を削除
export const deleteNotification = async (id) => {
  try {
    const res = await axios.delete(`${API_CONFIG.endpoints.notifications}/${id}`);
    return res.data;
  } catch (error) {
    handleApiError(error, 'deleteNotification');
    throw error;
  }
};

// 通知を更新（既読/未読の切り替え）
export const updateNotification = async (id, data) => {
  try {
    const res = await axios.patch(`${API_CONFIG.endpoints.notifications}/${id}`, {
      notification: data
    });
    return res.data;
  } catch (error) {
    handleApiError(error, 'updateNotification');
    throw error;
  }
};