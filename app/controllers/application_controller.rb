class ApplicationController < ActionController::Base
  before_filter :authenticate_user!
  #protect_from_forgery  #causes a problem with json requests need to find a way arround this

  #testng
  def main_menu
    render :partial => 'menus/main_menu'
  end
end
