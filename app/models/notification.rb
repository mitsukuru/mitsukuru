class Notification < ApplicationRecord
  belongs_to :user
  belongs_to :target, polymorphic: true, optional: true
  
  validates :message, presence: true
  validates :notification_type, presence: true
  
  # 通知タイプの定数
  TYPES = {
    comment: 'comment',
    reaction: 'reaction',
    follow: 'follow',
    post_published: 'post_published',
    achievement: 'achievement',
    system: 'system'
  }.freeze
  
  validates :notification_type, inclusion: { in: TYPES.values }
  
  # スコープ
  scope :unread, -> { where(read: false) }
  scope :read, -> { where(read: true) }
  scope :recent, -> { order(created_at: :desc) }
  scope :by_type, ->(type) { where(notification_type: type) }
  
  # メソッド
  def mark_as_read!
    update!(read: true)
  end
  
  def mark_as_unread!
    update!(read: false)
  end
  
  def read?
    read
  end
  
  def unread?
    !read
  end
  
  # 通知タイプに応じたアイコンを返す
  def icon
    case notification_type
    when TYPES[:comment]
      '💬'
    when TYPES[:reaction]
      '❤️'
    when TYPES[:follow]
      '👥'
    when TYPES[:post_published]
      '📝'
    when TYPES[:achievement]
      '🏆'
    when TYPES[:system]
      '🔔'
    else
      '📢'
    end
  end
end
