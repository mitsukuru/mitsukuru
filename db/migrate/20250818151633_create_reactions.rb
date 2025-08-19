class CreateReactions < ActiveRecord::Migration[7.0]
  def change
    create_table :reactions do |t|
      t.references :post, null: false, foreign_key: true, index: false
      t.references :user, null: false, foreign_key: true, index: false
      t.string :emoji_name, null: false, limit: 50

      t.timestamps
    end
    
    # 複合ユニークインデックス（高速検索とユニーク制約）
    add_index :reactions, [:post_id, :user_id, :emoji_name], unique: true, name: 'index_reactions_unique'
    
    # 投稿ごとのリアクション集計用インデックス
    add_index :reactions, [:post_id, :emoji_name], name: 'index_reactions_post_emoji'
    
    # ユーザーのリアクション履歴用インデックス
    add_index :reactions, [:user_id, :created_at], name: 'index_reactions_user_timeline'
  end
end
