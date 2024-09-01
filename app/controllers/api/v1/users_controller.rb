class Api::V1::UsersController < ApplicationController
  def index
    users = User.all
    render json: { status: 200, users: users }
  end

  private

  def user_params
    params.permit(:username, :email, :flash)
  end
end
