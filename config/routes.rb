Rails.application.routes.draw do
  devise_scope :user do
    get "sign_up" => "devise/registrations#new", as: "new_user_registration"
  end
  devise_for :users, skip: [:sessions], 
    controllers: { :omniauth_callbacks => "users/omniauth_callbacks" }
  as :user do
    get 'sign_in', to: 'devise/sessions#new', as: :new_user_session
    post 'sign_in', to: 'devise/sessions#create', as: :user_session
    match 'sign_out', to: 'devise/sessions#destroy', as: :destroy_user_session, 
      via: Devise.mappings[:user].sign_out_via
  end
  
  root "todo#index"

  scope '/api' do
    resources :projects
  end
end