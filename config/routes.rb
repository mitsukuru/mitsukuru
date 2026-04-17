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
      
      resources :notifications, only: [:index, :show, :update, :destroy] do
        member do
          patch :mark_as_read
        end
        collection do
          patch :mark_all_as_read
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
      
      # GitHub詳細情報API
      get "/github/repository/:owner/:repo" => "github_detail#show_repository"
      get "/github/repository/:owner/:repo/commits" => "github_detail#show_commits"
      get "/github/repository/:owner/:repo/contributors" => "github_detail#show_contributors"
      get "/github/repository/:owner/:repo/languages" => "github_detail#show_languages"
      get "/github/repository/:owner/:repo/issues" => "github_detail#show_issues"
      get "/github/repository/:owner/:repo/readme" => "github_detail#show_readme"
    end
  end
end
