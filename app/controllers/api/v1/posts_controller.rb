class Api::V1::PostsController < ApplicationController
  # Authentication required for create, update, destroy actions
  # before_action :require_login, only: [:create, :update, :destroy]
  before_action :set_post, only: [:show, :update, :destroy]
  before_action :check_post_owner, only: [:update, :destroy]

  def index
    posts = Post.includes(:user).order(published_at: :desc)
    render json: { 
      status: 200, 
      posts: posts.as_json(include: { user: { only: [:id, :name, :remote_avatar_url] } })
    }
  end

  def show
    render json: { 
      status: 200, 
      post: @post.as_json(include: { user: { only: [:id, :name, :remote_avatar_url] } })
    }
  end

  def create
    # セッションベースの認証チェック（フォールバック）
    if current_user
      user = current_user
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
    end

    post = user.posts.build(permit_params)
    post.published_at = Time.zone.now
    
    if post.save
      render json: { 
        status: 201, 
        post: post.as_json(include: { user: { only: [:id, :name, :remote_avatar_url] } })
      }, status: :created
    else
      render json: { 
        status: 422, 
        errors: post.errors.full_messages 
      }, status: :unprocessable_entity
    end
  end

  def update
    if @post.update(permit_params)
      render json: { 
        status: 200, 
        post: @post.as_json(include: { user: { only: [:id, :name, :remote_avatar_url] } })
      }
    else
      render json: { 
        status: 422, 
        errors: @post.errors.full_messages 
      }, status: :unprocessable_entity
    end
  end

  def destroy
    if @post.destroy
      render json: { status: 200, message: '投稿を削除しました' }
    else
      render json: { 
        status: 422, 
        message: '投稿の削除に失敗しました' 
      }, status: :unprocessable_entity
    end
  end

  private

  def set_post
    @post = Post.find_by(id: params[:id])
    unless @post
      render json: { 
        status: 404, 
        message: '投稿が見つかりません' 
      }, status: :not_found
    end
  end

  def check_post_owner
    unless @post.user == current_user
      render json: { 
        status: 403, 
        message: 'この投稿を編集・削除する権限がありません' 
      }, status: :forbidden
    end
  end

  def permit_params
    params.require(:post).permit(:title, :body, :description, :image_url)
  end

  def user_data_params
    params.require(:user_data).permit(:id, :name, :email)
  end
end
