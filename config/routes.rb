# Rails.application.routes.draw do
#   get 'web_analyzer/index'
#   get 'web_analyzer/analyze'
#   post "/analyze" => "web_analyzer#analyze"
#   namespace :api do
#     namespace :v1 do
#       resources :posts
#     end
#   end
# end

Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :projects, only: [:create] do
        member do
          get :analyze
        end
      end
    end
    post "/auth/v1/callback" => "oauths#callback"
    get "/auth/v1/callback" => "oauths#callback"
  end
end
