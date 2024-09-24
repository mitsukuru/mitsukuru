import SignInGithubButton from "/src/assets/signIn_github_button.svg";
// const GITHUB_CLIENT_ID = process.env.REACT_APP_GITHUB_CLIENT_ID;
// const GITHUB_REDIRECT_URL = process.env.REACT_APP_GITHUB_REDIRECT_URL;
const GITHUB_AUTH_URL = `https://github.com/login/oauth/authorize?client_id=Ov23lipUtZEQclrolCBR&redirect_url=http://localhost:3000/callback/github/&scope=user:email`;

// ただ queryStringの付与したURLのリンクを踏ませるだけ
const SignIn = () => (
      <div className="github_signin">
        <a href={GITHUB_AUTH_URL}>
          <img src={SignInGithubButton} alt="SignInGithubButton" width={310} height={55} />
        </a>
      </div>
);

export default SignIn;
