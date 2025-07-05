class Api::V1::UsersController < ApplicationController
  def index
    users = User.all
    render json: { users: users }
  end

  def me
    Rails.logger.info "認証状態確認: session[:user_id]=#{session[:user_id]}, current_user=#{current_user&.id}"
    
    if logged_in?
      Rails.logger.info "認証済みユーザー: #{current_user.name} (ID: #{current_user.id})"
      render json: {
        authenticated: true,
        user: {
          id: current_user.id,
          name: current_user.name,
          email: current_user.email,
          remote_avatar_url: current_user.remote_avatar_url
        }
      }
    else
      Rails.logger.info "未認証ユーザー"
      render json: {
        authenticated: false,
        user: nil
      }
    end
  end

  private

  def user_params
    params.require(:user).permit(:username, :email, :name)
  end
end
