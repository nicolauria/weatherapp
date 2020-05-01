Rails.application.routes.draw do
  root 'static_pages#index'
  match "*path", to: "static_pages#index", via: :all
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
