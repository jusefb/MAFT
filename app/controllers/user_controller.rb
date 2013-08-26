class UserController < ApplicationController
  def index
    @message = params[:message]
    @current_user = User.find(current_user.id)
    @users = User.where("id <> '" + @current_user.id.to_s + "'").all
  end

  def add_user_role
    @message = ''
    @user = User.find(params[:id])
    @user_role = UserRole.find(params[:role_id])
    user_roles = @user.user_roles
    if (!user_roles.include?(@user_role))
      user_roles.create(@user_role)
      @message = @user_role.title + ' role has been added to ' + @user.name
    else
      @message = 'This role has already been added'
    end

    redirect_to action: 'index', :message => @message
  end

  def new
    @user = User.new
  end

  def create
    user = params[:user]
    password = generate_dummy_password
    user['password'] = password
    user['password_confirmation'] = password

    @user = User.create(user)

    if (@user.save)
      redirect_to action: 'index'
    else
      render :new
    end
  end

  def show
    @user = User.find(params[:id])
  end

  def update_password
    @user = User.find(current_user.id)
    if @user.update_attributes(user_params)
      # Sign in the user by passing validation in case his password changed
      sign_in @user, :bypass => true
      redirect_to root_path
    else
      render "edit"
    end
  end

  def edit
    @user = User.find(params[:id])
  end

  def update
    user = params[:user]
    @user = User.find(params[:id])
    @user.update_attributes({name: user['name'], email: user['email']})
    render :show
  end

  def change_roles
    @user = User.find(params[:id])
    @roles = UserRole.all
  end

  def update_roles
    message = ''
    roles_to_link = params[:roles_to_link]
    user = User.find(params[:id])
    roles_to_link.each do |r|
      role = UserRole.find(r[0])
      if (r[1] == '1')
        if (!user.user_roles.exists?(role))
          user.user_roles << role
          message += role.title.humanize + ' role was added to user ' + user.name
        end
      else
        if (user.user_roles.exists?(role))
          message += role.title.humanize + ' role was removed from user ' + user.name
          user.user_roles.delete(role)
        end
      end
    end

    redirect_to action: 'index', message: message
  end

  def destroy
    begin
      User.destroy(params[:id])
      render json: {message: 'User with id ' + params[:id] + 'has been deleted'}
    rescue Exception => e
      render json: {responseText: 'User could not be deleted due to ' + e.to_s, :status => 422}
    end
  end

  #helper methods

  def generate_dummy_password
    password_length = 8
    password = Devise.friendly_token.first(password_length)

    return password
  end

end
