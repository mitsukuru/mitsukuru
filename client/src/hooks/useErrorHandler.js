import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const useErrorHandler = () => {
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const errorType = searchParams.get('error');
    const message = searchParams.get('message');
    const errorId = searchParams.get('error_id');

    if (errorType && message) {
      setError({
        error: errorType,
        message: decodeURIComponent(message),
        error_id: errorId
      });

      // URLからエラーパラメータを削除（履歴を汚さないため）
      const newSearchParams = new URLSearchParams(location.search);
      newSearchParams.delete('error');
      newSearchParams.delete('message');
      newSearchParams.delete('error_id');

      const newSearch = newSearchParams.toString();
      const newUrl = newSearch ? `${location.pathname}?${newSearch}` : location.pathname;
      
      // replace を使用して履歴エントリを置き換え
      navigate(newUrl, { replace: true });
    }
  }, [location, navigate]);

  const clearError = () => {
    setError(null);
  };

  const showError = (errorData) => {
    setError(errorData);
  };

  return {
    error,
    clearError,
    showError
  };
};

export default useErrorHandler;