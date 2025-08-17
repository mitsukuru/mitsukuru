import axios from "@/utils/axiosConfig";
import API_CONFIG from "@/config/api";
import { handleApiError } from "@/utils/apiErrorHandler";

export const fetchGithubRepositories = async () => {
  try {
    const res = await axios.get(`${API_CONFIG.baseURL}/api/v1/github/repositories`);
    return res.data;
  } catch (error) {
    handleApiError(error, 'fetchGithubRepositories');
    throw error;
  }
};