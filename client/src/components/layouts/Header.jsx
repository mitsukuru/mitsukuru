import '../../App.css';
import logo from '../../assets/mitsukuru-removebg-preview.png';
import { Link } from 'react-router-dom';

const Header = ({ isLoggedIn }) => {
  return (
    <div className="header">
      <a href='/'><img src={logo} alt="ミツクルロゴ" className='logo' /></a>
      <div className='menu'>
        <ul>
          {isLoggedIn && (
            <li>
              <Link to='/posts/new'>
                <button className="blueButton">投稿</button>
              </Link>
            </li>
          )}
          <li><a href="/sign_in">ログイン</a></li>
          <li><a href="">新規登録</a></li>
        </ul>
      </div>
    </div>
  );
}

export default Header;