require 'spec_helper'

describe StoryBoardController do
  before :each do
    @project = create(:project)
    login_user
  end

  describe "GET #index" do
    it "renders the story board 'index' view" do
      get :index, id: @project
      expect(response).to render_template 'index'
    end

    it "assigns an existing Project to @project" do
      get :index, id: @project
      expect(assigns(:project)).to eq @project
    end

  end

  describe "POST #get_project_tasks" do
    before :each do
      @sb_objects = [
          create(:valid_task, title: 'Task 1', project: @project),
          create(:valid_user_story, title: 'Story 1', project: @project)
      ]
    end

    it "assigns tasks related to the @project to @tasks" do
      get :get_project_tasks, id: @project
      expect(assigns(:project_tasks)).to eq @sb_objects
    end

    it "returns a JSON string of all the @tasks" do
      expect(response).to render_template json: @sb_objects
    end
  end

  describe "POST #get_sbo_form_objects" do
    it "returns a JSON object with all the required form objects" do
      get :get_form_objects
      expect(response).to render_template json: :valid_form_objects
    end
  end

  describe "POST #create" do
    context "with valid attributes" do
      it "saves the new project into the database" do
        expect {
          post :create, story_board: attributes_for(:story_board_object)
        }.to change(StoryBoardObject, :count).by(1)
      end
      it "returns the JSON string of the created object" do
        post :create, story_board: attributes_for(:story_board_object)
        expect(response).to render_template json: @sbo
      end
    end

    context "with invalid attributes" do
      it "does not update a project in the database" do
        expect {
          post :create, story_board: attributes_for(:invalid_story_board_object)
        }.to_not change(StoryBoardObject, :count).by(1)
      end
      it "returns a JSON string with the error message" do
        @sbo = build(:invalid_story_board_object)
        post :create, story_board: attributes_for(:invalid_story_board_object)
        expect(response).to render_template json: {error: 'Could not create the object', messages: @sbo.errors}
      end
    end

  end

  describe "POST #update" do
    before :each do
      @story_board_object = create(:story_board_object)
    end

    it "locates the requested @story_board_object" do
      put :update, id: @story_board_object, story_board: attributes_for(:story_board_object)
      expect(assigns(:story_board_object).becomes(StoryBoardObject)).to eq @story_board_object
    end

    context "with valid attributes" do
      it "updates the story_board_object in the database" do
        put :update, id: @story_board_object, story_board: attributes_for(:story_board_object, title: "New title")
        @story_board_object.reload
        expect(@story_board_object.title).to eq "New title"
      end

      it "returns the json of the object after save" do
        put :update, id: @story_board_object, story_board: attributes_for(:story_board_object)
        expect(response).to render_template json: @story_board_object
      end

      it "excludes :id, :created_at, :updated_at, :parent_title before doing the update" do
        put :update, id: @story_board_object, story_board: attributes_for(:story_board_object)
        @update_params = assigns(:update_params)
        expect(@update_params.include?(:id) || @update_params.include?(:created_at) || @update_params.include?(:updated_at) || @update_params.include?(:parent_title)).to be_false
      end
    end
    context "with invalid attributes" do
      it "does not update a story_board_object in the database" do
        put :update, id: @story_board_object, story_board: attributes_for(:story_board_object, title: nil)
        @story_board_object.reload
        expect(@story_board_object.title).to_not be_nil
      end

      it "returns the json of the error message" do
        put :update, id: @story_board_object, story_board: attributes_for(:invalid_story_board_object)
        expect(response).to render_template json: {error: 'Can not update object', messages: @story_board_object.errors}
      end
    end
  end

end