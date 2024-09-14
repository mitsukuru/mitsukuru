class Api::V1::OauthsController < ApplicationController
  skip_before_action :require_login, raise: false
  # Frontで取得したToken情報をもとにユーザー認証をするMethod

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
      # 既存ユーザーの場合の処理
      redirect_to 'http://localhost:5173/home', allow_other_host: true, flash: { info: 'メールを送信しました' }
    else
      # 新規ユーザーの場合、ユーザーを作成
      @user = create_from(provider)
      reset_session # プロテクションのため
      auto_login(@user)
      render json: { redirect_to: '/home', message: '新規登録に成功しました' }
    end
  rescue
    render json: { redirect_to: request.referer || '/', message: 'ログインに失敗しました' }, status: :unprocessable_entity
  end
end
