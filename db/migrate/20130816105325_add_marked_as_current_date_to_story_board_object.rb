class AddMarkedAsCurrentDateToStoryBoardObject < ActiveRecord::Migration
  def change
    add_column :story_board_objects, :marked_as_current_date, :datetime
  end
end
