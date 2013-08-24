class RenameUsersUserRolesToUserRolesUsers < ActiveRecord::Migration
  def change
    rename_table :users_user_roles, :user_roles_users
  end
end
