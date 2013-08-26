class AddEndDateToStoryBoardObject < ActiveRecord::Migration
  def change
    add_column :story_board_objects, :end_date, :datetime
  end
end
