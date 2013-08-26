class Project < ActiveRecord::Base
  attr_accessible :title, :owner, :description, :end_date, :start_date

  validates_presence_of :title, :owner

  has_many :story_board_objects
  has_and_belongs_to_many :users
end
