Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :posts
    end
  end
  post "/auth/v1/callback" => "oauths#callback"
  get "/auth/v1/callback" => "oauths#callback"
end
