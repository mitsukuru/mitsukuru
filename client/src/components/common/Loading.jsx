import React from 'react';
import { Loader2, Code, GitBranch, Star } from 'lucide-react';
import styles from './Loading.module.scss';

const Loading = ({ 
  type = 'default', 
  message = '読み込み中...', 
  size = 'medium',
  overlay = false 
}) => {
  const renderLoadingContent = () => {
    switch (type) {
      case 'github':
        return (
          <div className={`${styles.loadingContainer} ${styles[size]}`}>
            <div className={styles.githubLoader}>
              <div className={styles.iconContainer}>
                <GitBranch className={styles.iconPrimary} />
                <Code className={styles.iconSecondary} />
                <Star className={styles.iconTertiary} />
              </div>
              <div className={styles.pulseRings}>
                <div className={styles.ring}></div>
                <div className={styles.ring}></div>
                <div className={styles.ring}></div>
              </div>
            </div>
            <div className={styles.messageContainer}>
              <h3 className={styles.title}>GitHub情報を取得中</h3>
              <p className={styles.message}>{message}</p>
              <div className={styles.progressDots}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        );

      case 'project':
        return (
          <div className={`${styles.loadingContainer} ${styles[size]}`}>
            <div className={styles.projectLoader}>
              <div className={styles.cardSkeleton}>
                <div className={styles.skeletonHeader}></div>
                <div className={styles.skeletonContent}>
                  <div className={styles.skeletonLine}></div>
                  <div className={styles.skeletonLine}></div>
                  <div className={styles.skeletonLine}></div>
                </div>
                <div className={styles.skeletonFooter}></div>
              </div>
              <div className={styles.floatingElements}>
                <div className={styles.floatingIcon}>💡</div>
                <div className={styles.floatingIcon}>🚀</div>
                <div className={styles.floatingIcon}>⭐</div>
              </div>
            </div>
            <div className={styles.messageContainer}>
              <h3 className={styles.title}>プロダクトを読み込み中</h3>
              <p className={styles.message}>{message}</p>
            </div>
          </div>
        );

      case 'upload':
        return (
          <div className={`${styles.loadingContainer} ${styles[size]}`}>
            <div className={styles.uploadLoader}>
              <div className={styles.uploadCircle}>
                <div className={styles.uploadProgress}></div>
                <div className={styles.uploadIcon}>📤</div>
              </div>
              <div className={styles.uploadBars}>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
              </div>
            </div>
            <div className={styles.messageContainer}>
              <h3 className={styles.title}>アップロード中</h3>
              <p className={styles.message}>{message}</p>
            </div>
          </div>
        );

      case 'minimal':
        return (
          <div className={`${styles.loadingContainer} ${styles[size]} ${styles.minimal}`}>
            <Loader2 className={styles.spinner} />
            <span className={styles.message}>{message}</span>
          </div>
        );

      default:
        return (
          <div className={`${styles.loadingContainer} ${styles[size]}`}>
            <div className={styles.defaultLoader}>
              <div className={styles.orbitContainer}>
                <div className={styles.orbit}>
                  <div className={styles.planet}></div>
                </div>
                <div className={styles.orbit}>
                  <div className={styles.planet}></div>
                </div>
                <div className={styles.orbit}>
                  <div className={styles.planet}></div>
                </div>
                <div className={styles.centerCore}>
                  <div className={styles.core}></div>
                </div>
              </div>
            </div>
            <div className={styles.messageContainer}>
              <h3 className={styles.title}>読み込み中</h3>
              <p className={styles.message}>{message}</p>
              <div className={styles.loadingBar}>
                <div className={styles.loadingProgress}></div>
              </div>
            </div>
          </div>
        );
    }
  };

  const content = renderLoadingContent();

  if (overlay) {
    return (
      <div className={styles.overlay}>
        <div className={styles.overlayContent}>
          {content}
        </div>
      </div>
    );
  }

  return content;
};

// プリセットコンポーネント
export const GitHubLoading = ({ message, size, overlay }) => (
  <Loading type="github" message={message} size={size} overlay={overlay} />
);

export const ProjectLoading = ({ message, size, overlay }) => (
  <Loading type="project" message={message} size={size} overlay={overlay} />
);

export const UploadLoading = ({ message, size, overlay }) => (
  <Loading type="upload" message={message} size={size} overlay={overlay} />
);

export const MinimalLoading = ({ message, size }) => (
  <Loading type="minimal" message={message} size={size} />
);

export default Loading;