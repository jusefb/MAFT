require 'spec_helper'

describe ApplicationController do

  before :each do
    login_user
  end

 describe "Get 'main_menu'" do
    it "should get the partial view of the main menu" do
       get :main_menu
       response.should render_template :partial => 'menus/_main_menu'
    end
 end

end