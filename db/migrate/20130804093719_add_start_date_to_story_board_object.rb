class AddStartDateToStoryBoardObject < ActiveRecord::Migration
  def change
    add_column :story_board_objects, :start_date, :datetime
  end
end
