Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :posts do
        resources :comments, only: [:index, :create, :destroy]
        resources :reactions, only: [:index] do
          collection do
            post :toggle
          end
        end
      end
      
      resources :tags, only: [:index, :show, :create, :destroy] do
        collection do
          get :search
        end
      end
      
      # リアクション一括取得用
      get "/posts/reactions/batch" => "reactions#batch"
      resources :users
      get "/me" => "users#me"
      post "/callback" => "oauths#callback"
      get "/callback" => "oauths#callback"
      get "/:provider" => "oauths#oauth", as: :auth_at_provider
      get "/auth/status" => "auth#status"
      post "/auth/logout" => "auth#logout"
      get "/onboarding/repositories" => "onboarding#get_repositories"
      post "/onboarding/complete" => "onboarding#complete_onboarding"
      get "/github/repositories" => "github#repositories"
    end
  end
end
