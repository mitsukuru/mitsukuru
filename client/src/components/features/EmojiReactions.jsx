import React, { useState, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import styles from './EmojiReactions.module.scss';

const EmojiReactions = ({ postId, reactions = {}, onReactionChange }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [userReactions, setUserReactions] = useState({});
  const pickerRef = useRef(null);
  const { user, isAuthenticated } = useAuth();

  // 利用可能な絵文字の定義
  const availableEmojis = [
    { emoji: '👍', name: 'thumbsup', label: 'いいね' },
    { emoji: '❤️', name: 'heart', label: 'ハート' },
    { emoji: '😄', name: 'smile', label: '笑顔' },
    { emoji: '😮', name: 'surprised', label: '驚き' },
    { emoji: '😢', name: 'sad', label: '悲しい' },
    { emoji: '😡', name: 'angry', label: '怒り' },
    { emoji: '🎉', name: 'celebrate', label: 'お祝い' },
    { emoji: '🚀', name: 'rocket', label: 'ロケット' },
    { emoji: '👀', name: 'eyes', label: '目' },
    { emoji: '🔥', name: 'fire', label: 'ファイア' },
    { emoji: '💯', name: 'hundred', label: '100点' },
    { emoji: '⚡', name: 'zap', label: '雷' },
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

  // ユーザーのリアクション状態を初期化
  useEffect(() => {
    if (user && reactions) {
      const userReactionState = {};
      Object.entries(reactions).forEach(([emojiName, reactionData]) => {
        if (reactionData.users && reactionData.users.includes(user.id)) {
          userReactionState[emojiName] = true;
        }
      });
      setUserReactions(userReactionState);
    }
  }, [reactions, user]);

  // リアクションをトグルする
  const toggleReaction = async (emojiName) => {
    if (!isAuthenticated) {
      alert('リアクションするにはログインが必要です');
      return;
    }

    const isCurrentlyReacted = userReactions[emojiName];
    const newUserReactions = {
      ...userReactions,
      [emojiName]: !isCurrentlyReacted
    };
    setUserReactions(newUserReactions);

    // 楽観的UI更新
    const newReactions = { ...reactions };
    
    if (!isCurrentlyReacted) {
      // リアクションを追加
      if (!newReactions[emojiName]) {
        newReactions[emojiName] = { count: 0, users: [] };
      }
      newReactions[emojiName].count += 1;
      newReactions[emojiName].users = [...(newReactions[emojiName].users || []), user.id];
    } else {
      // リアクションを削除
      if (newReactions[emojiName]) {
        newReactions[emojiName].count = Math.max(0, newReactions[emojiName].count - 1);
        newReactions[emojiName].users = (newReactions[emojiName].users || []).filter(id => id !== user.id);
        
        // カウントが0になったら削除
        if (newReactions[emojiName].count === 0) {
          delete newReactions[emojiName];
        }
      }
    }

    if (onReactionChange) {
      onReactionChange(postId, newReactions);
    }

    setShowEmojiPicker(false);

    // TODO: 実際のAPI呼び出しをここに実装
    // try {
    //   await updateReaction(postId, emojiName, !isCurrentlyReacted);
    // } catch (error) {
    //   // エラー時は元に戻す
    //   setUserReactions(userReactions);
    //   if (onReactionChange) {
    //     onReactionChange(postId, reactions);
    //   }
    //   console.error('リアクションの更新に失敗:', error);
    // }
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
            className={`${styles.reactionButton} ${isUserReacted ? styles.reacted : ''}`}
            onClick={() => toggleReaction(emojiName)}
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
                  onClick={() => toggleReaction(name)}
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