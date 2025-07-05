class RemoveDeviseFromUsers < ActiveRecord::Migration[7.0]
  def up
    # Remove Devise-related columns from users table
    remove_column :users, :encrypted_password, :string if column_exists?(:users, :encrypted_password)
    remove_column :users, :reset_password_token, :string if column_exists?(:users, :reset_password_token)
    remove_column :users, :reset_password_sent_at, :datetime if column_exists?(:users, :reset_password_sent_at)
    remove_column :users, :remember_created_at, :datetime if column_exists?(:users, :remember_created_at)
    
    # Remove indexes
    remove_index :users, :reset_password_token if index_exists?(:users, :reset_password_token)
    
    # Keep email unique index as it's still needed for OAuth
    # remove_index :users, :email - Keep this for OAuth email uniqueness
  end
  
  def down
    # Add back Devise columns if needed to rollback
    add_column :users, :encrypted_password, :string, null: false, default: ""
    add_column :users, :reset_password_token, :string
    add_column :users, :reset_password_sent_at, :datetime
    add_column :users, :remember_created_at, :datetime
    
    add_index :users, :reset_password_token, unique: true
  end
end
