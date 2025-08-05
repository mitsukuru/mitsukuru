class AddRepositoryFieldsToPosts < ActiveRecord::Migration[7.0]
  def change
    add_column :posts, :repository_name, :string
    add_column :posts, :repository_url, :string
    add_column :posts, :repository_description, :text
  end
end
