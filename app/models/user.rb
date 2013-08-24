class User < ActiveRecord::Base
  attr_accessible :email, :password, :remember_me, :name, :password_confirmation
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  # To change this template use File | Settings | File Templates.
  has_and_belongs_to_many :projects
  has_and_belongs_to_many :user_roles
end