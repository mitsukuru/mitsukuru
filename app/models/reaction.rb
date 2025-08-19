class Reaction < ApplicationRecord
  belongs_to :post
  belongs_to :user

  validates :emoji_name, presence: true, length: { maximum: 50 }
  validates :post_id, uniqueness: { scope: [:user_id, :emoji_name] }

  # 有効な絵文字名のリスト（バリデーション用）
  VALID_EMOJI_NAMES = %w[
    thumbsup heart fire hundred rocket zap bug sparkles wrench bulb brain gear
    construction hammer test_tube clipboard target trophy exploding_head scream
    thinking dizzy party sunglasses unicorn dragon crown circus star diamond
    lightning running snail skull battery chart lock shield magnify check x
    warning handshake masks link books graduation coffee
  ].freeze

  validates :emoji_name, inclusion: { in: VALID_EMOJI_NAMES }

  # スコープ（パフォーマンス最適化）
  scope :by_post, ->(post_id) { where(post_id: post_id) }
  scope :by_user, ->(user_id) { where(user_id: user_id) }
  scope :by_emoji, ->(emoji_name) { where(emoji_name: emoji_name) }
  scope :recent, -> { order(created_at: :desc) }

  # 投稿のリアクション統計を高速取得
  def self.stats_for_post(post_id)
    Rails.cache.fetch("reactions_stats_#{post_id}", expires_in: 5.minutes) do
      by_post(post_id)
        .group(:emoji_name)
        .group('users.id')
        .joins(:user)
        .pluck(:emoji_name, :user_id)
        .group_by(&:first)
        .transform_values { |reactions| reactions.map(&:second) }
        .transform_values { |user_ids| { count: user_ids.count, users: user_ids } }
    end
  end

  # リアクション切り替え（高速化されたupsert）
  def self.toggle_reaction(post_id, user_id, emoji_name)
    return false unless VALID_EMOJI_NAMES.include?(emoji_name)

    # トランザクションで原子性を保証
    transaction do
      existing = find_by(post_id: post_id, user_id: user_id, emoji_name: emoji_name)
      
      if existing
        # リアクション削除
        existing.destroy!
        Rails.cache.delete("reactions_stats_#{post_id}")
        { action: :removed, reaction: existing }
      else
        # リアクション追加
        reaction = create!(
          post_id: post_id,
          user_id: user_id,
          emoji_name: emoji_name
        )
        Rails.cache.delete("reactions_stats_#{post_id}")
        { action: :added, reaction: reaction }
      end
    end
  rescue ActiveRecord::RecordInvalid => e
    { error: e.message }
  end

  # ユーザーの特定投稿へのリアクション状態を高速取得
  def self.user_reactions_for_post(post_id, user_id)
    Rails.cache.fetch("user_reactions_#{post_id}_#{user_id}", expires_in: 10.minutes) do
      by_post(post_id).by_user(user_id).pluck(:emoji_name).index_with { true }
    end
  end

  # バッチでリアクション統計を取得（N+1問題解決）
  def self.stats_for_posts(post_ids)
    return {} if post_ids.empty?

    # 一度のクエリで全投稿のリアクションを取得
    reactions_data = where(post_id: post_ids)
                    .joins(:user)
                    .pluck(:post_id, :emoji_name, :user_id)
    
    # 投稿IDごとにグループ化
    reactions_data.group_by(&:first).transform_values do |post_reactions|
      post_reactions.group_by { |_, emoji, _| emoji }.transform_values do |emoji_reactions|
        user_ids = emoji_reactions.map(&:third)
        { count: user_ids.count, users: user_ids }
      end
    end
  end

  private

  # キャッシュ無効化
  after_create :invalidate_cache
  after_destroy :invalidate_cache

  def invalidate_cache
    Rails.cache.delete("reactions_stats_#{post_id}")
    Rails.cache.delete("user_reactions_#{post_id}_#{user_id}")
  end
end