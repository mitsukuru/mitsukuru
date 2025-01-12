import React from "react";
import TroublePerson from "/src/assets/trouble_person.png";
import Community from "/src/assets/community_img.png";
import Analysis from "/src/assets/analysis.png";
import SignInGithubButton from "/src/assets/signIn_github_button.svg";
// const REACT_APP_GITHUB_CLIENT_ID = process.env.REACT_APP_GITHUB_CLIENT_ID;
// const GITHUB_REDIRECT_URL = process.env.REACT_APP_GITHUB_REDIRECT_URL;
const GITHUB_AUTH_URL = `https://github.com/login/oauth/authorize?client_id=Ov23lipUtZEQclrolCBR&redirect_url=http://localhost:3000/api/v1/callback/github/&scope=user:email`;
const Top = () => {
  return (
    <div className="top">
      <div className="top_title">
        <p>
          プロダクトの価値が<strong>「見つかり」</strong><br/>そして価値を
          <strong>「作る」</strong>
        </p>
        <p><strong>個人開発プラットフォーム</strong></p>
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
      <div className="function">
        <div className="community">
          <img
            src={Community}
            alt="コミュニティ"
            className="img_community"
          />
          <h3 className="community_title">コミュニティ</h3>
          <p className="community_description"><b>slack</b>や<b>ミツクル</b>を通じて、<br/>コミュニケーションを取ることができます。</p>
        </div>
        <div className="analysis">
          <img
            src={Analysis}
            alt="分析"
            className="img_analysis"
          />
          <h3 className="analysis_title">AI分析</h3>
          <p className="analysis_description">登録したプロダクトをAIで分析、<br/>評価をして開発物を改善できます。</p>
        </div>
      </div>
    </div>
  );
};

export default Top;
