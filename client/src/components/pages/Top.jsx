import React, { useEffect } from "react";
import Community from "/src/assets/community_img.png";
import Analysis from "/src/assets/analysis.png";
import styles from "./Top.module.scss";

const GITHUB_AUTH_URL = `https://github.com/login/oauth/authorize?client_id=Ov23lipUtZEQclrolCBR&redirect_url=http://localhost:3000/api/v1/callback/github/&scope=user:email`;

const GitHubIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const MARQUEE_ITEMS = [
  "AI分析", "コード評価", "改善提案", "GitHub連携",
  "プロダクト共有", "コミュニティ", "フィードバック", "個人開発",
];

const MockupWindow = ({ src, alt }) => (
  <div className={styles.mockupWindow}>
    <div className={styles.mockupBar}>
      <span /><span /><span />
    </div>
    <img src={src} alt={alt} className={styles.mockupImg} />
  </div>
);

const Top = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" }
    );
    document.querySelectorAll(`.${styles.reveal}`).forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.top}>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroLeft}>
            <p className={styles.eyebrow}>個人開発プラットフォーム</p>
            <h1 className={styles.heroTitle}>
              <span className={styles.titleLine}>作ったものを、</span>
              <span className={styles.titleLineAccent}>見つけてもらう。</span>
            </h1>
            <p className={styles.heroBody}>
              GitHubと連携してプロダクトを公開。<br />
              AIが分析し、開発者仲間がフィードバックする。
            </p>
            <div className={styles.heroActions}>
              <a href={GITHUB_AUTH_URL} className={styles.primaryBtn}>
                <GitHubIcon className={styles.btnIcon} />
                GitHubで始める — 無料
              </a>
              <a href="#features" className={styles.ghostBtn}>
                機能を見る
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.arrowIcon}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.heroMockupWrap}>
              <MockupWindow src={Analysis} alt="AI分析のプレビュー" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee ──────────────────────────────────────── */}
      <div className={styles.marqueeSection}>
        <div className={styles.marqueeTrack}>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <React.Fragment key={i}>
              <span className={styles.marqueeItem}>{item}</span>
              <span className={styles.marqueeDot} aria-hidden="true">✦</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── Problems ─────────────────────────────────────── */}
      <section className={styles.problems}>
        <div className={styles.inner}>
          <div className={`${styles.reveal} ${styles.problemHeader}`}>
            <p className={styles.sectionLabel}>— 課題</p>
            <h2 className={styles.sectionTitle}>
              心当たり、<br className={styles.spBr} />ありますか。
            </h2>
          </div>
          <div className={styles.problemGrid}>
            {[
              {
                num: "01",
                title: "GitHubに眠るプロダクト",
                body: "せっかく作ったのに誰にも見られず、リポジトリが積み上がるだけ。",
              },
              {
                num: "02",
                title: "何を改善すればいいか分からない",
                body: "自分一人では気づけない盲点がある。客観的な視点が欲しい。",
              },
              {
                num: "03",
                title: "一人での開発に限界を感じる",
                body: "同じ志の開発者と繋がり、刺激し合える場がない。",
              },
            ].map((item, i) => (
              <div
                key={item.num}
                className={`${styles.reveal} ${styles.problemCard}`}
                style={{ transitionDelay: `${i * 0.12}s` }}
              >
                <span className={styles.problemNum}>{item.num}</span>
                <h3 className={styles.problemCardTitle}>{item.title}</h3>
                <p className={styles.problemCardBody}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section className={styles.features} id="features">
        <div className={styles.inner}>
          <div className={`${styles.reveal} ${styles.featuresHeader}`}>
            <p className={styles.sectionLabel}>— 機能</p>
            <h2 className={styles.sectionTitle}>ミツクルでできること</h2>
          </div>
        </div>

        <div className={styles.featureBlock}>
          <div className={styles.featureBlockInner}>
            <div className={`${styles.reveal} ${styles.featureText}`}>
              <span className={styles.featureNum}>01</span>
              <h3 className={styles.featureTitle}>AI分析</h3>
              <p className={styles.featureDesc}>
                登録したプロダクトをAIが即座に分析。技術スタックの評価、
                改善提案、強みの発見まで——自分では気づけなかった視点を
                具体的に提示します。
              </p>
              <ul className={styles.featurePoints}>
                <li>コード品質の自動評価</li>
                <li>技術スタックの分析</li>
                <li>具体的な改善提案</li>
              </ul>
            </div>
            <div className={`${styles.reveal} ${styles.featureMedia}`} style={{ transitionDelay: "0.15s" }}>
              <MockupWindow src={Analysis} alt="AI分析の画面" />
            </div>
          </div>
        </div>

        <div className={`${styles.featureBlock} ${styles.featureBlockAlt}`}>
          <div className={styles.featureBlockInner}>
            <div className={`${styles.reveal} ${styles.featureText}`} style={{ transitionDelay: "0.15s" }}>
              <span className={styles.featureNum}>02</span>
              <h3 className={styles.featureTitle}>コミュニティ</h3>
              <p className={styles.featureDesc}>
                開発者同士でプロダクトを見せ合い、フィードバックしあえる場所。
                リアルな声が次の開発を動かす。
              </p>
              <ul className={styles.featurePoints}>
                <li>開発者同士のフィードバック</li>
                <li>絵文字リアクションで気軽に交流</li>
                <li>タグで同じ技術の仲間を探せる</li>
              </ul>
            </div>
            <div className={`${styles.reveal} ${styles.featureMedia}`}>
              <MockupWindow src={Community} alt="コミュニティの画面" />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <p className={`${styles.reveal} ${styles.ctaEyebrow}`}>さあ、始めよう</p>
          <h2 className={`${styles.reveal} ${styles.ctaTitle}`} style={{ transitionDelay: "0.1s" }}>
            まず、公開してみよう。
          </h2>
          <p className={`${styles.reveal} ${styles.ctaBody}`} style={{ transitionDelay: "0.2s" }}>
            GitHubアカウントで30秒で登録。無料。
          </p>
          <div className={`${styles.reveal}`} style={{ transitionDelay: "0.3s" }}>
            <a href={GITHUB_AUTH_URL} className={styles.ctaBtn}>
              <GitHubIcon className={styles.btnIcon} />
              GitHubで始める
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Top;
