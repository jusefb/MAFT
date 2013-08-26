class ProjectController < ApplicationController

  def index
    @projects = Project.all()
  end

  def new
    @project = Project.new
  end

  def create
    project = params[:project]
    @project = Project.create(project)
    if (@project.save)
      redirect_to action: 'show', id: @project
    else
      render :new
    end
  end

  # @return [Object]
  def edit
    @project = Project.find(params[:id])
    @users = User.all
  end

  def show
    @project = Project.find(params[:id])
  end

  def update
    @project = Project.find(params[:id])
    if (@project.update_attributes(params[:project]))
      redirect_to @project
    else
      render :edit
    end
  end

  #will bring the edit team form
  def edit_team
    @project = Project.find(params[:id])
    @users = User.all
  end

  #called by submitting the edit_team form
  def add_users
    @project = Project.find(params[:id])
    @users_to_link = params[:users_to_link]

    @users_to_link.each do |u|
      @user = User.find_by_id(u[0])
      if (@user != nil)
        if(u[1] == '1')
          @project.users << @user if(!@project.users.exists?(@user))
        else
          @project.users.delete(@user) if(@project.users.exists?(@user))
        end
      else
        render :json => {error: 'invalid user selected'}
        return
      end
    end

    render :show
  end
end
