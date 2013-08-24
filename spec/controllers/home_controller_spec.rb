require 'spec_helper'

describe HomeController do

  describe "Get 'index'" do
    it "renders the home page view" do
      get :index
      response.should render_template :index
    end
  end

end
