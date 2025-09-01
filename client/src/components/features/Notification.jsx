// client/src/components/features/Notification.jsx
import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import styles from './Notification.module.scss';
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/api/notificationApi';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 通知データを取得
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchNotifications(20, 0);
      setNotifications(data.notifications || []);
      setNotificationCount(data.unread_count || 0);
    } catch (error) {
      console.error('通知の取得に失敗:', error);
      setError('通知を取得できませんでした');
    } finally {
      setLoading(false);
    }
  };

  // 通知を既読にする
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      // ローカルの状態を更新
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
      setNotificationCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('通知の既読処理に失敗:', error);
    }
  };

  // 全ての通知を既読にする
  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
      setNotificationCount(0);
    } catch (error) {
      console.error('全既読処理に失敗:', error);
    }
  };

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
        {loading ? (
          <div className={styles.loading}>読み込み中...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : notifications.length > 0 ? (
          <>
            <div className={styles.notificationHeader}>
              <span className={styles.notificationTitle}>通知</span>
              {notificationCount > 0 && (
                <button 
                  onClick={handleMarkAllAsRead}
                  className={styles.markAllButton}
                >
                  全て既読
                </button>
              )}
            </div>
            <div className={styles.notificationList}>
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`${styles.notificationItem} ${notification.read ? styles.read : styles.unread}`}
                  onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                >
                  <div className={styles.notificationIcon}>
                    {notification.icon}
                  </div>
                  <div className={styles.notificationContent}>
                    <div className={styles.notificationMessage}>
                      {notification.message}
                    </div>
                    <div className={styles.notificationTime}>
                      {notification.time_ago}
                    </div>
                  </div>
                  {!notification.read && (
                    <div className={styles.unreadIndicator}></div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <Bell size={48} />
            <p>通知はありません</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Notification;