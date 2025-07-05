class ApplicationController < ActionController::Base
  before_action :set_current_user
  helper_method :current_user, :frontend_url

  def set_current_user
    @current_user = User.find_by(id: session[:user_id]) if session[:user_id]
  end

  def current_user
    @current_user ||= User.find_by(id: session[:user_id])
  end

  protected

  def frontend_config
    @frontend_config ||= Rails.application.credentials.frontend[Rails.env.to_sym]
  end

  def frontend_url(path = '')
    "#{frontend_config[:base_url]}#{path}"
  end

  def logged_in?
    !!current_user
  end
end
