import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Send, Trash2, User } from 'lucide-react';
import { fetchComments, createComment, deleteComment } from '@/api/commentApi';
import useAuth from '@/hooks/useAuth';
import styles from './CommentModal.module.scss';

const CommentModal = ({ isOpen, onClose, postId, postTitle, commentsCount, onCommentCountChange }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isOpen && postId) {
      loadComments();
    }
  }, [isOpen, postId]);

  // モーダルが開いているときにESCキーで閉じる
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; // スクロールを無効化
    } else {
      document.body.style.overflow = 'unset'; // スクロールを有効化
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await fetchComments(postId);
      setComments(data.comments || []);
    } catch (error) {
      console.error('コメントの取得に失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('コメントを投稿するにはログインが必要です');
      return;
    }

    if (!newComment.trim()) {
      return;
    }

    try {
      setSubmitting(true);
      const data = await createComment(postId, { content: newComment.trim() });
      
      setComments(prev => [...prev, data.comment]);
      setNewComment('');
      
      // コメント数を更新
      if (onCommentCountChange) {
        onCommentCountChange(commentsCount + 1);
      }
    } catch (error) {
      console.error('コメントの投稿に失敗:', error);
      alert('コメントの投稿に失敗しました');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('このコメントを削除しますか？')) {
      return;
    }

    try {
      await deleteComment(postId, commentId);
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      
      // コメント数を更新
      if (onCommentCountChange) {
        onCommentCountChange(commentsCount - 1);
      }
    } catch (error) {
      console.error('コメントの削除に失敗:', error);
      alert('コメントの削除に失敗しました');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}分前`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}時間前`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}日前`;
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* ヘッダー */}
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <MessageCircle size={20} />
            <h2>コメント</h2>
            <span className={styles.postTitle}>- {postTitle}</span>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* コメント一覧 */}
        <div className={styles.content}>
          {loading ? (
            <div className={styles.loading}>コメントを読み込み中...</div>
          ) : (
            <div className={styles.commentsList}>
              {comments.length === 0 ? (
                <div className={styles.noComments}>
                  <MessageCircle size={48} color="#cbd5e1" />
                  <p>まだコメントがありません</p>
                  <p className={styles.noCommentsSubtext}>最初のコメントを投稿してみましょう！</p>
                </div>
              ) : (
                comments.map(comment => (
                  <div key={comment.id} className={styles.comment}>
                    <div className={styles.commentHeader}>
                      <div className={styles.userInfo}>
                        {comment.user.remote_avatar_url ? (
                          <img 
                            src={comment.user.remote_avatar_url} 
                            alt={comment.user.name} 
                            className={styles.avatar}
                          />
                        ) : (
                          <User className={styles.defaultAvatar} />
                        )}
                        <div className={styles.userDetails}>
                          <span className={styles.userName}>{comment.user.name}</span>
                          <span className={styles.commentTime}>
                            {formatDate(comment.created_at)}
                          </span>
                        </div>
                      </div>
                      
                      {user && user.id === comment.user.id && (
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    
                    <div className={styles.commentContent}>
                      {comment.content}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* コメント投稿フォーム */}
        <div className={styles.footer}>
          {isAuthenticated ? (
            <form className={styles.commentForm} onSubmit={handleSubmitComment}>
              <div className={styles.inputContainer}>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="コメントを入力してください..."
                  className={styles.commentInput}
                  rows="3"
                  maxLength="1000"
                />
                <div className={styles.formActions}>
                  <span className={styles.charCount}>
                    {newComment.length}/1000
                  </span>
                  <button
                    type="submit"
                    disabled={!newComment.trim() || submitting}
                    className={styles.submitButton}
                  >
                    <Send size={16} />
                    {submitting ? '投稿中...' : 'コメント'}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className={styles.loginPrompt}>
              <p>コメントを投稿するにはログインしてください</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentModal;