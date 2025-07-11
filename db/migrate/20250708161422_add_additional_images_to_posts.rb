class AddAdditionalImagesToPosts < ActiveRecord::Migration[7.0]
  def change
    add_column :posts, :additional_images, :text
  end
end
