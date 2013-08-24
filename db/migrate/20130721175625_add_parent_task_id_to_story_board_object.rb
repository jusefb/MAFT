class AddParentTaskIdToStoryBoardObject < ActiveRecord::Migration
  def change
    add_column :story_board_objects, :parent_task_id, :integer
  end
end
