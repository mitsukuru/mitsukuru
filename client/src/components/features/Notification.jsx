// client/src/components/features/Notification.jsx
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import styles from './Notification.module.scss';

const Notification = () => {
  const [isClicked, setIsClicked] = useState(false);
  const notifications = [
    "新しいメッセージがあります。",
    "友達があなたをフォローしました。",
    "友達があなたをフォローしました。",
    "友達があなたをフォローしました。",
    "友達があなたをフォローしました。",
  ];
  const [notificationCount] = useState(notifications.length);

  return (
    <div className={styles.notificationContainer}>
      <div className={styles.notificationButton}>
        <Bell size={20} />
        {notificationCount > 0 && (
          <span className={styles.notificationBadge}>
            {notificationCount}
          </span>
        )}
      </div>
      <div className={styles.notificationDropdown}>
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <div key={index} className={styles.notificationItem}>
              {notification}
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            通知はありません
          </div>
        )}
      </div>
    </div>
  )
}

export default Notification;