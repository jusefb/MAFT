class CreateUsersAndUserRoles < ActiveRecord::Migration
  def change
    create_table :users_user_roles do |t|
      t.belongs_to :user
      t.belongs_to :user_role
    end
  end
end
