import '@/App.css';
import logo from '@/assets/mitsukuru-removebg-preview.png';
import { Link } from 'react-router-dom';
import { SquarePen, User } from 'lucide-react';
import Notification from '@/components/features/Notification';
import DirectMessage from '@/components/features/DirectMessage';
import useAuth from '@/hooks/useAuth';
import { useEffect } from 'react';

const Header = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="header">
        <a href='/'><img src={logo} alt="ミツクルロゴ" className='logo' /></a>
        <div className='menu'>
          <ul>
            <li>読み込み中...</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="header">
      <Link to='/'><img src={logo} alt="ミツクルロゴ" className='logo' /></Link>
      <div className='menu'>
        <ul>
          {isAuthenticated && user ? (
            <>
              <li>
                <Link to='/posts/new' title="新規投稿">
                  <SquarePen className="iconButton" />
                </Link>
              </li>
              <li>
                <Notification />
              </li>
              <li>
                <DirectMessage />
              </li>
              <li className="userProfile">
                {user.remote_avatar_url ? (
                  <img 
                    src={user.remote_avatar_url} 
                    alt={`${user.name}のアバター`} 
                    className='avatarIcon' 
                    title={user.name}
                  />
                ) : (
                  <User className="avatarIcon" title={user.name} />
                )}
                <div className="userDropdown">
                  <Link to={`/users/${user.id}`}>プロフィール</Link>
                  <Link to="/settings">設定</Link>
                  <button onClick={logout} className="logoutButton">
                    ログアウト
                  </button>
                </div>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/sign_in">ログイン</Link></li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Header;