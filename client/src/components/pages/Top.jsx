import React from "react";
import Community from "/src/assets/community_img.png";
import Analysis from "/src/assets/analysis.png";
import styles from "./Top.module.scss";

const GITHUB_AUTH_URL = `https://github.com/login/oauth/authorize?client_id=Ov23lipUtZEQclrolCBR&redirect_url=http://localhost:3000/api/v1/callback/github/&scope=user:email`;

const Top = () => {
  return (
    <div className={styles.top}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.heroShape1}></div>
          <div className={styles.heroShape2}></div>
          <div className={styles.heroShape3}></div>
        </div>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.badgeIcon}>✨</span>
            <span>個人開発プラットフォーム</span>
          </div>
          <h1 className={styles.heroTitle}>
            プロダクトの価値が<br />
            <span className={styles.highlight}>「見つかり」</span>
            そして価値を
            <span className={styles.highlight}>「作る」</span>
          </h1>
          <p className={styles.heroDescription}>
            あなたの開発したプロダクトを共有し、<br className={styles.mobileBreak} />
            AIによる分析とコミュニティからのフィードバックで<br />
            さらなる価値を創造しましょう
          </p>
          <div className={styles.heroCta}>
            <a href={GITHUB_AUTH_URL} className={styles.ctaButton}>
              <svg className={styles.githubIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHubで無料で始める
            </a>
            <a href="#features" className={styles.secondaryButton}>
              機能を見る
              <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
          <p className={styles.heroNote}>
            ※ GitHubアカウントで簡単登録・ログイン
          </p>
        </div>
      </section>

      {/* Problem Section */}
      <section className={styles.problemSection}>
        <div className={styles.problemContent}>
          <div className={styles.problemHeader}>
            <span className={styles.problemBadge}>PROBLEMS</span>
            <h2 className={styles.sectionTitle}>こんな課題、ありませんか？</h2>
            <p className={styles.problemSubtitle}>
              個人開発をしているエンジニアが抱える<br />よくある悩みをミツクルが解決します
            </p>
          </div>
          <div className={styles.problemList}>
            <div className={styles.problemItem}>
              <div className={styles.problemIconWrapper}>
                <div className={styles.problemIcon}>📦</div>
              </div>
              <h3 className={styles.problemTitle}>放置されたプロダクト</h3>
              <p className={styles.problemText}>
                個人開発したプロダクトがGitHubで放置されている。せっかく作ったのに誰にも見られず、フィードバックももらえない。
              </p>
            </div>
            <div className={styles.problemItem}>
              <div className={styles.problemIconWrapper}>
                <div className={styles.problemIcon}>💭</div>
              </div>
              <h3 className={styles.problemTitle}>改善点が分からない</h3>
              <p className={styles.problemText}>
                プロダクトの改善点やユーザーニーズが分からない。客観的な評価や具体的なアドバイスが欲しい。
              </p>
            </div>
            <div className={styles.problemItem}>
              <div className={styles.problemIconWrapper}>
                <div className={styles.problemIcon}>🤝</div>
              </div>
              <h3 className={styles.problemTitle}>孤独な開発環境</h3>
              <p className={styles.problemText}>
                同じような開発をしている仲間と出会えない。モチベーションを保つのが難しく、情報交換の場がない。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection} id="features">
        <div className={styles.featuresHeader}>
          <span className={styles.featuresBadge}>FEATURES</span>
          <h2 className={styles.sectionTitle}>ミツクルの機能</h2>
          <p className={styles.featuresSubtitle}>
            あなたのプロダクトを次のレベルへ導く<br />革新的な機能を提供します
          </p>
        </div>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureNumber}>01</div>
            <div className={styles.featureImageWrapper}>
              <img src={Analysis} alt="AI分析" className={styles.featureImage} />
              <div className={styles.featureOverlay}>
                <div className={styles.featureTag}>🤖 AI Powered</div>
              </div>
            </div>
            <div className={styles.featureContent}>
              <h3 className={styles.featureTitle}>AI分析</h3>
              <p className={styles.featureDescription}>
                登録したプロダクトをAIが自動分析。技術スタック、コード品質、改善提案まで、客観的な評価とフィードバックを提供します。
              </p>
              <ul className={styles.featureList}>
                <li>✓ コード品質の自動評価</li>
                <li>✓ 技術スタックの分析</li>
                <li>✓ 具体的な改善提案</li>
              </ul>
            </div>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureNumber}>02</div>
            <div className={styles.featureImageWrapper}>
              <img src={Community} alt="コミュニティ" className={styles.featureImage} />
              <div className={styles.featureOverlay}>
                <div className={styles.featureTag}>👥 Community</div>
              </div>
            </div>
            <div className={styles.featureContent}>
              <h3 className={styles.featureTitle}>コミュニティ</h3>
              <p className={styles.featureDescription}>
                Slackやミツクルのプラットフォームを通じて、開発者同士でアイデアを共有。フィードバックやコラボレーションの機会を得られます。
              </p>
              <ul className={styles.featureList}>
                <li>✓ 開発者同士の交流</li>
                <li>✓ リアルタイムフィードバック</li>
                <li>✓ コラボレーション機会</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaBackground}>
          <div className={styles.ctaShape1}></div>
          <div className={styles.ctaShape2}></div>
        </div>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>さあ、始めましょう</h2>
          <p className={styles.ctaDescription}>
            GitHubアカウントで簡単に登録。<br />
            あなたのプロダクトを共有して、新しい価値を見つけましょう。
          </p>
          <div className={styles.ctaFeatures}>
            <div className={styles.ctaFeatureItem}>
              <span className={styles.ctaFeatureIcon}>⚡</span>
              <span>30秒で登録完了</span>
            </div>
            <div className={styles.ctaFeatureItem}>
              <span className={styles.ctaFeatureIcon}>🎯</span>
              <span>完全無料</span>
            </div>
            <div className={styles.ctaFeatureItem}>
              <span className={styles.ctaFeatureIcon}>🔒</span>
              <span>安全なOAuth認証</span>
            </div>
          </div>
          <a href={GITHUB_AUTH_URL} className={styles.ctaButtonLarge}>
            <svg className={styles.githubIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            無料で始める
          </a>
        </div>
      </section>
    </div>
  );
};

export default Top;
