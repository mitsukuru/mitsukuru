class Comment < ApplicationRecord
  belongs_to :post
  belongs_to :user

  validates :content, presence: true, length: { maximum: 1000 }
  
  scope :ordered, -> { order(created_at: :asc) }
  
  # コールバック
  after_create :create_comment_notification
  
  private
  
  def create_comment_notification
    NotificationService.create_comment_notification(self)
  end
end