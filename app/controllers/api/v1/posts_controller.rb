class Api::V1::PostsController < ApplicationController
  def index
    posts = Post.all
    render json: { status: 200, posts: posts }
  end

  def show
    posts = Post.all
    post = posts.where(id: params[:id])
    render json: { status: 200, post: post}
  end

  def create
  end

  def update
  end

  def destroy
  end
end
