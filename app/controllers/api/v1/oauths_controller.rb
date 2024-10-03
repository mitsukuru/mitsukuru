class Api::V1::OauthsController < ApplicationController
  # before_action :require_login

  def oauth
    if logged_in?
      render json: { redirect_to: '/users', message: t('defaults.info') }
    else
      login_at(params[:provider])
    end
  end

  def callback
    provider = params[:provider]
    if @user = login_from(provider)
      redirect_to 'http://localhost:5173/home', allow_other_host: true
    else
      begin
        @user = create_from(provider)

        auto_login(@user)
        reset_session
        render 'http://localhost:5173/home', allow_other_host: true
      rescue
        render json: { redirect_to: request.referer || '/', message: 'ログインに失敗しました' }, status: :unprocessable_entity
      end
    end
  end
end
