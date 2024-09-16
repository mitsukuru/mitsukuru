Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :projects, only: [:create] do
        member do
          get :analyze
        end
      end
      resources :posts
      resources :users
      post "/auth/v1/callback" => "oauths#callback"
      get "/auth/v1/callback" => "oauths#callback"
      get "/auth/v1/:provider" => "oauths#oauth", as: :auth_at_provider
    end
  end
end
