import React from "react";
import TroublePerson from "/src/assets/trouble_person.png";
import SignInGithubButton from "/src/assets/signIn_github_button.svg";
// const REACT_APP_GITHUB_CLIENT_ID = process.env.REACT_APP_GITHUB_CLIENT_ID;
// const GITHUB_REDIRECT_URL = process.env.REACT_APP_GITHUB_REDIRECT_URL;
const GITHUB_AUTH_URL = `https://github.com/login/oauth/authorize?client_id=Ov23lipUtZEQclrolCBR&redirect_url=http://localhost:3000/callback/github/&scope=user:email`;
const Top = () => {
  return (
    <div className="top">
      <div className="top_title">
        <p>
          企業の<strong>「見つかる」</strong>とエンジニアの
          <strong>「作る」</strong>
        </p>
        <p>
          を掛け合わせた<strong>個人開発プラットフォーム</strong>
        </p>
      </div>
      <div className="nayami">
        <div className="img_trouble_person_text">
          <h2>こんなことに悩んでいませんか?</h2>
          <p>⚫︎ エンジニアとして個人開発したけど、Githubに結局放置したまま...</p>
          <p>⚫︎ 就職・転職の時に作ったけど、質が低かった...</p>
        </div>
        <img
          src={TroublePerson}
          alt="困っている人"
          className="img_trouble_person"
        />
      </div>
      <div className="github_signin">
          <a href={GITHUB_AUTH_URL}>
            <img src={SignInGithubButton} alt="SignInGithubButton" width={310} height={55} />
          </a>
        </div>
    </div>
  );
};

export default Top;
