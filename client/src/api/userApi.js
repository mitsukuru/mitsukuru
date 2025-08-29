import axios from "@/utils/axiosConfig";
import API_CONFIG from "@/config/api";
import { handleApiError } from "@/utils/apiErrorHandler";

export const fetchUsers = async () => {
  try {
    const res = await axios.get(API_CONFIG.endpoints.users);
    return res.data;
  } catch (error) {
    handleApiError(error, 'fetchUsers');
  }
};

export const fetchUserDashboard = async (userId) => {
  try {
    const res = await axios.get(`${API_CONFIG.endpoints.users}/${userId}`);
    return res.data;
  } catch (error) {
    handleApiError(error, 'fetchUserDashboard');
    throw error;
  }
};