import '../../App.css';
import logo from '../../assets/mitsukuru-removebg-preview.png';
import { Link } from 'react-router-dom';
import { SquarePen } from 'lucide-react';
import Notification from '../features/Notification';
import DirectMessage from '../features/DirectMessage';

const Header = ({ isLoggedIn }) => {
  return (
    <div className="header">
      <a href='/'><img src={logo} alt="ミツクルロゴ" className='logo' /></a>
      <div className='menu'>
        <ul>
          {isLoggedIn && (
            <>
              <li>
                <Link to='/posts/new'>
                  <SquarePen className="iconButton" />
                </Link>
              </li>
              <li>
                <Notification />
              </li>
              <li>
                <DirectMessage />
              </li>
              <li>
                <img src='https://avatars.githubusercontent.com/u/88922437?v' alt="ユーザーアバター" className='avatarIcon' />
              </li>
            </>
          )}
          {/* <li><a href="/sign_in">ログイン</a></li>
          <li><a href="">新規登録</a></li> */}
        </ul>
      </div>
    </div>
  );
}

export default Header;