class ApplicationController < ActionController::Base
  # Skip CSRF for API endpoints (this is an API-only app)
  skip_before_action :verify_authenticity_token
  
  before_action :set_current_user
  helper_method :current_user, :frontend_url, :logged_in?

  protected

  def set_current_user
    @current_user = User.find_by(id: session[:user_id]) if session[:user_id]
  end

  def current_user
    @current_user ||= User.find_by(id: session[:user_id])
  end

  def logged_in?
    !!current_user
  end

  def require_login
    unless logged_in?
      render json: { 
        error: 'authentication_required', 
        message: 'ログインが必要です' 
      }, status: :unauthorized
    end
  end

  def frontend_config
    @frontend_config ||= Rails.application.credentials.frontend[Rails.env.to_sym]
  end

  def frontend_url(path = '')
    "#{frontend_config[:base_url]}#{path}"
  end
end
