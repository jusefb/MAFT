class AddProjectStoryBoardsAssociation < ActiveRecord::Migration
  def change
    add_column :story_board_objects, :project_id, :integer
  end
end
