class AddEstimatedTimeToStoryBoardObject < ActiveRecord::Migration
  def change
    add_column :story_board_objects, :estimated_time, :integer
  end
end
