class Api::V1::PostsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    posts = Post.order(published_at: :desc)
    render json: { status: 200, posts: posts }
  end

  def show
    posts = Post.all
    post = posts.where(id: params[:id])
    render json: { status: 200, post: post}
  end

  def create
    if current_user.nil?
      render json: { status: 401, message: 'Unauthorized' }, status: :unauthorized
      return
    end

    post = Post.new(permit_params)
    post.user = current_user
    post.published_at = Time.zone.now
    if post.save
      render json: { status: 201, post: post }, status: :created
    else
      render json: { status: 422, errors: post.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
  end

  def destroy
  end

  private

  def permit_params
   params.require(:post).permit(:title, :body, :description, :image_url, :user_id)
  end
end
