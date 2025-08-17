class AddAccessTokenToAuthentications < ActiveRecord::Migration[7.0]
  def change
    add_column :authentications, :access_token, :text
    add_column :authentications, :access_token_secret, :text
  end
end
