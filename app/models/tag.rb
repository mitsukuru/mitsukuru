class Tag < ApplicationRecord
  has_many :post_tags, dependent: :destroy
  has_many :posts, through: :post_tags
  
  validates :name, presence: true, uniqueness: { case_sensitive: false }, length: { maximum: 50 }
  validates :color, format: { with: /\A#[0-9A-Fa-f]{6}\z/, message: "must be a valid hex color" }
  validates :description, length: { maximum: 500 }
  
  before_save :normalize_name
  after_create :update_posts_count
  after_destroy :update_posts_count_after_destroy
  
  scope :popular, -> { order(posts_count: :desc) }
  scope :by_name, -> { order(:name) }
  
  def increment_posts_count!
    increment!(:posts_count)
  end
  
  def decrement_posts_count!
    decrement!(:posts_count)
  end
  
  private
  
  def normalize_name
    self.name = name.strip.downcase if name.present?
  end
  
  def update_posts_count
    update_column(:posts_count, posts.count)
  end
  
  def update_posts_count_after_destroy
    # このメソッドは destroy 後に呼ばれるため、すでにレコードは削除されている
    # 特別な処理は不要
  end
end