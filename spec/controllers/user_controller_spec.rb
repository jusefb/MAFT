require 'spec_helper'

describe UserController do
  before :each do
    login_user
  end

  describe "GET 'index'" do
    before :each do

    end

    it "render index template" do
      user = User.new
      user.id = 1

      User.stub(:find).and_return(user)

      get :index

      expect(response).to render_template :index
    end
  end

  describe "GET 'add_user_role'" do
    before :each do
      @userStub = FactoryGirl.build(:user)
      @userRoleStub = double('UserRole', {title: 'standard'})#FactoryGirl.build(:user_role, {title: 'standard'})
    end

    it "adds the user role if it does not exist" do
      User.stub(:find).and_return(@userStub)
      UserRole.stub(:find).and_return(@userRoleStub)
      @userStub.stub_chain(:user_roles, :include?).and_return false
      @userStub.stub_chain(:user_roles, :create)

      post :add_user_role

      expect(assigns(:message)).to eq @userRoleStub.title + ' role has been added to ' + @userStub.name
      expect(response).to redirect_to action: 'index', message: assigns(:message)
    end

    it "returns a message the user role already added if the role exists" do
      User.stub(:find).and_return(@userStub)
      UserRole.stub(:find).and_return(@userRoleStub)
      @userStub.stub_chain(:user_roles, :include?).and_return true

      post :add_user_role

      expect(assigns(:message)).to eq 'This role has already been added'
      expect(response).to redirect_to action: 'index', message: assigns(:message)
    end
  end

end
