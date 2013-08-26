class ApplicationController < ActionController::Base
  before_filter :authenticate_user!
  protect_from_forgery

  #testng
  def main_menu
    render :partial => 'menus/main_menu'
  end
end
