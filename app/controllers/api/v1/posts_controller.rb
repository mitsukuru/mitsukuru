class Api::V1::PostsController < ApplicationController
  # Authentication required for create, update, destroy actions
  # before_action :require_login, only: [:create, :update, :destroy]
  before_action :set_post, only: [:show, :update, :destroy]
  before_action :check_post_owner, only: [:update, :destroy]

  def index
    posts = Post.includes(:user, :comments, :reactions, :tags).order(published_at: :desc)
    
    # リアクションデータを一括取得（N+1問題対策）
    post_ids = posts.pluck(:id)
    reactions_data = Reaction.stats_for_posts(post_ids)
    
    # ログインユーザーのリアクション状態を一括取得
    user_reactions_data = {}
    if current_user
      post_ids.each do |post_id|
        user_reactions_data[post_id] = Reaction.user_reactions_for_post(post_id, current_user.id)
      end
    end
    
    posts_data = posts.map do |post|
      post.as_json(
        include: { 
          user: { only: [:id, :name, :remote_avatar_url] },
          tags: { only: [:id, :name] }
        },
        methods: [:all_images]
      ).merge(
        comments_count: post.comments_count,
        reactions: reactions_data[post.id] || {},
        user_reactions: user_reactions_data[post.id] || {}
      )
    end
    
    render json: { 
      status: 200, 
      posts: posts_data
    }
  end

  def show
    render json: { 
      status: 200, 
      post: @post.as_json(
        include: { 
          user: { only: [:id, :name, :remote_avatar_url] },
          tags: { only: [:id, :name] }
        },
        methods: [:all_images]
      )
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

    # タグを除外したパラメータでPostを作成
    post_params_without_tags = permit_params.except(:tags)
    post = user.posts.build(post_params_without_tags)
    post.published_at = Time.zone.now
    
    # デバッグ: 受信したparams確認
    Rails.logger.info "=== Post Creation Debug ==="
    Rails.logger.info "Received params: #{params.inspect}"
    Rails.logger.info "Tags param: #{params[:post][:tags].inspect}"
    Rails.logger.info "=========================="
    
    # 最初にメイン投稿を保存
    if post.save
      # 追加画像の処理（投稿保存後にIDが確定してから）
      if params[:post][:additional_image_files].present?
        additional_paths = []
        params[:post][:additional_image_files].each_with_index do |file, index|
          # ファイル名を一意にするためにタイムスタンプとインデックスを使用
          timestamp = Time.now.to_i
          filename = "#{timestamp}_#{index}_#{file.original_filename}"
          
          # 保存先ディレクトリを作成
          upload_dir = Rails.root.join('public', 'uploads', 'post', 'additional_images', post.id.to_s)
          FileUtils.mkdir_p(upload_dir)
          
          # ファイルを保存
          file_path = upload_dir.join(filename)
          File.open(file_path, 'wb') do |f|
            f.write(file.read)
          end
          
          # 相対パスを保存
          relative_path = "/uploads/post/additional_images/#{post.id}/#{filename}"
          additional_paths << relative_path
        end
        
        # 追加画像のパスを更新
        post.update(additional_images: additional_paths)
      end
      
      # タグの処理
      if params[:post][:tags].present?
        Rails.logger.info "Processing tags: #{params[:post][:tags].inspect}"
        tag_names = params[:post][:tags]
        tag_objects = []
        
        tag_names.each do |tag_name|
          next if tag_name.blank?
          Rails.logger.info "Creating/finding tag: #{tag_name}"
          tag = Tag.find_or_create_by(name: tag_name.strip.downcase)
          Rails.logger.info "Tag created/found: #{tag.inspect} (class: #{tag.class})"
          tag_objects << tag
        end
        
        # 一度にすべてのタグを関連付け
        post.tags = tag_objects
        Rails.logger.info "Final post tags: #{post.tags.pluck(:name)}"
      else
        Rails.logger.info "No tags received in params"
      end
      
      render json: { 
        status: 201, 
        post: post.as_json(
          include: { 
            user: { only: [:id, :name, :remote_avatar_url] },
            tags: { only: [:id, :name] }
          },
          methods: [:all_images]
        )
      }, status: :created
    else
      render json: { 
        status: 422, 
        errors: post.errors.full_messages 
      }, status: :unprocessable_entity
    end
  end

  def update
    # タグを除外したパラメータで更新
    post_params_without_tags = permit_params.except(:tags)
    if @post.update(post_params_without_tags)
      # タグの更新処理
      if params[:post][:tags].present?
        @post.tags.clear  # 既存のタグをクリア
        tag_names = params[:post][:tags]
        tag_objects = []
        tag_names.each do |tag_name|
          next if tag_name.blank?
          tag = Tag.find_or_create_by(name: tag_name.strip.downcase)
          tag_objects << tag
        end
        @post.tags = tag_objects
      end
      
      render json: { 
        status: 200, 
        post: @post.as_json(
          include: { 
            user: { only: [:id, :name, :remote_avatar_url] },
            tags: { only: [:id, :name] }
          }
        )
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
    params.require(:post).permit(
      :title, :body, :description, :image_url,
      :repository_name, :repository_url, :repository_description,
      tags: []
    )
  end

  def user_data_params
    params.require(:user_data).permit(:id, :name, :email)
  end
end
