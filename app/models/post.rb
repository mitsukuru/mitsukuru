class Post < ApplicationRecord
  belongs_to :user
  has_many :comments, dependent: :destroy
  has_many :reactions, dependent: :destroy
  mount_uploader :image_url, PostImageUploader
  
  # 追加画像のJSONシリアライズ
  serialize :additional_images, JSON
  
  # 全ての画像を取得するメソッド
  def all_images
    images = []
    images << image_url if image_url.present?
    
    # additional_imagesから画像を追加
    if additional_images.present? && additional_images.is_a?(Array)
      additional_images.each do |img_path|
        # 相対パスを絶対パスに変換
        if img_path.present?
          images << { url: img_path }
        end
      end
    end
    
    images
  end
  
  def comments_count
    comments.count
  end

  # リアクション統計を高速取得
  def reactions_stats
    Reaction.stats_for_post(id)
  end

  # 特定ユーザーのリアクション状態を取得
  def user_reactions(user_id)
    return {} unless user_id
    Reaction.user_reactions_for_post(id, user_id)
  end
end
