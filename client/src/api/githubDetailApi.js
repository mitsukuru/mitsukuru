import axios from "@/utils/axiosConfig";
import API_CONFIG from "@/config/api";
import { handleApiError } from "@/utils/apiErrorHandler";

// GitHubリポジトリの詳細情報を取得
export const fetchRepositoryDetails = async (owner, repo) => {
  try {
    const res = await axios.get(`${API_CONFIG.endpoints.github}/repository/${owner}/${repo}`);
    return res.data;
  } catch (error) {
    handleApiError(error, 'fetchRepositoryDetails');
    throw error;
  }
};

// GitHubリポジトリのコミット履歴を取得
export const fetchRepositoryCommits = async (owner, repo, limit = 10) => {
  try {
    const res = await axios.get(`${API_CONFIG.endpoints.github}/repository/${owner}/${repo}/commits?limit=${limit}`);
    return res.data;
  } catch (error) {
    handleApiError(error, 'fetchRepositoryCommits');
    throw error;
  }
};

// GitHubリポジトリのコントリビューターを取得
export const fetchRepositoryContributors = async (owner, repo) => {
  try {
    const res = await axios.get(`${API_CONFIG.endpoints.github}/repository/${owner}/${repo}/contributors`);
    return res.data;
  } catch (error) {
    handleApiError(error, 'fetchRepositoryContributors');
    throw error;
  }
};

// GitHubリポジトリの言語統計を取得
export const fetchRepositoryLanguages = async (owner, repo) => {
  try {
    const res = await axios.get(`${API_CONFIG.endpoints.github}/repository/${owner}/${repo}/languages`);
    return res.data;
  } catch (error) {
    handleApiError(error, 'fetchRepositoryLanguages');
    throw error;
  }
};

// GitHubリポジトリのIssue統計を取得
export const fetchRepositoryIssues = async (owner, repo) => {
  try {
    const res = await axios.get(`${API_CONFIG.endpoints.github}/repository/${owner}/${repo}/issues`);
    return res.data;
  } catch (error) {
    handleApiError(error, 'fetchRepositoryIssues');
    throw error;
  }
};