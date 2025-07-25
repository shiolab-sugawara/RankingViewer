Rails.application.routes.draw do
  namespace :api do
    resources :streams, only: [:index]
    resources :followers, only:[:index]
    resources :vods, only:[:index]
    resources :subscriber_logs, only: [:index]
    resources :bookmarks, only: [:create, :destroy, :index]
    get "ranking", to: "streams#index"

    mount_devise_token_auth_for 'User', at: 'auth', controllers: {
      registrations: 'api/auth/registrations'
    }

    namespace :auth do
      resources :sessions, only: %i[index]
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check
end
