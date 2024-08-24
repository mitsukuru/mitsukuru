Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :projects, only: [:create] do
        member do
          get :analyze
        end
      resources :users, only: [:index]
        get "users", to: "users#index"
      end
    end
    post "/auth/v1/callback" => "oauths#callback"
    get "/auth/v1/callback" => "oauths#callback"
  end
end
