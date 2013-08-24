require 'spec_helper'

describe ProjectController do

  before :each do
    login_user
  end

  describe "GET 'index'" do
    it "populates an array of projects" do
      project = create(:project)
      get :index
      assigns(:projects).should eq([project])
    end

    it "renders the :index view" do
      get :index
      response.should render_template :index
    end
  end

  describe "GET 'new'" do
    it "assigns a new Project to @project" do
      project = Project.new
      get :new
      assigns(:project).should_not be_nil
    end

    it "renders the :new view" do
      get :new
      response.should render_template :new
    end
  end

  describe "POST 'create'" do
    context "with valid attributes" do
      it "saves the new project into the database" do
        expect {
          post :create, project: attributes_for(:project)
        }.to change(Project, :count).by(1)
      end

      it "redirects to the #show view after save" do
        post :create, project: attributes_for(:project)
        expect(response).to redirect_to project_path(assigns[:project])
      end
    end

    context "with invalid attributes" do
      it "does not save a project into the database" do
        expect {
          post :create, project: attributes_for(:invalid_project)
        }.to_not change(Project, :count).by(1)
      end

      it "redirects to the 'new' view" do
        post :create, project: attributes_for(:invalid_project)
        expect(response).to render_template :new
      end

    end

  end

  describe "GET 'show'" do
    it "assigns the requested project to @project" do
      project = create(:project)
      get :show, id: project
      expect(assigns(:project)).to eq project
    end
    it "renders the :show view" do
      project = create(:project)
      get :show, id: project
      expect(response).to render_template :show
    end

  end

  describe "GET 'edit'" do
    before :each do
      @project = create(:project)
    end

    it "assigns an existing Project to @project" do
      get :edit, id: @project
      expect(assigns(:project)).to eq @project
    end

    it "renders the :edit view" do
      get :edit, id: @project
      expect(response).to render_template :edit
    end

    describe "returns a list of all Users" do

      it "assigns a list of Users to @users" do
        users = [
            create(:user, id: 1, email: 'test@test.com'),
            create(:user, id: 2, email: 'test2@test.com')
        ]
        get :edit, id: @project
        expect(assigns(:users)).to eq users
      end

      it "filters out the users that have already been added"
    end

  end

  describe "POST 'update'" do
    before :each do
      @project = create(:project,
          title: "New Project",
          owner: "Test User"
      )
    end

    it "locates the requested @project" do
      put :update, id: @project, project: attributes_for(:project)
      expect(assigns(:project)).to eq @project
    end

    context "with valid attributes" do
      it("updates the project in the database") do
        put :update, id: @project,
            project: attributes_for(:project, title: "New Project 2")
        @project.reload
        expect(@project.title).to eq "New Project 2"
      end

      it "redirects to the #show view after save"  do
        put :update, id: @project, project: attributes_for(:project)
        expect(response).to redirect_to @project
      end
    end

    context "with invalid attributes" do
      it "does not update a project in the database" do
        put :update, id: @project, project: attributes_for(:project, title: "Incorrect Title", owner: nil)
        @project.reload
        expect(@project.title).to_not eq("Incorrect Title")
      end

      it "redirects to the 'edit' view" do
         put :update, id: @project, project: attributes_for(:invalid_project)
        expect(response).to render_template :edit
      end
    end
  end

  describe "POST 'add_user'" do
    before :each do
      @project = create(:project)
      @user = create(:user, {id: 1})
    end

    it "locates the project" do
      post :add_users, id: @project, users_to_link: {1 => '1'}
      expect(assigns(:project)).to eq @project
    end

    it "locates the user that needs to be added" do
      post :add_users, id: @project, users_to_link: {1 => '1'}
      expect(assigns(:user)).to eq @user
    end

      it "links the selected users to the project" do
        @users_to_link =  {1 => '1'}
        post :add_users, id: @project, users_to_link: @users_to_link
        expect(@project.users.length).to eq(1)
      end

      it "unlinks the unselected users from the project" do
        @users_to_link =  {1 => '0'}
        post :add_users, id: @project, users_to_link: @users_to_link
        expect(@project.users.length).to eq(0)
      end

      it "redirects to #show project" do
        @users_to_link =  {1 => '1'}
        post :add_users, id: @project, users_to_link: @users_to_link
        expect(response).to render_template :show, id: @project
      end

  end

  describe "POST 'delete_linked_user'"do

  end
end
