class Api::V1::UsersController < ApplicationController
  def index
    users = User.all
    render json: { users: users }
  end

  private

  def user_params
    params.require(:user).permit(:username, :email, :name)
  end
end
