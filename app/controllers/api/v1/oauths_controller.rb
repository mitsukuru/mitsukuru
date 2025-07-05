class Api::V1::OauthsController < ApplicationController
  # before_action :require_login

  def config
    render json: {
      github: {
        client_id: "Ov23lipUtZEQclrolCBR",
        callback_url: "http://127.0.0.1:3000/api/v1/callback?provider=github",
        scope: "user:email"
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
        Rails.logger.info "OAuth認証成功: ユーザーID #{@user.id} (#{provider})"
        Rails.logger.info "セッション設定: user_id=#{session[:user_id]}"
        # LocalStorage用のユーザー情報をエンコード
        user_data = {
          id: @user.id,
          name: @user.name,
          email: @user.email,
          remote_avatar_url: @user.remote_avatar_url
        }.to_json
        encoded_user = Base64.strict_encode64(user_data)
        base_url = Rails.application.credentials.frontend[:development][:base_url]
        redirect_to "#{base_url}/auth/loading?auth_success=#{encoded_user}", allow_other_host: true
      else
        # 新規ユーザー作成
        @user = create_from(provider)
        
        if @user&.persisted?
          auto_login(@user)
          Rails.logger.info "OAuth新規ユーザー作成成功: ユーザーID #{@user.id} (#{provider})"
          Rails.logger.info "セッション設定: user_id=#{session[:user_id]}"
          # LocalStorage用のユーザー情報をエンコード
          user_data = {
            id: @user.id,
            name: @user.name,
            email: @user.email,
            remote_avatar_url: @user.remote_avatar_url
          }.to_json
          encoded_user = Base64.strict_encode64(user_data)
          base_url = Rails.application.credentials.frontend[:development][:base_url]
          redirect_to "#{base_url}/auth/loading?auth_success=#{encoded_user}", allow_other_host: true
        else
          handle_oauth_error("ユーザー作成に失敗しました", provider, @user&.errors&.full_messages)
        end
      end
    rescue Sorcery::External::Providers::ExternalProvider::UnauthorizedError => e
      handle_oauth_error("OAuth認証が拒否されました", provider, [e.message])
    rescue Sorcery::External::Providers::ExternalProvider::MissingEmailError => e
      handle_oauth_error("メールアドレスの取得に失敗しました", provider, [e.message])
    rescue ActiveRecord::RecordInvalid => e
      handle_oauth_error("ユーザーデータの保存に失敗しました", provider, e.record.errors.full_messages)
    rescue StandardError => e
      handle_oauth_error("予期しないエラーが発生しました", provider, [e.message])
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
end
