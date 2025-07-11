class Post < ApplicationRecord
  belongs_to :user
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
end
