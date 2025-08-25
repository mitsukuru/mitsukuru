class PostTag < ApplicationRecord
  belongs_to :post
  belongs_to :tag
  
  validates :post_id, uniqueness: { scope: :tag_id, message: "このタグは既にこの投稿に付けられています" }
  
  after_create :increment_tag_posts_count
  after_destroy :decrement_tag_posts_count
  
  private
  
  def increment_tag_posts_count
    tag.increment_posts_count!
  end
  
  def decrement_tag_posts_count
    tag.decrement_posts_count!
  end
end