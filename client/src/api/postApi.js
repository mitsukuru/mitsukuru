import axios from "axios";
import API_CONFIG from "../config/api";
import { handleApiError } from "../utils/apiErrorHandler";

export const fetchPosts = async () => {
  try {
    const res = await axios.get(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.posts}`);
    return res.data;
  } catch (error) {
    handleApiError(error, 'fetchPosts');
  }
};

export const fetchPost = async (id) => {
  try {
    const res = await axios.get(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.posts}/${id}`);
    return res.data;
  } catch (error) {
    handleApiError(error, 'fetchPost');
  }
}
