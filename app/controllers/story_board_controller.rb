class StoryBoardController < ApplicationController

  def index
    @project = Project.find(params[:id])
  end

  def get_project_tasks
    @project_tasks = Project.find(params[:id]).story_board_objects
    project_tasks_json = @project_tasks.as_json(:methods => [:type])
    render :json => project_tasks_json
  end

  def create
    sbo = params[:story_board]
    sbo = sbo.select{|x| StoryBoardObject.attribute_names.index(x)}

    #we need t assign an obj_order to the object being created
    # by incrementing the maximum obj_order across StoryBoardObjects
    if(StoryBoardObject.all.count > 0)
      obj_order = StoryBoardObject.find_by_sql("select max(obj_order) as obj_order from story_board_objects").first['obj_order'] + 1
    else
      obj_order = 1
    end

    sbo['obj_order'] = obj_order

    @sbo = StoryBoardObject.create(sbo)
    @sbo.set_status_dates
    if (@sbo.save)
      render :json => @sbo
    else
      render :json => {error: 'Could not create the object', messages: @sbo.errors.messages}
    end
  end

  def get_form_objects
    render :json => {
        stages: ['Future','Backlog','Current','Done'],
        :types =>  [
            { :label => 'User Story', :value => 'UserStory'},
            { :label => 'Task', :value => 'Task'},
            { :label => 'Test Task', :value => 'TestTask'}
        ],
        statuses: ['Not Started', 'Started', 'Completed', 'Rejected', 'Cancelled']
    }
  end

  def update
    @story_board_object = StoryBoardObject.find(params[:id])
    @update_params =  params[:story_board].except(:id, :created_at, :updated_at, :parent_title, :linked_tasks)

    #we need to set the date of when this task became current for reporting purposes
    if(@update_params[:stage] == 'Current')
      @update_params[:marked_as_current_date]= Time.now if(@story_board_object.stage != 'Current')
    end

    #update the parameters and return json of the updated object
    if(@story_board_object.update_attributes(@update_params))
      @story_board_object.set_status_dates
      @story_board_object.save
      render :json => @story_board_object.becomes(StoryBoardObject)
    else
      render :json => {error: 'Could not update the object', messages: @story_board_object.errors.messages}, :status => 422
    end
  end

  def reorder
    @update_array =  params['story_board']['_json']
    @result = {
        "errors" => []
    }
    @update_array.each do |v|
      id = v['id']
      object = StoryBoardObject.find(id)
      obj_order =  v['obj_order']
      if(!object.update_attribute('obj_order', obj_order))
        @result['errors'].push("Could not update obj_order for " + id)
      end
    end

    render :json => @result

  end

  def show

  end

  def destroy
    if(StoryBoardObject.delete(params[:id]))
        render :json => {result: true, message: 'Deletion successfully'}
    else
        render :json => {result: false, message: 'Deletion was not successfully'}, :status => 422
    end
  end
end
