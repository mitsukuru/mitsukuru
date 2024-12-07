// client/src/components/features/Notification.jsx
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const Notification = ({ count = 2 }) => {
  const [isClicked, setIsClicked] = useState(false);
  const notifications = [ // モックの通知内容
    "新しいメッセージがあります。",
    "友達があなたをフォローしました。"
  ];

  return (
    <div>
      <div onClick={() => setIsClicked(!isClicked)} style={{ height: '30px'}}>
        <Bell className="iconButton" />
        {count > 0 && (
          <span className="notificationCount" style={{ 
            position: 'relative', 
            top: '-20px', 
            right: '5px', 
            backgroundColor: 'red', 
            borderRadius: '50%', 
            color: 'white', 
            padding: '2px 4px', 
            fontSize: '12px' 
          }}>
            {count}
          </span>
        )}
      </div>
      {isClicked && ( // クリック時に通知内容を表示
        <div className="notificationDropdown" style={{ 
          position: 'absolute', 
          backgroundColor: 'white', 
          border: '1px solid #ccc', 
          borderRadius: '4px', 
          zIndex: 1000,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
        }}>
          {notifications.map((notification, index) => (
            <div key={index} style={{ 
              padding: '10px', 
              transition: 'background-color 0.3s', 
              fontSize: '14px'
            }} 
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'} // ホバー時の背景色
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'} // ホバー解除時の背景色
            >
              {notification}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Notification;