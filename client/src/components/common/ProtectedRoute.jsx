import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';

const ProtectedRoute = ({ children, requireAuth = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !isAuthenticated) {
        // 認証が必要なページで未認証の場合、サインインページにリダイレクト
        navigate('/sign_in', { replace: true });
      } else if (!requireAuth && isAuthenticated) {
        // 認証不要なページ（サインインページなど）で認証済みの場合、ホームにリダイレクト
        const publicPages = ['/sign_in', '/'];
        if (publicPages.includes(location.pathname)) {
          navigate('/home', { replace: true });
        }
      }
    }
  }, [isAuthenticated, loading, requireAuth, navigate, location.pathname]);

  // ローディング中は何も表示しない（フラッシュを防ぐ）
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '18px'
      }}>
        読み込み中...
      </div>
    );
  }

  // 認証状態が適切でない場合は何も表示しない（リダイレクト処理中）
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (!requireAuth && isAuthenticated && ['/sign_in', '/'].includes(location.pathname)) {
    return null;
  }

  return children;
};

export default ProtectedRoute;