Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :posts
      resources :users
      get "/me" => "users#me"
      post "/callback" => "oauths#callback"
      get "/callback" => "oauths#callback"
      get "/:provider" => "oauths#oauth", as: :auth_at_provider
      get "/auth/status" => "auth#status"
      post "/auth/logout" => "auth#logout"
      get "/onboarding/repositories" => "onboarding#get_repositories"
      post "/onboarding/complete" => "onboarding#complete_onboarding"
    end
  end
end
