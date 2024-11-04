class Post < ApplicationRecord
  belongs_to :user
  mount_uploader :image_url, PostImageUploader
end
