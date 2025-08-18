import React from 'react';
import { MessageCircle } from 'lucide-react';
import styles from './Comments.module.scss';

const Comments = ({ postId, commentsCount, onCommentClick }) => {
  return (
    <button 
      className={styles.commentsToggle}
      onClick={() => onCommentClick(postId)}
    >
      <MessageCircle size={18} />
      <span>{commentsCount || 0} コメント</span>
    </button>
  );
};

export default Comments;