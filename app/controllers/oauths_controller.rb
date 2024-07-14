class OauthsController < ApplicationController
  # Frontで取得したToken情報をもとにユーザー認証をするMethod
  def callback
    debugger
    provider = params[:provider]
    # loginできた場合はここで200を返す
    if @user = login_from(provider)
      render json: { status: 'OK' }
    else
      begin
        # loginできない場合は送られてきた情報をもとにユーザー作成
        @user = create_from(provider)

        reset_session
        auto_login(@user)
        render json: { status: 'OK' }
      rescue
        render json: { status: 'NG' }, status: 400
      end
    end
  end
end
