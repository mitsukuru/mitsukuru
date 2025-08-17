class ApplicationController < ActionController::Base
  # Skip CSRF for API endpoints (this is an API-only app)
  skip_before_action :verify_authenticity_token
  
  before_action :set_current_user
  helper_method :current_user, :logged_in?

  protected

  def set_current_user
    @current_user = User.find_by(id: session[:user_id]) if session[:user_id]
  end

  def current_user
    @current_user ||= authenticate_user
  end

  def authenticate_user
    # First try token-based authentication from headers
    if request.headers['Authorization'].present?
      token = request.headers['Authorization'].gsub(/Bearer\s+/, '')
      Rails.logger.info "Token authentication attempt: #{token[0..10]}..."
      user = User.find_by_api_token(token)
      Rails.logger.info "Token auth result: #{user&.name || 'NOT FOUND'}"
      return user if user
    end
    
    # Fallback to session-based authentication
    if session[:user_id].present?
      Rails.logger.info "Session authentication attempt: user_id=#{session[:user_id]}"
      user = User.find_by(id: session[:user_id])
      Rails.logger.info "Session auth result: #{user&.name || 'NOT FOUND'}"
      return user
    end
    
    Rails.logger.info "No authentication method available"
    nil
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

  # def frontend_config
  #   @frontend_config ||= Rails.application.credentials.frontend[:development]
  # end

  # def frontend_url(path = '')
  #   "#{frontend_config[:base_url]}#{path}"
  # end
end
