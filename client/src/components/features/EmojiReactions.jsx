import React, { useState, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { toggleReaction, clearReactionCache } from '@/api/reactionApi';
import styles from './EmojiReactions.module.scss';

const EmojiReactions = ({ postId, reactions = {}, userReactions: initialUserReactions = {}, onReactionChange }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [userReactions, setUserReactions] = useState(initialUserReactions);
  const [loading, setLoading] = useState(false);
  const pickerRef = useRef(null);
  const { user, isAuthenticated } = useAuth();

  // 利用可能な絵文字の定義
  const availableEmojis = [
    // 基本リアクション
    { emoji: '👍', name: 'thumbsup', label: 'いいね' },
    { emoji: '❤️', name: 'heart', label: 'ハート' },
    { emoji: '🔥', name: 'fire', label: 'これは熱い！' },
    { emoji: '💯', name: 'hundred', label: '完璧！100点' },
    { emoji: '🚀', name: 'rocket', label: 'すげぇ！' },
    { emoji: '⚡', name: 'zap', label: 'パフォーマンス！' },
    
    // エンジニア専用
    { emoji: '🐛', name: 'bug', label: 'バグ発見' },
    { emoji: '✨', name: 'sparkles', label: 'きれいなコード' },
    { emoji: '🔧', name: 'wrench', label: '要リファクタ' },
    { emoji: '💡', name: 'bulb', label: 'ナイスアイデア' },
    { emoji: '🧠', name: 'brain', label: '天才的' },
    { emoji: '⚙️', name: 'gear', label: 'システム的' },
    
    // 開発フェーズ
    { emoji: '🚧', name: 'construction', label: '開発中' },
    { emoji: '🔨', name: 'hammer', label: 'ビルド中' },
    { emoji: '🧪', name: 'test_tube', label: 'テスト必要' },
    { emoji: '📋', name: 'clipboard', label: 'レビュー希望' },
    { emoji: '🎯', name: 'target', label: '要件満たしてる' },
    { emoji: '🏆', name: 'trophy', label: 'マージ準備OK' },
    
    // 技術的感情
    { emoji: '🤯', name: 'exploding_head', label: 'Mind Blown!' },
    { emoji: '😱', name: 'scream', label: 'ヤバイ' },
    { emoji: '🤔', name: 'thinking', label: 'う〜ん...' },
    { emoji: '😵', name: 'dizzy', label: 'バグで頭痛' },
    { emoji: '🥳', name: 'party', label: 'デプロイ成功！' },
    { emoji: '😎', name: 'sunglasses', label: 'プロの仕事' },
    
    // ギーク文化
    { emoji: '🦄', name: 'unicorn', label: 'ユニコーン企業' },
    { emoji: '🐉', name: 'dragon', label: 'レガシーコード' },
    { emoji: '👑', name: 'crown', label: 'アーキテクト' },
    { emoji: '🎪', name: 'circus', label: 'カオス' },
    { emoji: '🌟', name: 'star', label: 'スター級' },
    { emoji: '💎', name: 'diamond', label: 'プレミアム' },
    
    // パフォーマンス系
    { emoji: '⚡', name: 'lightning', label: '爆速' },
    { emoji: '🏃‍♂️', name: 'running', label: '高速化' },
    { emoji: '🐌', name: 'snail', label: '重い...' },
    { emoji: '💀', name: 'skull', label: 'デッドコード' },
    { emoji: '🔋', name: 'battery', label: 'エネルギー効率' },
    { emoji: '📈', name: 'chart', label: 'スケールする' },
    
    // セキュリティ・品質
    { emoji: '🔒', name: 'lock', label: 'セキュア' },
    { emoji: '🛡️', name: 'shield', label: '堅牢' },
    { emoji: '🔍', name: 'magnify', label: 'コードレビュー' },
    { emoji: '✅', name: 'check', label: 'テスト通過' },
    { emoji: '❌', name: 'x', label: 'テスト失敗' },
    { emoji: '⚠️', name: 'warning', label: '注意が必要' },
    
    // チーム・コラボ
    { emoji: '🤝', name: 'handshake', label: 'ペアプロ' },
    { emoji: '🎭', name: 'masks', label: 'フロント/バック' },
    { emoji: '🔗', name: 'link', label: '統合' },
    { emoji: '📚', name: 'books', label: 'ドキュメント化' },
    { emoji: '🎓', name: 'graduation', label: '学習' },
    { emoji: '☕', name: 'coffee', label: 'コーヒーブレイク' }
  ];

  // クリック外でピッカーを閉じる
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  // ユーザーのリアクション状態を更新
  useEffect(() => {
    setUserReactions(initialUserReactions);
  }, [initialUserReactions]);

  // リアクションをトグルする
  const handleToggleReaction = async (emojiName) => {
    if (!isAuthenticated) {
      alert('リアクションするにはログインが必要です');
      return;
    }

    if (loading) return; // 連続クリック防止

    const isCurrentlyReacted = userReactions[emojiName];
    
    // 楽観的UI更新
    const optimisticUserReactions = {
      ...userReactions,
      [emojiName]: !isCurrentlyReacted
    };
    setUserReactions(optimisticUserReactions);

    const optimisticReactions = { ...reactions };
    
    if (!isCurrentlyReacted) {
      // リアクションを追加
      if (!optimisticReactions[emojiName]) {
        optimisticReactions[emojiName] = { count: 0, users: [] };
      }
      optimisticReactions[emojiName].count += 1;
      optimisticReactions[emojiName].users = [...(optimisticReactions[emojiName].users || []), user.id];
    } else {
      // リアクションを削除
      if (optimisticReactions[emojiName]) {
        optimisticReactions[emojiName].count = Math.max(0, optimisticReactions[emojiName].count - 1);
        optimisticReactions[emojiName].users = (optimisticReactions[emojiName].users || []).filter(id => id !== user.id);
        
        // カウントが0になったら削除
        if (optimisticReactions[emojiName].count === 0) {
          delete optimisticReactions[emojiName];
        }
      }
    }

    // 楽観的更新をUI に反映
    if (onReactionChange) {
      onReactionChange(postId, optimisticReactions, optimisticUserReactions);
    }

    setShowEmojiPicker(false);

    try {
      setLoading(true);
      const result = await toggleReaction(postId, emojiName);
      
      // サーバーからの正確なデータでUIを更新
      if (onReactionChange) {
        onReactionChange(postId, result.reactions, result.user_reactions);
      }
      setUserReactions(result.user_reactions);
      
      // キャッシュをクリア
      clearReactionCache(postId);
      
    } catch (error) {
      console.error('リアクションの更新に失敗:', error);
      
      // エラー時は元に戻す
      setUserReactions(userReactions);
      if (onReactionChange) {
        onReactionChange(postId, reactions, userReactions);
      }
      
      alert('リアクションの更新に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  // 絵文字ピッカーを開く
  const openEmojiPicker = () => {
    if (!isAuthenticated) {
      alert('リアクションするにはログインが必要です');
      return;
    }
    setShowEmojiPicker(true);
  };

  // アクティブなリアクションを取得
  const activeReactions = Object.entries(reactions).filter(([_, data]) => data.count > 0);

  return (
    <div className={styles.reactionsContainer}>
      {/* 既存のリアクション表示 */}
      {activeReactions.map(([emojiName, reactionData]) => {
        const emoji = availableEmojis.find(e => e.name === emojiName);
        const isUserReacted = userReactions[emojiName];
        
        return (
          <button
            key={emojiName}
            className={`${styles.reactionButton} ${isUserReacted ? styles.reacted : ''} ${loading ? styles.loading : ''}`}
            onClick={() => handleToggleReaction(emojiName)}
            disabled={loading}
            title={`${emoji?.label || emojiName} (${reactionData.count})`}
          >
            <span className={styles.emoji}>
              {emoji?.emoji || '❓'}
            </span>
            <span className={styles.count}>
              {reactionData.count}
            </span>
          </button>
        );
      })}

      {/* リアクション追加ボタン */}
      <div className={styles.addReactionContainer} ref={pickerRef}>
        <button
          className={styles.addReactionButton}
          onClick={openEmojiPicker}
          title="リアクションを追加"
        >
          <Plus size={14} />
        </button>

        {/* 絵文字ピッカー */}
        {showEmojiPicker && (
          <div className={styles.emojiPicker}>
            <div className={styles.emojiPickerHeader}>
              <span>リアクションを選択</span>
            </div>
            <div className={styles.emojiGrid}>
              {availableEmojis.map(({ emoji, name, label }) => (
                <button
                  key={name}
                  className={`${styles.emojiOption} ${userReactions[name] ? styles.alreadyReacted : ''}`}
                  onClick={() => handleToggleReaction(name)}
                  disabled={loading}
                  title={label}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmojiReactions;