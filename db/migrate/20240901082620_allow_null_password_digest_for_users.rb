class AllowNullPasswordDigestForUsers < ActiveRecord::Migration[7.0]
  def up
    change_column_null :users, :password_digest, true
  end

  def down
    change_column_null :users, :password_digest, false
  end
end
