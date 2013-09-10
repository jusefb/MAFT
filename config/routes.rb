MAFT::Application.routes.draw do

  root :to => 'home#index'
  match 'home', :to => 'home#index'
  match 'application/main_menu', :to => 'application#main_menu'
  match 'home/main_show', to: 'home#main_show'

  #Reporitng routes
  get "reporting/index", as: 'reports_index'

  post "reporting/get_report_data", to: "reporting#get_report_data", as: 'get_report_data'

  #Project routes
  match 'project/add_users/:id/', :to => 'project#add_users#id', :via => :post
  match 'project/edit_team/:id', :to => 'project#edit_team#id'
  resources :project

  ####

  #User routes
  get "user/index(/:message)/", to: 'user#index#message',  as: 'users_index'
  get "user/change_roles/:id", to: 'user#change_roles#id',  as: 'user_change_role'
  post "user/update_roles/:id", to: 'user#update_roles#id',  as: 'user_roles'
  post "user/add_user_role", to: 'user#add_user_role'

  devise_for :users
  resources  :user

  ####

  #Story Board routes
  match 'story_board/update_stages', :to => 'story_board#update_stages'
  match 'story_board/reorder', :to => 'story_board#reorder'
  match 'story_board/index/:id(/*other)', :to => 'story_board#index#id'
  match 'story_board/get_project_tasks/:id', :to => 'story_board#get_project_tasks#id'
  post 'story_board/get_form_objects', :to => 'story_board#get_form_objects'
  resources :story_board

  #TDD inof Module routes
  get 'tdd/index', to: 'tdd#index', as: 'tdd_index'
  get 'tdd/view_tdd_process', to: 'tdd#view_tdd_process', as: 'view_tdd_process'
  get 'tdd/render_svg_image', to: 'tdd#render_svg_image'
  get 'tdd/vew_app_tests', to: 'tdd#vew_app_tests', as: 'vew_app_tests'
  get 'tdd/render_ruby_tests', to: 'tdd#render_ruby_tests', as: 'render_ruby_tests'
  get 'tdd/render_js_tests', to: 'tdd#render_js_tests', as: 'render_js_tests'

  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  #sroot :to => 'welcome#index'

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id))(.:format)'
end
