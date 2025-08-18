class Api::V1::CommentsController < ApplicationController
  before_action :set_post
  before_action :authenticate_user_for_comments, only: [:create, :destroy]
  before_action :set_comment, only: [:destroy]

  def index
    comments = @post.comments.includes(:user).ordered
    
    comments_data = comments.map do |comment|
      {
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at,
        user: {
          id: comment.user.id,
          name: comment.user.name,
          remote_avatar_url: comment.user.remote_avatar_url
        }
      }
    end
    
    render json: { comments: comments_data }
  end

  def create
    comment = @post.comments.build(comment_params)
    comment.user = @authenticated_user
    
    if comment.save
      comment_data = {
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at,
        user: {
          id: comment.user.id,
          name: comment.user.name,
          remote_avatar_url: comment.user.remote_avatar_url
        }
      }
      
      render json: { comment: comment_data }, status: :created
    else
      render json: { errors: comment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    if @comment.user == @authenticated_user
      @comment.destroy
      render json: { message: 'コメントを削除しました' }
    else
      render json: { error: '削除権限がありません' }, status: :forbidden
    end
  end

  private

  def set_post
    @post = Post.find(params[:post_id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: '投稿が見つかりません' }, status: :not_found
  end

  def set_comment
    @comment = @post.comments.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'コメントが見つかりません' }, status: :not_found
  end

  def comment_params
    params.require(:comment).permit(:content)
  end

  def authenticate_user_for_comments
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