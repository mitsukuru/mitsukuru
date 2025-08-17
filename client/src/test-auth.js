// Simple test to check localStorage and make API call
console.log('=== Authentication Test ===');

// Check localStorage
const userData = localStorage.getItem('mitsukuru_user');
console.log('localStorage mitsukuru_user:', userData ? 'exists' : 'not found');

if (userData) {
  try {
    const user = JSON.parse(userData);
    console.log('User data:', user);
    console.log('API Token:', user.api_token ? 'exists (' + user.api_token.substring(0, 10) + '...)' : 'missing');
    
    // Test API call
    fetch('http://localhost:3000/api/v1/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${user.api_token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log('/api/v1/me response:', data);
      
      // Test GitHub API
      if (data.authenticated) {
        return fetch('http://localhost:3000/api/v1/github/repositories', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${user.api_token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
      } else {
        throw new Error('Not authenticated');
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log('GitHub API response:', data);
      console.log('Repository count:', data.repositories ? data.repositories.length : 0);
    })
    .catch(error => {
      console.error('API call failed:', error);
    });
    
  } catch (e) {
    console.error('Failed to parse user data:', e);
  }
} else {
  console.log('No user data in localStorage');
  
  // Check what keys exist in localStorage
  console.log('All localStorage keys:', Object.keys(localStorage));
}