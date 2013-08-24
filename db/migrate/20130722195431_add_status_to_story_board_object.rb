class AddStatusToStoryBoardObject < ActiveRecord::Migration
  def change
    add_column :story_board_objects, :status, :string
  end
end
