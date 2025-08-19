class Api::V1::ReactionsController < ApplicationController
  before_action :set_post
  before_action :authenticate_user_for_reactions, only: [:toggle]
  
  # GET /api/v1/posts/:post_id/reactions
  def index
    reactions_data = @post.reactions_stats
    
    render json: {
      status: 200,
      reactions: reactions_data
    }
  end

  # POST /api/v1/posts/:post_id/reactions/toggle
  def toggle
    emoji_name = params[:emoji_name]
    
    unless emoji_name.present?
      render json: {
        status: 400,
        error: 'emoji_name is required'
      }, status: :bad_request
      return
    end

    result = Reaction.toggle_reaction(@post.id, @authenticated_user.id, emoji_name)
    
    if result[:error]
      render json: {
        status: 422,
        error: result[:error]
      }, status: :unprocessable_entity
    else
      # 更新後のリアクション統計を取得
      updated_reactions = @post.reactions_stats
      
      render json: {
        status: 200,
        action: result[:action],
        reactions: updated_reactions,
        user_reactions: @post.user_reactions(@authenticated_user.id)
      }
    end
  end

  # GET /api/v1/posts/reactions/batch
  # 複数投稿のリアクションを一括取得（N+1問題対策）
  def batch
    post_ids = params[:post_ids]&.map(&:to_i) || []
    
    if post_ids.empty?
      render json: {
        status: 400,
        error: 'post_ids parameter is required'
      }, status: :bad_request
      return
    end

    # 最大100投稿まで制限（パフォーマンス保護）
    post_ids = post_ids.first(100)
    
    reactions_data = Reaction.stats_for_posts(post_ids)
    
    # ユーザーがログインしている場合、そのユーザーのリアクション状態も含める
    user_reactions = {}
    if current_user
      post_ids.each do |post_id|
        user_reactions[post_id] = Reaction.user_reactions_for_post(post_id, current_user.id)
      end
    end
    
    render json: {
      status: 200,
      reactions: reactions_data,
      user_reactions: user_reactions
    }
  end

  private

  def set_post
    @post = Post.find(params[:post_id])
  rescue ActiveRecord::RecordNotFound
    render json: {
      status: 404,
      error: 'Post not found'
    }, status: :not_found
  end

  def authenticate_user_for_reactions
    # セッションベースの認証チェック（フォールバック）
    if current_user
      @authenticated_user = current_user
    else
      # LocalStorageからユーザー情報を取得（セッションがない場合）
      user_data = params[:user_data]
      if user_data.blank?
        render json: { 
          status: 401, 
          error: 'authentication_required',
          message: 'ログインが必要です' 
        }, status: :unauthorized
        return
      end

      # ユーザーIDを取得して検証
      user_id = user_data[:id] || user_data['id']
      user = User.find_by(id: user_id)
      
      unless user
        render json: { 
          status: 401, 
          error: 'user_not_found',
          message: 'ユーザーが見つかりません' 
        }, status: :unauthorized
        return
      end

      @authenticated_user = user
    end
  end
end