import React, { useEffect, useState } from 'react';
import axios from '@/utils/axiosConfig';
import { fetchGithubRepositories } from '@/api/githubApi';

const DebugAuth = () => {
  const [localStorageData, setLocalStorageData] = useState(null);
  const [apiTestResult, setApiTestResult] = useState(null);
  const [repositories, setRepositories] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // LocalStorage の内容を確認
    const userData = localStorage.getItem('mitsukuru_user');
    console.log('LocalStorage mitsukuru_user:', userData);
    
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setLocalStorageData(parsed);
      } catch (e) {
        console.error('Failed to parse localStorage data:', e);
      }
    }
  }, []);

  const testDirectAPI = async () => {
    try {
      const response = await axios.get('/api/v1/me');
      setApiTestResult(response.data);
      console.log('API Test Result:', response.data);
    } catch (error) {
      console.error('API Test Error:', error);
      setError(error.message);
    }
  };

  const testGitHubAPI = async () => {
    try {
      setError(null);
      console.log('Testing GitHub API...');
      const data = await fetchGithubRepositories();
      setRepositories(data);
      console.log('GitHub API Success:', data);
    } catch (error) {
      console.error('GitHub API Error:', error);
      setError(error.response?.data?.error || error.message);
    }
  };

  const setTestUser = () => {
    const testUser = {
      id: 6,
      name: "masaa0802",
      email: "masaakigoto0802@gmail.com",
      remote_avatar_url: "https://avatars.githubusercontent.com/u/88922437?v=4",
      onboarding_completed: true,
      api_token: "0ujd83F3wWjcZQ0u3dotWhFVKn22_kUajMB4sEuXU6g"
    };
    
    localStorage.setItem('mitsukuru_user', JSON.stringify(testUser));
    console.log('Test user set in localStorage');
    console.log('Stored data:', testUser);
    
    // Reload localStorage data
    setLocalStorageData(testUser);
  };

  const checkCurrentStorage = () => {
    console.log('=== Current localStorage Analysis ===');
    const userData = localStorage.getItem('mitsukuru_user');
    console.log('Raw localStorage data:', userData);
    
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        console.log('Parsed data:', parsed);
        console.log('Has api_token:', !!parsed.api_token);
        console.log('api_token value:', parsed.api_token);
        console.log('api_token type:', typeof parsed.api_token);
      } catch (e) {
        console.error('Parse error:', e);
      }
    } else {
      console.log('No data found');
    }
    
    console.log('All localStorage keys:', Object.keys(localStorage));
    console.log('================================');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>認証デバッグページ</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>LocalStorage Data</h2>
        <pre style={{ background: '#f5f5f5', padding: '10px' }}>
          {localStorageData ? JSON.stringify(localStorageData, null, 2) : 'No data'}
        </pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={checkCurrentStorage} style={{ marginRight: '10px', background: 'orange', color: 'white' }}>
          Check Storage
        </button>
        <button onClick={setTestUser} style={{ marginRight: '10px', background: 'green', color: 'white' }}>
          Set Test User
        </button>
        <button onClick={testDirectAPI} style={{ marginRight: '10px' }}>
          Test /api/v1/me
        </button>
        <button onClick={testGitHubAPI}>
          Test GitHub API
        </button>
      </div>

      {apiTestResult && (
        <div style={{ marginBottom: '20px' }}>
          <h2>API Test Result</h2>
          <pre style={{ background: '#f5f5f5', padding: '10px' }}>
            {JSON.stringify(apiTestResult, null, 2)}
          </pre>
        </div>
      )}

      {repositories && (
        <div style={{ marginBottom: '20px' }}>
          <h2>GitHub Repositories ({repositories.repositories?.length || 0})</h2>
          <pre style={{ background: '#f5f5f5', padding: '10px', maxHeight: '300px', overflow: 'auto' }}>
            {JSON.stringify(repositories, null, 2)}
          </pre>
        </div>
      )}

      {error && (
        <div style={{ marginBottom: '20px' }}>
          <h2>Error</h2>
          <pre style={{ background: '#ffeeee', padding: '10px', color: 'red' }}>
            {error}
          </pre>
        </div>
      )}
    </div>
  );
};

export default DebugAuth;