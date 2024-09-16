class AddColumnsToPosts < ActiveRecord::Migration[7.0]
  def change
    add_column :posts, :description, :text
    add_column :posts, :image_url, :string
    add_column :posts, :published_at, :datetime
  end
end
