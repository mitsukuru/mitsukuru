class Api::V1::AuthController < ApplicationController
  
  def status
    render json: {
      authenticated: logged_in?,
      user_id: session[:user_id],
      session_keys: session.keys,
      current_user: current_user&.slice(:id, :name, :email),
      github_auth: current_user&.authentications&.find_by(provider: 'github')&.slice(:id, :provider, :uid, :access_token)
    }
  end

  def logout
    session.clear
    render json: { success: true, message: 'ログアウトしました' }
  end
end