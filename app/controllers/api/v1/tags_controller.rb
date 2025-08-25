class Api::V1::TagsController < ApplicationController
  before_action :set_tag, only: [:show, :destroy]
  
  # GET /api/v1/tags
  def index
    @tags = Tag.popular.limit(50)
    render json: {
      tags: @tags.map { |tag|
        {
          id: tag.id,
          name: tag.name,
          posts_count: tag.posts.count
        }
      }
    }
  end
  
  # GET /api/v1/tags/:id
  def show
    render json: {
      tag: {
        id: @tag.id,
        name: @tag.name,
        posts_count: @tag.posts.count,
        posts: @tag.posts.includes(:user, :tags).map { |post|
          {
            id: post.id,
            title: post.title,
            description: post.description,
            image_url: post.image_url.url,
            all_images: post.all_images,
            created_at: post.created_at,
            user: {
              id: post.user.id,
              name: post.user.name,
              remote_avatar_url: post.user.remote_avatar_url
            },
            tags: post.tags.map { |tag| { id: tag.id, name: tag.name } }
          }
        }
      }
    }
  end
  
  # POST /api/v1/tags
  def create
    @tag = Tag.find_or_create_by(name: tag_params[:name].strip.downcase)
    
    if @tag.persisted?
      render json: {
        tag: {
          id: @tag.id,
          name: @tag.name,
          posts_count: @tag.posts.count
        }
      }, status: :created
    else
      render json: { errors: @tag.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  # DELETE /api/v1/tags/:id
  def destroy
    @tag.destroy
    head :no_content
  end
  
  # GET /api/v1/tags/search
  def search
    query = params[:q].to_s.strip
    return render json: { tags: [] } if query.blank?
    
    # SQLite用の大文字小文字を区別しない検索
    @tags = Tag.where('LOWER(name) LIKE LOWER(?)', "%#{query}%").limit(10)
    render json: {
      tags: @tags.map { |tag|
        {
          id: tag.id,
          name: tag.name,
          posts_count: tag.posts.count
        }
      }
    }
  end
  
  private
  
  def set_tag
    @tag = Tag.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Tag not found' }, status: :not_found
  end
  
  def tag_params
    params.require(:tag).permit(:name)
  end
end