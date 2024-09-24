import React, { useState } from 'react';
import './WebAnalyzer.css';

const WebAnalyzer = () => {
  const [url, setUrl] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setAnalysis('');

    try {
      const response = await fetch('http://localhost:3000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.content
        },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        throw new Error('分析中にエラーが発生しました');
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="web-analyzer">
      <h1>Web Analyzer</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            placeholder="https://example.com"
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? '分析中...' : '分析'}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="error-message">
          <p>エラー: {error}</p>
        </div>
      )}
      
      {analysis && (
        <div className="analysis-result">
          <h2>分析結果:</h2>
          <pre>{analysis}</pre>
        </div>
      )}
    </div>
  );
};

export default WebAnalyzer;