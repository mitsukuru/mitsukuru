/**
 * API エラーハンドリングユーティリティ
 */

export const handleApiError = (error, operation) => {
  console.error(`API Error (${operation}):`, error);
  
  if (error.response) {
    // サーバーからのエラーレスポンス
    const status = error.response.status;
    const data = error.response.data;
    
    if (status >= 500) {
      throw new Error('サーバーエラーが発生しました。しばらく時間をおいて再度お試しください。');
    } else if (status === 429) {
      throw new Error('リクエストが制限されています。しばらく時間をおいて再度お試しください。');
    } else if (status === 401) {
      throw new Error('認証に失敗しました。再度ログインしてください。');
    } else if (status === 403) {
      throw new Error('この操作を実行する権限がありません。');
    } else if (status === 404) {
      throw new Error('要求されたリソースが見つかりません。');
    } else if (status >= 400) {
      throw new Error(data.message || 'リクエストエラーが発生しました。');
    }
  } else if (error.request) {
    // ネットワークエラー
    throw new Error('ネットワークエラーが発生しました。インターネット接続を確認してください。');
  } else {
    // その他のエラー
    throw new Error('予期しないエラーが発生しました。');
  }
};

export const createApiErrorMessage = (error, operation) => {
  return {
    error: 'api_error',
    message: error.message,
    operation,
    timestamp: new Date().toISOString()
  };
};