Rails.application.routes.draw do
  devise_for :users
  namespace :api do
    namespace :v1 do
      resources :posts
      resources :users
      post "/callback" => "oauths#callback"
      get "/callback" => "oauths#callback"
      get "/:provider" => "oauths#oauth", as: :auth_at_provider
    end
  end
end
