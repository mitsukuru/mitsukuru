class Api::V1::OauthsController < ApplicationController
  # before_action :require_login

  def config
    render json: {
      github: {
        client_id: "Ov23lipUtZEQclrolCBR",
        callback_url: "http://127.0.0.1:3000/api/v1/callback?provider=github",
        scope: "user:email repo"
      },
      frontend: {
        base_url: "http://localhost:5173",
        home_path: "/home",
        login_path: "/sign_in"
      }
    }
  end

  def oauth
    provider = params[:provider]
    
    if logged_in?
      render json: { 
        redirect_to: frontend_url(frontend_config[:home_path]), 
        message: '既にログインしています' 
      }
    else
      begin
        unless %w[github].include?(provider)
          render json: { 
            error: 'unsupported_provider', 
            message: "サポートされていないプロバイダーです: #{provider}" 
          }, status: :bad_request
          return
        end
        
        Rails.logger.info "OAuth認証開始: #{provider}"
        login_at(provider)
      rescue StandardError => e
        Rails.logger.error "OAuth開始エラー (#{provider}): #{e.message}"
        render json: { 
          error: 'oauth_start_failed', 
          message: 'OAuth認証の開始に失敗しました' 
        }, status: :internal_server_error
      end
    end
  end

  def callback
    provider = params[:provider]
    
    begin
      if @user = login_from(provider)
        # 既存ユーザーのログイン成功
        session[:user_id] = @user.id
        Rails.logger.info "OAuth認証成功: ユーザーID #{@user.id} (#{provider})"
        Rails.logger.info "セッション設定: user_id=#{session[:user_id]}"
        Rails.logger.info "オンボーディング状況: #{@user.onboarding_completed}"
        
        # GitHubアクセストークンを保存
        save_github_access_token(@user, provider)
        
        # LocalStorage用のユーザー情報をエンコード（API トークンを含める）
        user_data = {
          id: @user.id,
          name: @user.name,
          email: @user.email,
          remote_avatar_url: @user.remote_avatar_url,
          onboarding_completed: @user.onboarding_completed,
          api_token: @user.api_token
        }.to_json
        encoded_user = Base64.strict_encode64(user_data)
        base_url = Rails.application.credentials.frontend[:development][:base_url]
        
        # オンボーディング完了状況でリダイレクト先を決定
        if @user.onboarding_completed
          redirect_to "#{base_url}/auth/loading?auth_success=#{encoded_user}", allow_other_host: true
        else
          redirect_to "#{base_url}/onboarding?user=#{encoded_user}", allow_other_host: true
        end
      else
        # 新規ユーザー作成
        @user = create_from(provider)
        
        if @user&.persisted?
          session[:user_id] = @user.id
          Rails.logger.info "OAuth新規ユーザー作成成功: ユーザーID #{@user.id} (#{provider})"
          Rails.logger.info "セッション設定: user_id=#{session[:user_id]}"
          
          # GitHubアクセストークンを保存
          save_github_access_token(@user, provider)
          # LocalStorage用のユーザー情報をエンコード（API トークンを含める）
          user_data = {
            id: @user.id,
            name: @user.name,
            email: @user.email,
            remote_avatar_url: @user.remote_avatar_url,
            onboarding_completed: @user.onboarding_completed,
            api_token: @user.api_token
          }.to_json
          encoded_user = Base64.strict_encode64(user_data)
          base_url = Rails.application.credentials.frontend[:development][:base_url]
          
          # 新規ユーザーは必ずオンボーディングに誘導
          redirect_to "#{base_url}/onboarding?user=#{encoded_user}", allow_other_host: true
        else
          handle_oauth_error("ユーザー作成に失敗しました", provider, @user&.errors&.full_messages)
        end
      end
    rescue StandardError => e
      case e.class.name
      when 'Sorcery::External::Providers::ExternalProvider::UnauthorizedError'
        handle_oauth_error("OAuth認証が拒否されました", provider, [e.message])
      when 'Sorcery::External::Providers::ExternalProvider::MissingEmailError'
        handle_oauth_error("メールアドレスの取得に失敗しました", provider, [e.message])
      else
        handle_oauth_error("予期しないエラーが発生しました", provider, [e.message])
      end
    rescue ActiveRecord::RecordInvalid => e
      handle_oauth_error("ユーザーデータの保存に失敗しました", provider, e.record.errors.full_messages)
    end
  end

  private

  def handle_oauth_error(message, provider, details = [])
    error_id = SecureRandom.uuid
    Rails.logger.error "[#{error_id}] OAuth認証エラー (#{provider}): #{message}"
    Rails.logger.error "[#{error_id}] 詳細: #{details.join(', ')}" if details.any?
    
    error_params = {
      error: 'oauth_failed',
      message: message,
      error_id: error_id
    }
    
    login_path = Rails.application.credentials.frontend[:development][:login_path]
    base_url = Rails.application.credentials.frontend[:development][:base_url]
    
    redirect_to "#{base_url}#{login_path}?#{error_params.to_query}", 
               allow_other_host: true
  end

  def save_github_access_token(user, provider)
    return unless provider == 'github'
    
    begin
      # Sorceryの @user_hash にアクセストークンが含まれている
      Rails.logger.info "User hash keys: #{@user_hash&.keys}"
      Rails.logger.info "Access token available: #{@user_hash&.dig('credentials', 'token')}"
      
      # GitHub認証レコードを取得
      auth = user.authentications.find_by(provider: provider)
      
      if auth && @user_hash&.dig('credentials', 'token')
        access_token = @user_hash['credentials']['token']
        auth.update!(access_token: access_token)
        Rails.logger.info "GitHubアクセストークンを保存: user_id=#{user.id}, token_length=#{access_token.length}"
      else
        Rails.logger.warn "GitHub認証またはアクセストークンが見つかりません: user_id=#{user.id}"
        Rails.logger.warn "Auth record: #{auth.present?}"
        Rails.logger.warn "User hash: #{@user_hash.present?}"
      end
    rescue => e
      Rails.logger.error "GitHubアクセストークン保存エラー: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
    end
  end
end
